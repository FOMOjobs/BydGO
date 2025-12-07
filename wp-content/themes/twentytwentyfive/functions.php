<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */
// Dodaj kolumnę "Punkty" w tabeli użytkowników
// Dodajemy nową kolumnę w tabeli userów
// Podmieniamy avatar w tabeli użytkowników w WP Admin
// Dodaj kolumny
/**
 * Kolorowanie wierszy w tabeli CPT "scenariusz" na podstawie pola ACF "widoczny"
 */

add_filter('post_class', function ($classes, $class, $post_id) {

    if (get_post_type($post_id) === 'scenariusz') {

        $widoczny = get_field('widoczny', $post_id); // ACF: true/false lub 1/0

        if ($widoczny) {
   //         $classes[] = 'acf-widoczny-yes';
        } else {
            $classes[] = 'acf-widoczny-no';
        }
    }

    return $classes;

}, 10, 3);


add_action('admin_head', function () {
    $screen = get_current_screen();
    if ($screen->post_type !== 'scenariusz') {
        return;
    }
    ?>
    <style>
        /* widoczny = 1 */
        tr.acf-widoczny-yes {
            background-color: #e6ffe6 !important; /* jasna zieleń */
        }

        /* widoczny = 0 */
        tr.acf-widoczny-no {
            background-color: #ffe6e6 !important; /* jasna czerwień */
        }
    </style>
    <?php
});
add_action('rest_api_init', function () {
    register_rest_route('app/v1', '/create_scenariusz', [
        'methods' => 'POST',
        'callback' => 'create_scenariusz_with_punkty',
        'permission_callback' => function() {
            return current_user_can('read'); // dopasuj uprawnienia
        }
    ]);
});

function create_scenariusz_with_punkty(WP_REST_Request $request) {
    $data = $request->get_json_params();

    if (empty($data['opis']) || !isset($data['lokacja']) || !isset($data['punkty'])) {
        return new WP_Error('missing_data', 'Brak wymaganych danych', ['status' => 400]);
    }

    // Tworzenie scenariusza
    $scenariusz_id = wp_insert_post([
        'post_title' => $data['opis'],
        'post_type' => 'scenariusz',
        'post_status' => 'publish',
    ]);

    if (is_wp_error($scenariusz_id)) {
        return $scenariusz_id;
    }

    // ACF pola scenariusza
    update_field('opis', $data['opis'], $scenariusz_id);
$acf_loc = [
    'address' => ' ',            // puste, bo nie masz pełnego adresu
    'lat' => floatval($data['lokacja']['lat'] ?? 0),
    'lng' => floatval($data['lokacja']['lng'] ?? 0),
    'zoom' => 14,               // możesz ustawić domyślnie
    'place_id' => '',
    'street_number' => ' ',
    'street_name' => ' ',
    'city' => ' ',
    'state' => '',
    'post_code' => '',
    'country' => '',
    'country_short' => '',
];
//field_6934465a7178c
update_field('field_6934465a7178c', $acf_loc, $scenariusz_id);
//update_post_meta($scenariusz_id, 'lokacja', serialize($acf_loc));
//    update_field('lokacja', serialize($acf_loc), $scenariusz_id); // ['lat'=>..,'lng'=>..]
    update_field('czy_wirtualny', $data['czy_wirtualny'] ?? false, $scenariusz_id);

    $punkt_ids = [];

    foreach ($data['punkty'] as $p) {
        // Tworzenie punktu
        $punkt_id = wp_insert_post([
            'post_title' => $p['tytul'] ?? 'Nowy punkt',
            'post_type' => 'punkt',
            'post_status' => 'publish',
        ]);

        if (is_wp_error($punkt_id)) continue;

        // ACF pola punktu
        update_field('tytul', $p['tytul'] ?? '', $punkt_id);
$acf_loc = [
    'address' => ' ',            // puste, bo nie masz pełnego adresu
    'lat' => floatval($p['lokacja']['lat'] ?? 0),
    'lng' => floatval($p['lokacja']['lng'] ?? 0),
    'zoom' => 14,               // możesz ustawić domyślnie
    'place_id' => '',
    'street_number' => ' ',
    'street_name' => ' ',
    'city' => ' ',
    'state' => '',
    'post_code' => '',
    'country' => '',
    'country_short' => '',
];
//field_6934465a7178c
update_field('field_693449bfa4a9e', $acf_loc, $punkt_id);
//        update_field('lokacja', $p['lokacja'] ?? '', $punkt_id);
        update_field('opis', $p['opis'] ?? '', $punkt_id);
        update_field('audio', $p['audio'] ?? '', $punkt_id);
        update_field('zagadka', $p['zagadka'] ?? '', $punkt_id);
        update_field('odpowiedz', $p['odpowiedz'] ?? '', $punkt_id);

        // Foto Base64 → attachment
        if (!empty($p['foto'])) {
            $upload = upload_base64_image($p['foto'], $p['tytul'] ?? 'punkt');
            if ($upload && !is_wp_error($upload)) {
                 update_field('foto', $upload, $punkt_id);
		//set_post_thumbnail($punkt_id, $upload);
            }
        }

        $punkt_ids[] = $punkt_id;
    }

    // Powiązanie punktów ze scenariuszem (ACF relacja)
    update_field('relacja', $punkt_ids, $scenariusz_id);

    return [
        'success' => true,
        'scenariusz_id' => $scenariusz_id,
        'punkty_ids' => $punkt_ids
    ];
}

// Funkcja do uploadu base64
function upload1_base64_image($base64_image, $title = 'image') {
    if (preg_match('/^data:image\/(\w+);base64,/', $base64_image, $type)) {
        $data = substr($base64_image, strpos($base64_image, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, etc.
        $data = base64_decode($data);

        if ($data === false) return new WP_Error('base64_decode', 'Nieprawidłowy obraz');

        $filename = $title . '.' . $type;
        $upload_file = wp_upload_bits($filename, null, $data);

        if (!$upload_file['error']) {
            $wp_filetype = wp_check_filetype($filename, null);
            $attachment = [
                'post_mime_type' => $wp_filetype['type'],
                'post_title' => sanitize_file_name($filename),
                'post_content' => '',
                'post_status' => 'inherit'
            ];
            $attach_id = wp_insert_attachment($attachment, $upload_file['file']);
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            $attach_data = wp_generate_attachment_metadata($attach_id, $upload_file['file']);
            wp_update_attachment_metadata($attach_id, $attach_data);
            return $attach_id;
        }
    }
    return null;
}

add_filter('manage_zgloszeniaproblemow_posts_columns', function($columns) {
    // Zachowaj istniejące kolumny, dodaj nasze
    $columns['zglaszajacy'] = 'Zgłaszający';
    $columns['zrzut_ekranu'] = 'Zrzut ekranu';
    return $columns;
});

// Wypełnij kolumny danymi
add_action('manage_zgloszeniaproblemow_posts_custom_column', function($column, $post_id) {
    switch ($column) {
        case 'zglaszajacy':
            $user_id = get_post_meta($post_id, 'zglaszajacy', true);
            if ($user_id) {
                $user = get_userdata($user_id);
                echo $user ? esc_html($user->display_name) : '-';
            } else {
                echo '-';
            }
            break;

        case 'zrzut_ekranu':
            $attachment_id = get_post_meta($post_id, 'zrzutekranu', true);
            if ($attachment_id) {
                $url = wp_get_attachment_url($attachment_id);
                if ($url) {
                    echo '<img src="' . esc_url($url) . '" style="max-width:80px; height:auto;">';
                }
            } else {
                echo '-';
            }
            break;
    }
}, 10, 2);

add_action('init', function() {
    remove_post_type_support('zgloszeniaproblemow', 'editor');          // usuwa box z treścią (content)
    remove_post_type_support('zgloszeniaproblemow', 'thumbnail');       // usuwa featured image
});
add_action('rest_api_init', function() {
    register_rest_route('app/v1', '/reportissue', array(
        'methods' => 'POST',
        'callback' => 'create_report_issue',
        'permission_callback' => function() {
            return is_user_logged_in(); // tylko zalogowani użytkownicy
        }
    ));
});

function create_report_issue($request) {
    $params = $request->get_json_params();

    $user_id = get_current_user_id();
    $kategoria = sanitize_text_field($params['kategoria'] ?? '');
    $opis = sanitize_textarea_field($params['opis'] ?? '');

    if (empty($kategoria) || empty($opis)) {
        return new WP_Error('missing_data', 'Kategoria i opis są wymagane', array('status' => 400));
    }

    // Tworzymy nowy post CPT
    $post_id = wp_insert_post(array(
        'post_type' => 'zgloszeniaproblemow',
        'post_title' => wp_trim_words($opis, 6, '...'),
        'post_content' => $opis,
        'post_status' => 'publish',
        'post_author' => $user_id,
    ));

    if (is_wp_error($post_id)) {
        return new WP_Error('create_failed', 'Nie udało się utworzyć zgłoszenia', array('status' => 500));
    }

    // Ustawiamy pola ACF
    if (function_exists('update_field')) {
        update_field('kategoria', $kategoria, $post_id);
        update_field('opis', $opis, $post_id);
        update_field('zglaszajacy', $user_id, $post_id);

        // Obsługa przesłanego pliku obrazka (base64 lub multipart)
        if (!empty($params['zrzutekranu'])) {
            $upload = upload_base64_image($params['zrzutekranu'], $post_id);
            if ($upload) {
                update_field('zrzutekranu', $upload, $post_id);
            }
        }
    }

    return array(
        'success' => true,
        'post_id' => $post_id,
        'message' => 'Zgłoszenie problemu zostało utworzone'
    );
}

// Funkcja do uploadu base64 image
function upload_base64_image($base64_image, $post_id) {
    if (preg_match('/^data:image\/(\w+);base64,/', $base64_image, $type)) {
        $data = substr($base64_image, strpos($base64_image, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif

        $data = base64_decode($data);
        if ($data === false) return false;

        $filename = 'screenshot-' . time() . '.' . $type;
        $upload_dir = wp_upload_dir();
        $file_path = $upload_dir['path'] . '/' . $filename;
        file_put_contents($file_path, $data);

        $wp_filetype = wp_check_filetype($filename, null);

        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => sanitize_file_name($filename),
            'post_content' => '',
            'post_status' => 'inherit'
        );

        $attach_id = wp_insert_attachment($attachment, $file_path, $post_id);
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attach_data = wp_generate_attachment_metadata($attach_id, $file_path);
        wp_update_attachment_metadata($attach_id, $attach_data);

        return $attach_id;
    }

    return false;
}
add_filter('jwt_auth_token_before_dispatch', 'bydgo_extend_jwt_token', 10, 2);
function bydgo_extend_jwt_token($data, $user) {

    $user_id = $user->ID;

    // --- 1. LICZBA SCENARIUSZY ---
    $scenarios_count = wp_count_posts('scenariusz')->publish ?? 0;

    // --- 2. LICZBA WSZYSTKICH PUNKTÓW ---
    $points_count = wp_count_posts('punkt')->publish ?? 0;

    // --- 3. PUNKTY ODWIEDZONE PRZEZ USERA ---
    $visited = get_user_meta($user_id, 'punkty_odwiedzone', true);

    if (is_string($visited)) {
        $visited = json_decode($visited, true);
    }
    $visited_points_ids = is_array($visited) 
        ? wp_list_pluck($visited, 'punkt_id')
        : [];

    $user_points_count = count($visited_points_ids);

    // --- 4. ILE SCENARIUSZY UKOŃCZONYCH ---
    $completed_scenarios = 0;

    // Pobierz wszystkie scenariusze
    $scenarios = get_posts([
        'post_type' => 'scenariusz',
        'posts_per_page' => -1
    ]);

    foreach ($scenarios as $scenario) {

        // Pobierz ACF powiązane punkty
        $punkty_scenariusza = get_field('punkty', $scenario->ID);

        if (!is_array($punkty_scenariusza) || empty($punkty_scenariusza)) {
            continue;
        }

        // Każdy punkt ma ID
        $scenario_point_ids = [];

        foreach ($punkty_scenariusza as $p) {
            if (is_array($p) && isset($p['ID'])) {
                $scenario_point_ids[] = $p['ID'];
            } elseif (is_numeric($p)) {
                $scenario_point_ids[] = $p; 
            }
        }

        // Sprawdź czy user zrobił wszystkie punkty
        $diff = array_diff($scenario_point_ids, $visited_points_ids);

        if (empty($diff)) {
            $completed_scenarios++;
        }
    }

    // --- DODANIE DANYCH DO TOKENU ---
    $data['extra'] = [
	'visited_points_id' => $visited_points_ids,
        'count_scenarios'  => $scenarios_count,
        'count_points'     => $points_count,
        'user_points'      => $user_points_count,
        'user_scenarios_completed' => $completed_scenarios,
    ];

    return $data;
}

add_filter('jwt_auth_token_before_dispatch', function ($data, $user) {
    // Pobranie custom avatara z usermeta
    $avatar_id = get_user_meta($user->ID, 'custom_avatar', true);
    $avatar_url = $avatar_id ? wp_get_attachment_image_url($avatar_id, 'thumbnail') : '';

    // Dodanie do odpowiedzi
    $data['user']['custom_avatar'] = $avatar_url;

    return $data;
}, 10, 2);

add_filter('get_avatar', function($avatar, $id_or_email, $size, $default, $alt, $args) {
    // Sprawdzamy, czy jesteśmy w panelu admin
    if (is_admin()) {
        $user_id = 0;

        if (is_numeric($id_or_email)) {
            $user_id = (int) $id_or_email;
        } elseif ($id_or_email instanceof WP_User) {
            $user_id = $id_or_email->ID;
        } elseif ($id_or_email instanceof WP_Post) {
            $user_id = $id_or_email->post_author;
        } elseif ($id_or_email instanceof WP_Comment) {
            $user_id = $id_or_email->user_id;
        }

        if ($user_id) {
            $attachment_id = get_user_meta($user_id, 'custom_avatar', true);
            if ($attachment_id) {
                $url = wp_get_attachment_image_url($attachment_id, [$size, $size]);
                if ($url) {
                    $avatar = '<img src="' . esc_url($url) . '" alt="' . esc_attr($alt) . '" width="' . esc_attr($size) . '" height="' . esc_attr($size) . '" style="border-radius:50%">';
                }
            }
        }
    }
    return $avatar;
}, 10, 6);

add_action('rest_api_init', function() {
    register_rest_route('app/v1', '/avatar', [
        'methods' => 'POST',
        'callback' => 'app_update_user_avatar',
        'permission_callback' => function() {
            return is_user_logged_in(); // tylko zalogowani
        }
    ]);
});

function app_update_user_avatar($request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('no_user', 'Brak zalogowanego użytkownika', ['status' => 401]);
    }

    // Sprawdzenie, czy plik został wysłany
    if (empty($_FILES['avatar'])) {
        return new WP_Error('no_file', 'Brak przesłanego pliku', ['status' => 400]);
    }

    $file = $_FILES['avatar'];

    // Wstawienie pliku do mediów
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');
    require_once(ABSPATH . 'wp-admin/includes/image.php');

    $overrides = ['test_form' => false];
    $attachment_id = media_handle_upload('avatar', 0, [], $overrides);

    if (is_wp_error($attachment_id)) {
        return new WP_Error('upload_error', 'Błąd przesyłania pliku', ['status' => 500]);
    }

    // Ustawienie avatara w usermeta (przykładowo, używamy meta key 'custom_avatar')
    update_user_meta($user_id, 'custom_avatar', $attachment_id);

    // Pobranie URL nowego avatara
    $avatar_url = wp_get_attachment_url($attachment_id);

    return [
        'success' => true,
        'avatar_url' => $avatar_url
    ];
}
add_shortcode('punkty_wszystkich_userow', function() {

    $users = get_users();
    $total_points = 0;

    foreach ($users as $user) {

        $visited = get_user_meta($user->ID, 'punkty_odwiedzone', true);

        // Jeśli zapisane jako string → json_decode
        if (is_string($visited)) {
            $visited = json_decode($visited, true);
        }

        // Jeśli tablica → dolicz jej elementy
        if (is_array($visited)) {
            $total_points += count($visited);
        }
    }

    return $total_points;
});

add_shortcode('liczba_punktow', function() {
    $count = wp_count_posts('punkt');
    return isset($count->publish) ? intval($count->publish) : 0;
});
add_shortcode('liczba_scenariuszy', function() {
    $count = wp_count_posts('scenariusz');
    return isset($count->publish) ? intval($count->publish) : 0;
});

add_shortcode('liczba_uzytkownikow', function() {
    $count_users = count_users();
return $count_users['total_users'];
//    return '<h2>Liczba użytkowników</h2><p style="font-size: 24px; font-weight: bold;">' . $count_users['total_users'] . '';
});
add_filter('manage_users_columns', function($columns) {
    $columns['punkty'] = 'Punkty';
    return $columns;
});
add_filter('manage_users_columns', function($columns) {
    if (isset($columns['name'])) {
        unset($columns['name']);
    }
    return $columns;
});
add_filter('manage_users_columns', function($columns) {
    if (isset($columns['posts'])) {
        unset($columns['posts']);
    }
    return $columns;
});
// Wypełnij kolumnę danymi
add_action('manage_users_custom_column', function($value, $column_name, $user_id) {
    if ($column_name === 'punkty') {
$visited = get_user_meta($user_id, 'punkty_odwiedzone', true);
if (is_string($visited)) {
    $visited = json_decode($visited, true);
}
$count = is_array($visited) ? count($visited) : 0;
 $total = wp_count_posts('punkt')->publish ?? 0;

        return "$count / $total";
//return $count;
    }
    return $value;
}, 10, 3);

add_action('admin_menu', function() {
    remove_menu_page('index.php'); // Usuwa Kokpit
 remove_menu_page('edit.php');  
   remove_menu_page('edit.php?post_type=page');
  remove_menu_page('edit-comments.php');   // Komentarze
});

add_action('init', function() {
    // Odłącz tagi od CPT 'scenariusz'
    unregister_taxonomy_for_object_type('post_tag', 'scenariusz');
}, 100);

add_action('admin_menu', function() {
    // usuwa tagi tylko dla post type 'scenariusz'
    remove_submenu_page(
        'edit.php?post_type=scenariusz', // menu główne CPT
        'edit-tags.php?taxonomy=post_tag&post_type=scenariusz' // link do tagów
    );
});

add_action('admin_menu', function() {
    // Ukryj metabox tagów w CPT 'punkt'
    remove_meta_box('tagsdiv-post_tag', 'punkt', 'side');

    // Jeśli chcesz też dla 'scenariusz':
    remove_meta_box('tagsdiv-post_tag', 'scenariusz', 'side');
});

add_action('admin_head', function() {
    global $post_type;
    if ( $post_type === 'punkt' || $post_type === 'scenariusz') {
        echo '<style>
            #edit-slug-box,        /* bezpośredni link (permalink) */
            #slugdiv               /* w starszych wersjach WordPress */
            { display: none !important; }
        </style>';
    }
});
add_action('admin_menu', function() {
    remove_meta_box('slugdiv', 'scenariusz', 'normal');
    remove_meta_box('slugdiv', 'punkt', 'normal');
});
add_action('do_meta_boxes', function() {
    remove_meta_box('postimagediv', 'punkt', 'side');
});
add_action('init', function() {

    // CPT bez edytora treści
    remove_post_type_support('scenariusz', 'editor');
    remove_post_type_support('punkt', 'editor');

});
add_filter( 'use_block_editor_for_post_type', '__return_false', 10 );
add_action('rest_api_init', function () {
    register_rest_field('scenariusz', 'category_data', [
        'get_callback' => function($post_arr) {
            $cats = get_the_terms($post_arr['id'], 'category');
            if (!$cats || is_wp_error($cats)) return [];
            return array_map(function($cat) {
                return [
                    'id' => $cat->term_id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                ];
            }, $cats);
        },
    ]);
});
add_action('rest_api_init', function () {
    register_rest_route('app/v1', '/register', [
        'methods' => 'POST',
        'callback' => 'app_register_user',
        'permission_callback' => '__return_true', // publiczny endpoint
    ]);
});

function app_register_user(WP_REST_Request $request) {
    $data = $request->get_json_params();
    $username = sanitize_user($data['username']);
    $email = sanitize_email($data['email']);
    $password = $data['password'];

    if (username_exists($username) || email_exists($email)) {
        return new WP_Error('user_exists', 'Użytkownik już istnieje, zaloguj się!', ['status' => 400]);
    }

    $user_id = wp_create_user($username, $password, $email);
    if (is_wp_error($user_id)) {
        return $user_id;
    }

    $user = new WP_User($user_id);
    $user->set_role('app_user'); // ustawienie roli

    return [
        'success' => true,
        'user_id' => $user_id,
        'username' => $username,
    ];
}
// Ukrywamy scenariusze, które mają ACF 'widoczny' = false
add_filter('rest_scenariusz_query', function($args, $request) {

    // Dodaj meta_query filtrujące widoczność
    $args['meta_query'][] = [
        'key'     => 'widoczny',
        'value'   => '1',
        'compare' => '='
    ];

    return $args;

}, 10, 2);

add_filter('rest_prepare_scenariusz', function($response, $post, $request) {

    // Pobierz tablicę punktów z pola relacji 'relacja'
    $relacja = get_field('relacja', $post->ID);

    if ($relacja && is_array($relacja)) {
        $punkty_details = [];

        foreach ($relacja as $punkt) {
            // $punkt może być obiektem WP_Post lub tablicą z ID
            $punkt_id = is_object($punkt) ? $punkt->ID : $punkt;

            $punkt_post = get_post($punkt_id);
            if ($punkt_post) {
                $acf_fields = get_fields($punkt_id) ?: [];

                // Możesz ukryć pole odpowiedzi, jeśli nie chcesz go wysyłać do frontu
                if (isset($acf_fields['odpowiedz_poprawna'])) {
                    unset($acf_fields['odpowiedz_poprawna']);
                }

                $punkty_details[] = [
                    'id' => $punkt_post->ID,
                    'title' => $punkt_post->post_title,
                    'content' => $punkt_post->post_content,
                    'acf' => $acf_fields,
                ];
            }
        }

        $response->data['punkty_details'] = $punkty_details;
    }

    return $response;
}, 10, 3);

add_filter('rest_prepare_punkt', function($response, $post, $request) {
    // Pobierz zalogowanego użytkownika
     if (isset($response->data['acf']['odpowiedz'])) {
        unset($response->data['acf']['odpowiedz']);
    }
	
	$user_id = get_current_user_id();

    // Pobierz wszystkie zapisane odpowiedzi użytkownika
    $json = get_user_meta($user_id, 'punkty_odwiedzone', true);
    $punkty = $json ? json_decode($json, true) : array();

    // Szukamy odpowiedzi dla tego punktu
    $user_answer = null;
    foreach ($punkty as $p) {
        if ($p['punkt_id'] == $post->ID) {
            $user_answer = $p;
            break;
        }
    }

    // Dodajemy do pola 'user_progress' w response
    $response->data['user_progress'] = $user_answer; // null jeśli brak odpowiedzi

    return $response;
}, 10, 3);


add_action('rest_api_init', function() {
    register_rest_route('app/v1', '/progress', array(
        'methods' => 'GET',
        'callback' => function() {
            $user_id = get_current_user_id();
            $json = get_user_meta($user_id, 'punkty_odwiedzone', true);
            $punkty = $json ? json_decode($json, true) : array();
            return $punkty;
        },
        'permission_callback' => function() {
            return current_user_can('read'); 
        }
    ));
});


add_action('rest_api_init', function() {
    register_rest_route('app/v1', '/answer', array(
        'methods' => 'POST',
        'callback' => 'save_user_answer_if_correct',
        'permission_callback' => function() {
            return current_user_can('read'); // app_user ma read
        }
    ));
});
function normalize_answer($str) {
    // Zamiana polskich znaków na bez znaków diakrytycznych
    $polish = ['ą','ć','ę','ł','ń','ó','ś','ź','ż'];
    $ascii  = ['a','c','e','l','n','o','s','z','z'];
    $str = str_replace($polish, $ascii, mb_strtolower($str, 'UTF-8'));
    
    // Usuń spacje i inne białe znaki
    $str = preg_replace('/\s+/', '', $str);
    
    return $str;
}
function save_user_answer_if_correct($request) {
    $user_id = get_current_user_id();
    $punkt_id = $request->get_param('punkt_id');
    $user_answer = $request->get_param('user_answer');

    if (!$punkt_id || !$user_answer) {
        return new WP_Error('missing_data', 'Brak wymaganych danych', array('status' => 400));
    }

    // Pobierz pole ACF 'odpowiedz_poprawna' z CPT 'punkt'
    $correct_answer = get_field('odpowiedz', $punkt_id);

    if (!$correct_answer) {
        return new WP_Error('no_correct_answer', 'Brak poprawnej odpowiedzi w punkcie', array('status' => 400));
    }

    // Porównanie odpowiedzi
if (normalize_answer($user_answer) !== normalize_answer($correct_answer)) {

        return array(
            'success' => false,
            'message' => 'Błędna odpowiedź',
            'data' => array(
                'punkt_id' => $punkt_id,
                'user_answer' => $user_answer
            )
        );
    }

    // Pobierz istniejący progres
    $json = get_user_meta($user_id, 'punkty_odwiedzone', true);
    $punkty = $json ? json_decode($json, true) : array();

    // Sprawdź, czy już istnieje wpis dla tego punkt_id
    $found = false;
    foreach ($punkty as &$p) {
        if ($p['punkt_id'] == $punkt_id) {
            // Nadpisz ostatnią odpowiedź
            $p['user_answer'] = $user_answer;
            $p['is_correct'] = true;
            $p['timestamp'] = current_time('Y-m-d H:i:s');
            $found = true;
            break;
        }
    }
    unset($p);

    // Jeśli nie znaleziono wpisu, dodaj nowy
    if (!$found) {
        $punkty[] = array(
            'punkt_id' => $punkt_id,
            'user_answer' => $user_answer,
            'is_correct' => true,
            'timestamp' => current_time('Y-m-d H:i:s')
        );
    }

    // Zapisz w user meta
    update_user_meta($user_id, 'punkty_odwiedzone', json_encode($punkty));

    return array(
        'success' => true,
        'message' => 'Odpowiedź poprawna i zapisana',
        'data' => array(
            'punkt_id' => $punkt_id,
            'user_answer' => $user_answer,
            'is_correct' => true
        )
    );
}



function add_app_user_role() {
    add_role(
        'app_user', // slug roli
        'Użytkownik Aplikacji', // nazwa wyświetlana
        array(
            'read' => true,           // wymagane, żeby mogli się logować
            'edit_posts' => false,    // nie mogą edytować wpisów
            'delete_posts' => false,  // nie mogą usuwać wpisów
            'upload_files' => false,  // nie mogą przesyłać plików
        )
    );
}
add_action('init', 'add_app_user_role');

function my_acf_google_map_api( $api ){
    
    $api['key'] = 'AIzaSyCHGdkzaixChWPmBBoB7mQVZN92iR1N2ds';
    
    return $api;
    
}

add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');


// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style() {
		add_editor_style( 'assets/css/editor-style.css' );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues the theme stylesheet on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	/**
	 * Enqueues the theme stylesheet on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles() {
		$suffix = SCRIPT_DEBUG ? '' : '.min';
		$src    = 'style' . $suffix . '.css';

		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( $src ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
		wp_style_add_data(
			'twentytwentyfive-style',
			'path',
			get_parent_theme_file_path( $src )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;

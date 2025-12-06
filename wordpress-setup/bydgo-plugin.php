<?php
/**
 * Plugin Name: BydGO! - Gra Miejska
 * Plugin URI: https://bydgo.bydgoszcz.pl
 * Description: Wtyczka do zarządzania wyzwaniami miejskimi w grze BydGO! - Ścieżki Pamięci 2.0
 * Version: 1.0.0
 * Author: BydGO! Team
 * Author URI: https://bydgo.bydgoszcz.pl
 * Text Domain: bydgo
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPL v2 or later
 */

// Zabezpieczenie przed bezpośrednim dostępem
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Rejestracja Custom Post Type: Wyzwania
 */
function bydgo_register_wyzwania_cpt() {
    $labels = array(
        'name'                  => _x('Wyzwania', 'Post Type General Name', 'bydgo'),
        'singular_name'         => _x('Wyzwanie', 'Post Type Singular Name', 'bydgo'),
        'menu_name'             => __('Wyzwania BydGO', 'bydgo'),
        'name_admin_bar'        => __('Wyzwanie', 'bydgo'),
        'archives'              => __('Archiwum Wyzwań', 'bydgo'),
        'attributes'            => __('Atrybuty Wyzwania', 'bydgo'),
        'parent_item_colon'     => __('Wyzwanie nadrzędne:', 'bydgo'),
        'all_items'             => __('Wszystkie Wyzwania', 'bydgo'),
        'add_new_item'          => __('Dodaj nowe wyzwanie', 'bydgo'),
        'add_new'               => __('Dodaj nowe', 'bydgo'),
        'new_item'              => __('Nowe wyzwanie', 'bydgo'),
        'edit_item'             => __('Edytuj wyzwanie', 'bydgo'),
        'update_item'           => __('Aktualizuj wyzwanie', 'bydgo'),
        'view_item'             => __('Zobacz wyzwanie', 'bydgo'),
        'view_items'            => __('Zobacz wyzwania', 'bydgo'),
        'search_items'          => __('Szukaj wyzwań', 'bydgo'),
        'not_found'             => __('Nie znaleziono', 'bydgo'),
        'not_found_in_trash'    => __('Nie znaleziono w koszu', 'bydgo'),
        'featured_image'        => __('Zdjęcie wyzwania', 'bydgo'),
        'set_featured_image'    => __('Ustaw zdjęcie wyzwania', 'bydgo'),
        'remove_featured_image' => __('Usuń zdjęcie wyzwania', 'bydgo'),
        'use_featured_image'    => __('Użyj jako zdjęcie wyzwania', 'bydgo'),
        'insert_into_item'      => __('Wstaw do wyzwania', 'bydgo'),
        'uploaded_to_this_item' => __('Przesłane do tego wyzwania', 'bydgo'),
        'items_list'            => __('Lista wyzwań', 'bydgo'),
        'items_list_navigation' => __('Nawigacja listy wyzwań', 'bydgo'),
        'filter_items_list'     => __('Filtruj listę wyzwań', 'bydgo'),
    );

    $args = array(
        'label'                 => __('Wyzwanie', 'bydgo'),
        'description'           => __('Wyzwania gry miejskiej BydGO!', 'bydgo'),
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'taxonomies'            => array('category'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-location-alt',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true, // KLUCZOWE dla REST API
        'rest_base'             => 'wyzwania',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('wyzwania', $args);
}
add_action('init', 'bydgo_register_wyzwania_cpt', 0);

/**
 * Rejestracja pól ACF programatycznie (bez GUI)
 */
function bydgo_register_acf_fields() {
    // Sprawdź czy ACF jest zainstalowane
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_bydgo_wyzwania',
        'title' => 'Szczegóły Wyzwania',
        'fields' => array(
            // Nazwa lokalizacji
            array(
                'key' => 'field_location_name',
                'label' => 'Nazwa Lokalizacji',
                'name' => 'location_name',
                'type' => 'text',
                'instructions' => 'Np. "Ławeczka Mariana Rejewskiego, Bydgoszcz"',
                'required' => 1,
                'default_value' => '',
                'placeholder' => 'Wprowadź nazwę lokalizacji',
            ),
            // Współrzędne GPS
            array(
                'key' => 'field_location_coords',
                'label' => 'Współrzędne GPS',
                'name' => 'location_coords',
                'type' => 'text',
                'instructions' => 'Format: lat,lng (np. "53.1235,18.0084")',
                'required' => 1,
                'default_value' => '',
                'placeholder' => '53.1235,18.0084',
            ),
            // Poziom trudności
            array(
                'key' => 'field_difficulty',
                'label' => 'Poziom Trudności',
                'name' => 'difficulty',
                'type' => 'select',
                'instructions' => 'Wybierz poziom trudności wyzwania',
                'required' => 1,
                'choices' => array(
                    'easy' => 'Łatwy (Easy)',
                    'medium' => 'Średni (Medium)',
                    'hard' => 'Trudny (Hard)',
                ),
                'default_value' => 'medium',
                'allow_null' => 0,
                'multiple' => 0,
                'ui' => 1,
                'return_format' => 'value',
            ),
            // Punkty za ukończenie
            array(
                'key' => 'field_points',
                'label' => 'Punkty',
                'name' => 'points',
                'type' => 'number',
                'instructions' => 'Liczba punktów za ukończenie wyzwania',
                'required' => 1,
                'default_value' => 100,
                'placeholder' => '100',
                'min' => 10,
                'max' => 1000,
                'step' => 10,
            ),
            // Tajny kod weryfikacyjny
            array(
                'key' => 'field_secret_code',
                'label' => 'Tajny Kod Weryfikacyjny',
                'name' => 'secret_code',
                'type' => 'text',
                'instructions' => 'Kod, który użytkownik musi wprowadzić aby zaliczyć wyzwanie (np. liczba okien, hasło na tablicy)',
                'required' => 0,
                'default_value' => '',
                'placeholder' => 'np. "42" lub "ENIGMA"',
            ),
            // URL obrazu (opcjonalnie, jeśli nie używamy featured image)
            array(
                'key' => 'field_image_url',
                'label' => 'URL Obrazu (opcjonalnie)',
                'name' => 'image_url',
                'type' => 'url',
                'instructions' => 'Link do obrazu z Unsplash lub innego źródła. Pozostaw puste aby użyć Featured Image.',
                'required' => 0,
                'default_value' => '',
                'placeholder' => 'https://source.unsplash.com/800x600/?city',
            ),
            // Kategoria wyzwania
            array(
                'key' => 'field_category',
                'label' => 'Kategoria',
                'name' => 'category',
                'type' => 'select',
                'instructions' => 'Kategoria wyzwania',
                'required' => 1,
                'choices' => array(
                    'culture' => 'Kultura',
                    'education' => 'Edukacja',
                    'ecology' => 'Ekologia',
                    'sport' => 'Sport',
                    'social' => 'Społeczne',
                    'health' => 'Zdrowie',
                ),
                'default_value' => 'culture',
                'allow_null' => 0,
                'multiple' => 0,
                'ui' => 1,
                'return_format' => 'value',
            ),
            // Wymagania
            array(
                'key' => 'field_requirements',
                'label' => 'Wymagania',
                'name' => 'requirements',
                'type' => 'textarea',
                'instructions' => 'Każde wymaganie w nowej linii',
                'required' => 0,
                'default_value' => 'Smartfon z GPS',
                'placeholder' => 'Smartfon z GPS\nWygodne buty\nWoda do picia',
                'rows' => 4,
            ),
            // Korzyści
            array(
                'key' => 'field_benefits',
                'label' => 'Korzyści',
                'name' => 'benefits',
                'type' => 'textarea',
                'instructions' => 'Każda korzyść w nowej linii',
                'required' => 0,
                'default_value' => 'Pieczątka w wirtualnym paszporcie',
                'placeholder' => 'Pieczątka w wirtualnym paszporcie\nPoznanie historii miasta\nAktywność fizyczna',
                'rows' => 4,
            ),
            // Email kontaktowy
            array(
                'key' => 'field_contact_email',
                'label' => 'Email Kontaktowy',
                'name' => 'contact_email',
                'type' => 'email',
                'instructions' => 'Email do kontaktu w sprawie wyzwania',
                'required' => 0,
                'default_value' => 'gra@bydgo.bydgoszcz.pl',
                'placeholder' => 'kontakt@bydgo.bydgoszcz.pl',
            ),
            // Organizacja
            array(
                'key' => 'field_organization',
                'label' => 'Organizacja',
                'name' => 'organization',
                'type' => 'text',
                'instructions' => 'Nazwa organizacji prowadzącej wyzwanie',
                'required' => 0,
                'default_value' => 'Muzeum Okręgowe Bydgoszczy',
                'placeholder' => 'Muzeum Okręgowe Bydgoszczy',
            ),
            // Limit uczestników
            array(
                'key' => 'field_max_volunteers',
                'label' => 'Maksymalna liczba uczestników',
                'name' => 'max_volunteers',
                'type' => 'number',
                'instructions' => 'Limit miejsc (0 = bez limitu)',
                'required' => 0,
                'default_value' => 0,
                'min' => 0,
                'max' => 10000,
                'step' => 1,
            ),
            // Obecna liczba uczestników
            array(
                'key' => 'field_current_volunteers',
                'label' => 'Obecna liczba uczestników',
                'name' => 'current_volunteers',
                'type' => 'number',
                'instructions' => 'Liczba osób, które już się zgłosiły',
                'required' => 0,
                'default_value' => 0,
                'min' => 0,
                'step' => 1,
            ),
            // Czas trwania
            array(
                'key' => 'field_time_commitment',
                'label' => 'Szacowany czas',
                'name' => 'time_commitment',
                'type' => 'text',
                'instructions' => 'Szacowany czas potrzebny na ukończenie wyzwania',
                'required' => 0,
                'default_value' => '1-2 godziny',
                'placeholder' => '1-2 godziny',
            ),
            // Data rozpoczęcia
            array(
                'key' => 'field_date_start',
                'label' => 'Data rozpoczęcia',
                'name' => 'date_start',
                'type' => 'date_picker',
                'instructions' => 'Od kiedy wyzwanie jest dostępne',
                'required' => 0,
                'display_format' => 'Y-m-d',
                'return_format' => 'Y-m-d',
            ),
            // Data zakończenia
            array(
                'key' => 'field_date_end',
                'label' => 'Data zakończenia',
                'name' => 'date_end',
                'type' => 'date_picker',
                'instructions' => 'Do kiedy wyzwanie jest dostępne',
                'required' => 0,
                'display_format' => 'Y-m-d',
                'return_format' => 'Y-m-d',
            ),
            // Priorytet (pilne)
            array(
                'key' => 'field_is_urgent',
                'label' => 'Pilne?',
                'name' => 'is_urgent',
                'type' => 'true_false',
                'instructions' => 'Czy wyzwanie jest pilne/priorytetowe?',
                'required' => 0,
                'default_value' => 0,
                'ui' => 1,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'wyzwania',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'Pola dla wyzwań gry miejskiej BydGO!',
        'show_in_rest' => 1, // KLUCZOWE dla REST API
    ));
}
add_action('acf/init', 'bydgo_register_acf_fields');

/**
 * Dodanie featured image URL do REST API response
 */
function bydgo_add_featured_image_to_rest($data, $post, $context) {
    $featured_image_id = get_post_thumbnail_id($post->ID);

    if ($featured_image_id) {
        $featured_image_url = wp_get_attachment_image_src($featured_image_id, 'large');
        $data->data['featured_media_url'] = $featured_image_url ? $featured_image_url[0] : '';
    } else {
        $data->data['featured_media_url'] = '';
    }

    return $data;
}
add_filter('rest_prepare_wyzwania', 'bydgo_add_featured_image_to_rest', 10, 3);

/**
 * Dodanie custom endpoint dla statystyk
 */
function bydgo_register_rest_routes() {
    register_rest_route('bydgo/v1', '/stats', array(
        'methods' => 'GET',
        'callback' => 'bydgo_get_stats',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'bydgo_register_rest_routes');

/**
 * Endpoint zwracający statystyki gry
 */
function bydgo_get_stats() {
    $total_challenges = wp_count_posts('wyzwania')->publish;
    $total_participants = 0;

    // Zlicz uczestników ze wszystkich wyzwań
    $args = array(
        'post_type' => 'wyzwania',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    );
    $challenges = get_posts($args);

    foreach ($challenges as $challenge) {
        $current = get_field('current_volunteers', $challenge->ID);
        $total_participants += intval($current);
    }

    return array(
        'total_challenges' => intval($total_challenges),
        'total_participants' => $total_participants,
        'city' => 'Bydgoszcz',
        'game_name' => 'BydGO! - Ścieżki Pamięci 2.0',
    );
}

/**
 * Flush rewrite rules przy aktywacji wtyczki
 */
function bydgo_activate_plugin() {
    bydgo_register_wyzwania_cpt();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'bydgo_activate_plugin');

/**
 * Flush rewrite rules przy deaktywacji wtyczki
 */
function bydgo_deactivate_plugin() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'bydgo_deactivate_plugin');

/**
 * Dodanie informacji o wtyczce w panelu administracyjnym
 */
function bydgo_admin_notice() {
    if (!function_exists('acf_add_local_field_group')) {
        ?>
        <div class="notice notice-error">
            <p><strong>BydGO! - Gra Miejska:</strong> Wtyczka wymaga zainstalowania <strong>Advanced Custom Fields (ACF)</strong> oraz <strong>ACF to REST API</strong>!</p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'bydgo_admin_notice');

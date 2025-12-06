<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planty Możliwości - Krakowskie Cyfrowe Centrum Wolontariatu</title>
    <meta name="description" content="Łączymy mieszkańców Krakowa z inicjatywami, które naprawdę się liczą. Dołącz do wolontariatu już dziś!">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: 262 83% 58%;
            --primary-foreground: 210 20% 98%;
            --secondary: 220 14% 96%;
            --secondary-foreground: 220 9% 46%;
            --accent: 220 14% 96%;
            --accent-foreground: 220 9% 46%;
            --destructive: 0 84% 60%;
            --destructive-foreground: 210 20% 98%;
            --muted: 220 14% 96%;
            --muted-foreground: 220 9% 46%;
            --card: 0 0% 100%;
            --card-foreground: 222 47% 11%;
            --popover: 0 0% 100%;
            --popover-foreground: 222 47% 11%;
            --border: 220 13% 91%;
            --input: 220 13% 91%;
            --ring: 262 83% 58%;
            --background: 0 0% 100%;
            --foreground: 222 47% 11%;
            --radius: 0.5rem;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: hsl(var(--foreground));
            background: hsl(var(--background));
        }

        /* Navigation */
        .nav-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid hsl(var(--border));
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            font-size: 1.25rem;
            color: hsl(var(--primary));
            text-decoration: none;
        }

        .nav-logo img {
            height: 48px;
            width: auto;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        .nav-links a {
            color: hsl(var(--foreground));
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: hsl(var(--primary));
        }

        .nav-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .language-selector {
            display: flex;
            gap: 0.5rem;
        }

        .language-btn {
            padding: 0.5rem 0.75rem;
            border: 1px solid hsl(var(--border));
            background: transparent;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .language-btn:hover,
        .language-btn.active {
            background: hsl(var(--primary));
            color: white;
            border-color: hsl(var(--primary));
        }

        .btn {
            padding: 0.625rem 1rem;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: hsl(var(--primary));
            color: white;
        }

        .btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        .btn-outline {
            border: 2px solid hsl(var(--input));
            background: transparent;
            color: hsl(var(--foreground));
        }

        .btn-outline:hover {
            border-color: hsl(var(--primary));
            background: hsl(var(--accent));
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }

        /* Hero Section */
        .hero-section {
            min-height: 85vh;
            background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(270 80% 45%) 100%);
            padding: 8rem 1.5rem 4rem;
            position: relative;
            overflow: hidden;
        }

        .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }

        .hero-content h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            background: white;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .hero-content .subtitle {
            font-size: 1.125rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 1.5rem;
        }

        .hero-content .description {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 2rem;
            line-height: 1.8;
        }

        .hero-actions {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .hero-stats {
            display: flex;
            gap: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: white;
        }

        .stat-label {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.8);
        }

        .hero-carousel {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .carousel-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            justify-content: center;
        }

        .carousel-tab {
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        .carousel-tab:hover,
        .carousel-tab.active {
            background: rgba(255, 255, 255, 0.3);
        }

        .carousel-content {
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        /* Flashcards Section */
        .flashcards-section {
            padding: 4rem 1.5rem;
            background: hsl(var(--background));
        }

        .section-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: hsl(var(--foreground));
        }

        .section-subtitle {
            font-size: 1.25rem;
            color: hsl(var(--muted-foreground));
        }

        .flashcards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .flashcard {
            perspective: 1000px;
            height: 300px;
            cursor: pointer;
        }

        .flashcard-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }

        .flashcard:hover .flashcard-inner {
            transform: rotateY(180deg);
        }

        .flashcard-front,
        .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 1rem;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .flashcard-front {
            background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(270 80% 45%) 100%);
            color: white;
        }

        .flashcard-back {
            background: white;
            border: 2px solid hsl(var(--border));
            transform: rotateY(180deg);
            color: black;
        }

        .flashcard-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .flashcard-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .flashcard-subtitle {
            font-size: 1rem;
            opacity: 0.9;
        }

        .flashcard-details {
            list-style: none;
        }

        .flashcard-details li {
            margin: 0.75rem 0;
            color: black;
        }

        /* Reviews Section */
        .reviews-section {
            padding: 4rem 1.5rem;
            background: hsl(var(--secondary));
        }

        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }

        .review-card {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .review-icon {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
        }

        .review-text {
            font-style: italic;
            color: hsl(var(--foreground));
            margin-bottom: 1rem;
        }

        .review-author {
            font-weight: 600;
            color: hsl(var(--primary));
        }

        /* FAQ Section */
        .faq-section {
            padding: 4rem 1.5rem;
            background: white;
        }

        .faq-list {
            max-width: 800px;
            margin: 0 auto;
        }

        .faq-item {
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            overflow: hidden;
        }

        .faq-question {
            width: 100%;
            padding: 1.5rem;
            background: white;
            border: none;
            text-align: left;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .faq-question:hover {
            background: hsl(var(--accent));
        }

        .faq-answer {
            padding: 0 1.5rem;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .faq-answer.active {
            padding: 1.5rem;
            max-height: 500px;
        }

        /* Chat Widget */
        .chat-button {
            position: fixed;
            bottom: 6rem;
            right: 1.5rem;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(270 80% 45%) 100%);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s;
            z-index: 40;
        }

        .chat-button:hover {
            transform: scale(1.1);
        }

        .chat-button svg {
            width: 2rem;
            height: 2rem;
            color: white;
        }

        .chat-window {
            position: fixed;
            bottom: 11rem;
            right: 1.5rem;
            width: 24rem;
            height: 500px;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            z-index: 40;
            border: 2px solid rgba(139, 92, 246, 0.2);
        }

        .chat-window.active {
            display: flex;
        }

        .chat-header {
            background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(270 80% 45%) 100%);
            color: white;
            padding: 1rem;
            border-radius: 1rem 1rem 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-body {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }

        .chat-message {
            background: hsl(var(--muted));
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .chat-footer {
            padding: 1rem;
            border-top: 1px solid hsl(var(--border));
            display: flex;
            gap: 0.5rem;
        }

        .chat-input {
            flex: 1;
            padding: 0.625rem;
            border: 1px solid hsl(var(--border));
            border-radius: 0.375rem;
        }

        /* Accessibility Bar */
        .accessibility-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid hsl(var(--border));
            padding: 1rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            z-index: 30;
        }

        .accessibility-btn {
            padding: 0.5rem 1rem;
            border: 1px solid hsl(var(--border));
            background: white;
            border-radius: 0.375rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s;
        }

        .accessibility-btn:hover {
            background: hsl(var(--accent));
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .mobile-menu-btn {
                display: block;
            }

            .hero-container {
                grid-template-columns: 1fr;
            }

            .hero-content h1 {
                font-size: 2rem;
            }

            .flashcards-grid,
            .reviews-grid {
                grid-template-columns: 1fr;
            }

            .chat-window {
                width: calc(100vw - 2rem);
                right: 1rem;
            }
        }

        /* Utilities */
        .text-center {
            text-align: center;
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <header class="nav-header">
        <nav class="nav-container">
            <a href="#" class="nav-logo">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%238b5cf6'/%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle' fill='white' font-family='Arial'%3EP%3C/text%3E%3C/svg%3E" alt="Logo">
                <span>Planty Możliwości</span>
            </a>
            
            <ul class="nav-links">
                <li><a href="#jak-to-dziala">Jak to działa</a></li>
                <li><a href="#opinie">Opinie</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#kontakt">Kontakt</a></li>
            </ul>

            <div class="nav-actions">
                <div class="language-selector">
                    <button class="language-btn active" data-lang="pl">PL</button>
                    <button class="language-btn" data-lang="en">EN</button>
                    <button class="language-btn" data-lang="ua">UA</button>
                </div>
                <a href="#auth" class="btn btn-outline">Zaloguj się</a>
                <a href="#auth" class="btn btn-primary">Zarejestruj się</a>
            </div>

            <button class="mobile-menu-btn">☰</button>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-container">
            <div class="hero-content">
                <h1>Planty Możliwości</h1>
                <p class="subtitle">Krakowskie Cyfrowe Centrum Wolontariatu</p>
                <p class="description">Łączymy mieszkańców Krakowa z inicjatywami, które naprawdę się liczą. Dołącz do wolontariatu już dziś!</p>
                
                <div class="hero-actions">
                    <a href="#search" class="btn btn-primary" style="background: white; color: hsl(var(--primary)); font-weight: 600;">Znajdź wolontariat</a>
                    <a href="#more" class="btn btn-outline" style="border-color: white; color: white;">Dowiedz się więcej</a>
                </div>

                <div class="hero-stats">
                    <div class="stat-item">
                        <div class="stat-value">250+</div>
                        <div class="stat-label">Inicjatyw</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">5000+</div>
                        <div class="stat-label">Wolontariuszy</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">Kraków</div>
                        <div class="stat-label">Jedna Lokalizacja</div>
                    </div>
                </div>
            </div>

            <div class="hero-carousel">
                <div class="carousel-tabs">
                    <button class="carousel-tab active" data-view="photo">📷</button>
                    <button class="carousel-tab" data-view="map">🗺️</button>
                    <button class="carousel-tab" data-view="calendar">📅</button>
                </div>
                <div class="carousel-content">
                    <div class="carousel-view active" data-content="photo">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23666'%3EŚcieżki szczęścia🌳%3C/text%3E%3C/svg%3E" alt="Wolontariusze" style="width: 100%; border-radius: 0.5rem;">
                    </div>
                    <div class="carousel-view hidden" data-content="map">
                        <p>🗺️ Mapa wolontariatów w Krakowie</p>
                    </div>
                    <div class="carousel-view hidden" data-content="calendar">
                        <p>📅 Kalendarz wydarzeń</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Flashcards Section -->
    <section class="flashcards-section" id="jak-to-dziala">
        <div class="section-container">
            <div class="section-header">
                <h2 class="section-title">Jak to działa?</h2>
                <p class="section-subtitle">Zmieniajże Kraków razem z nami!</p>
            </div>

            <div class="flashcards-grid">
                <div class="flashcard">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="flashcard-icon">✍️</div>
                            <h3 class="flashcard-title">1. Zarejestruj się</h3>
                            <p class="flashcard-subtitle">Register</p>
                        </div>
                        <div class="flashcard-back">
                            <h3 class="flashcard-title" style="color: black;">Jak zacząć?</h3>
                            <ul class="flashcard-details">
                                <li>✓ Wypełnij prosty formularz</li>
                                <li>✓ Potwierdź email</li>
                                <li>✓ Gotowe - możesz zacząć!</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="flashcard">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="flashcard-icon">🔍</div>
                            <h3 class="flashcard-title">2. Znajdź wolontariat</h3>
                            <p class="flashcard-subtitle">Find a placement</p>
                        </div>
                        <div class="flashcard-back">
                            <h3 class="flashcard-title" style="color: black;">Szukaj i filtruj</h3>
                            <ul class="flashcard-details">
                                <li>✓ Użyj mapy lub wyszukiwarki</li>
                                <li>✓ Filtruj po kategorii i lokalizacji</li>
                                <li>✓ Sprawdź kalendarz wydarzeń</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="flashcard">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <div class="flashcard-icon">🚀</div>
                            <h3 class="flashcard-title">3. Aplikuj i działaj!</h3>
                            <p class="flashcard-subtitle">Apply and Act!</p>
                        </div>
                        <div class="flashcard-back">
                            <h3 class="flashcard-title" style="color: black;">Weź udział</h3>
                            <ul class="flashcard-details">
                                <li>✓ Kliknij 'Aplikuj teraz'</li>
                                <li>✓ Czatuj z organizacją</li>
                                <li>✓ Zbieraj odznaki i zaświadczenia</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <a href="#start" class="btn btn-primary" style="font-size: 1.125rem; padding: 0.875rem 2rem;">Rozpocznij teraz</a>
            </div>
        </div>
    </section>

    <!-- Reviews Section -->
    <section class="reviews-section" id="opinie">
        <div class="section-container">
            <div class="section-header">
                <h2 class="section-title">Co mówią wolontariusze</h2>
            </div>

            <div class="reviews-grid">
                <div class="review-card">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23f97316'/%3E%3Ccircle cx='32' cy='22' r='8' fill='%23fff'/%3E%3Ccircle cx='32' cy='42' r='10' fill='%23fff'/%3E%3C/svg%3E" alt="Obwarzanek" class="review-icon">
                    <p class="review-text">"Wspaniałe doświadczenie! Poznałem mnóstwo fantastycznych ludzi i pomogłem lokalnej społeczności."</p>
                    <p class="review-author">— Anna K., Odkrywca Krakowa</p>
                </div>

                <div class="review-card">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M 20 50 Q 32 20 44 50' fill='%23ec4899' stroke='%23ec4899' stroke-width='4'/%3E%3Ccircle cx='20' cy='30' r='4' fill='%23ec4899'/%3E%3Ccircle cx='44' cy='30' r='4' fill='%23ec4899'/%3E%3C/svg%3E" alt="Smok" class="review-icon">
                    <p class="review-text">"Platforma jest intuicyjna i łatwa w użyciu. Znalazłem idealny projekt dla siebie w kilka minut!"</p>
                    <p class="review-author">— Marek P., Strażnik Smoka</p>
                </div>

                <div class="review-card">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect x='10' y='20' width='44' height='35' fill='%236366f1'/%3E%3Crect x='24' y='10' width='16' height='15' fill='%236366f1'/%3E%3Ccircle cx='32' cy='40' r='6' fill='%23fff'/%3E%3C/svg%3E" alt="Wieża" class="review-icon">
                    <p class="review-text">"Czuję się spełniona, pomagając innym. To coś więcej niż wolontariat – to społeczność!"</p>
                    <p class="review-author">— Kasia W., Hejnalista Dobroci</p>
                </div>

                <div class="review-card">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cellipse cx='32' cy='38' r='15' ry='10' fill='%2310b981'/%3E%3Ccircle cx='28' cy='20' r='8' fill='%2310b981'/%3E%3Ccircle cx='25' cy='18' r='2' fill='%23fff'/%3E%3Cpath d='M 35 25 Q 40 28 42 24' stroke='%2310b981' fill='none' stroke-width='2'/%3E%3C/svg%3E" alt="Gołąb" class="review-icon">
                    <p class="review-text">"Zbieranie odznak i certyfikatów motywuje mnie do kontynuowania działań. Świetny system!"</p>
                    <p class="review-author">— Tomasz L., Ambasador Krakowa</p>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section" id="faq">
        <div class="section-container">
            <div class="section-header">
                <h2 class="section-title">Najczęściej zadawane pytania</h2>
            </div>

            <div class="faq-list">
                <div class="faq-item">
                    <button class="faq-question">
                        <span>Jak mogę zacząć wolontariat?</span>
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Zarejestruj się na platformie, przeglądaj dostępne projekty i aplikuj do tych, które Cię interesują. To takie proste!</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question">
                        <span>Czy muszę mieć doświadczenie?</span>
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Nie! Większość projektów jest otwarta dla osób bez doświadczenia. Organizacje często zapewniają szkolenia.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question">
                        <span>Czy wolontariat jest płatny?</span>
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Wolontariat to bezpłatna działalność. Jednak zyskujesz cenne doświadczenie, nowe umiejętności i możliwość pomocy społeczności.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question">
                        <span>Jakie certyfikaty mogę zdobyć?</span>
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Po ukończeniu projektów otrzymujesz certyfikaty i odznaki, które możesz dodać do swojego CV lub profilu zawodowego.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Chat Widget -->
    <button class="chat-button" id="chatToggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3C7 3 3 7 3 12c0 2 1 4 2 5l-1 4 4-1c1 1 3 2 5 2 5 0 9-4 9-9s-4-9-9-9z"/>
        </svg>
    </button>

    <div class="chat-window" id="chatWindow">
        <div class="chat-header">
            <div>
                <strong>Czat z organizacją</strong>
            </div>
            <button style="background: none; border: none; color: white; cursor: pointer; font-size: 1.5rem;" id="chatClose">×</button>
        </div>
        <div class="chat-body">
            <div class="chat-message">
                <p><strong>System:</strong> Witaj! Zaloguj się, aby rozpocząć konwersację z organizacją.</p>
            </div>
        </div>
        <div class="chat-footer">
            <input type="text" class="chat-input" placeholder="Wpisz wiadomość..." disabled>
            <button class="btn btn-primary" disabled>Wyślij</button>
        </div>
    </div>

    <!-- Accessibility Bar -->
    <div class="accessibility-bar">
        <button class="accessibility-btn" id="themeToggle">
            <span>🌙</span>
            <span>Tryb ciemny</span>
        </button>
        <button class="accessibility-btn" id="contrastToggle">
            <span>◐</span>
            <span>Kontrast</span>
        </button>
        <button class="accessibility-btn" id="fontDecrease">
            <span>A-</span>
        </button>
        <button class="accessibility-btn" id="fontNormal">
            <span>A</span>
        </button>
        <button class="accessibility-btn" id="fontIncrease">
            <span>A+</span>
        </button>
    </div>

    <script>
        // Language Switcher
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const lang = this.dataset.lang;
                // Mock language switching - would integrate with i18n in production
                console.log('Language switched to:', lang);
            });
        });

        // Carousel Tabs
        document.querySelectorAll('.carousel-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.carousel-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const view = this.dataset.view;
                document.querySelectorAll('.carousel-view').forEach(v => v.classList.add('hidden'));
                document.querySelector(`[data-content="${view}"]`).classList.remove('hidden');
            });
        });

        // FAQ Accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = answer.classList.contains('active');
                
                // Close all answers
                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
                
                // Toggle current answer
                if (!isActive) {
                    answer.classList.add('active');
                    this.querySelector('span:last-child').textContent = '−';
                } else {
                    this.querySelector('span:last-child').textContent = '+';
                }
                
                // Reset all other +/− symbols
                document.querySelectorAll('.faq-question').forEach(q => {
                    if (q !== this) {
                        q.querySelector('span:last-child').textContent = '+';
                    }
                });
            });
        });

        // Chat Widget
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');

        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        // Accessibility Features
        let currentFontSize = 16;
        let isDarkMode = false;
        let contrastLevel = 0;

        document.getElementById('themeToggle').addEventListener('click', function() {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.body.style.background = '#1a1a1a';
                document.body.style.color = '#ffffff';
                this.innerHTML = '<span>☀️</span><span>Tryb jasny</span>';
            } else {
                document.body.style.background = '#ffffff';
                document.body.style.color = '#000000';
                this.innerHTML = '<span>🌙</span><span>Tryb ciemny</span>';
            }
        });

        document.getElementById('contrastToggle').addEventListener('click', function() {
            contrastLevel = (contrastLevel + 1) % 3;
            const levels = ['normal', 'high', 'extra-high'];
            document.body.setAttribute('data-contrast', levels[contrastLevel]);
            this.querySelector('span:last-child').textContent = 
                levels[contrastLevel] === 'normal' ? 'Kontrast' : 
                levels[contrastLevel] === 'high' ? 'Wysoki kontrast' : 'Bardzo wysoki';
        });

        document.getElementById('fontDecrease').addEventListener('click', () => {
            currentFontSize = Math.max(12, currentFontSize - 2);
            document.documentElement.style.fontSize = currentFontSize + 'px';
        });

        document.getElementById('fontNormal').addEventListener('click', () => {
            currentFontSize = 16;
            document.documentElement.style.fontSize = currentFontSize + 'px';
        });

        document.getElementById('fontIncrease').addEventListener('click', () => {
            currentFontSize = Math.min(24, currentFontSize + 2);
            document.documentElement.style.fontSize = currentFontSize + 'px';
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Load saved accessibility preferences
        window.addEventListener('DOMContentLoaded', () => {
            const savedFontSize = localStorage.getItem('fontSize');
            const savedTheme = localStorage.getItem('theme');
            const savedContrast = localStorage.getItem('contrast');

            if (savedFontSize) {
                currentFontSize = parseInt(savedFontSize);
                document.documentElement.style.fontSize = currentFontSize + 'px';
            }

            if (savedTheme === 'dark') {
                document.getElementById('themeToggle').click();
            }

            if (savedContrast) {
                contrastLevel = parseInt(savedContrast);
                document.body.setAttribute('data-contrast', ['normal', 'high', 'extra-high'][contrastLevel]);
            }
        });

        // Save accessibility preferences
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('fontSize', currentFontSize);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            localStorage.setItem('contrast', contrastLevel);
        });
    </script>
</body>
</html>
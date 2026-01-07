<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="description" content="{{ __('Fresh from the farm') }}">
    <title>{{ $title ?? __('Brand Name') }} - {{ __('High Quality') }}</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800;900&display=swap" rel="stylesheet">
    
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        :root {
            --primary: #1B5E20;
            --primary-light: #2E7D32;
            --primary-gradient: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
            --whatsapp-gradient: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            --white: #ffffff;
            --text-dark: #1a1a1a;
            --bg-beige: #faf7f2;
            --card-bg: #ffffff;
            --border-color: rgba(0,0,0,0.06);
            --nav-bg: rgba(255,255,255,0.85);
            --footer-bg: #0a1f0c;
            --text-muted: #666666;
            --link-color: #1B5E20;
            --gold-egg: #FFD600;
            
            /* Spacing & Sizes */
            --radius-sm: 0.5rem;
            --radius-md: 0.8rem;
            --radius-lg: 1.2rem;
            --radius-xl: 1.8rem;
            --container-max: 75rem; /* 1200px */
        }

        [data-theme="dark"] {
            --white: #0f170f;
            --text-dark: #e2e8f0;
            --bg-beige: #162216;
            --card-bg: #1a261a;
            --border-color: rgba(255,255,255,0.08);
            --nav-bg: rgba(15, 23, 15, 0.88);
            --footer-bg: #080f08;
            --text-muted: #a0aec0;
            --link-color: #4ade80;
        }

        /* CUSTOM SCROLLBAR - REM UNITS */
        ::-webkit-scrollbar { width: 0.625rem; }
        ::-webkit-scrollbar-track { background: var(--bg-beige); }
        ::-webkit-scrollbar-thumb { 
            background: var(--primary); 
            border-radius: 0.3125rem;
            border: 0.125rem solid var(--bg-beige);
        }
        ::-webkit-scrollbar-thumb:hover { background: var(--primary-light); }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(1.25rem); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
        }

        * {
            margin: 0; padding: 0; box-sizing: border-box;
            font-family: 'Cairo', sans-serif;
            -webkit-tap-highlight-color: transparent;
            transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
        }

        html { 
            font-size: 16px; /* Base for rem */
            scroll-behavior: smooth; 
        }
        
        body { 
            background-color: var(--white); 
            color: var(--text-dark); 
            line-height: 1.6; 
            overflow-x: hidden; 
            width: 100%;
        }

        .container { 
            width: 100%; 
            max-width: var(--container-max); 
            margin: 0 auto; 
            padding: 0 1.5rem; 
        }

        /* LOADER - MOBILE FIRST & PERFORMANCE */
        #loader {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s;
        }
        [data-theme="dark"] #loader { background: rgba(10, 20, 10, 0.5); }

        .hatching-container {
            position: relative; width: 8.75rem; height: 8.75rem;
            display: flex; justify-content: center; align-items: center;
        }

        .egg-shell {
            position: absolute; width: 4.375rem; height: 3.4375rem; background: #fffcf0;
            border: 0.125rem solid #edebdc; z-index: 3;
        }
        .egg-top {
            top: 1.25rem; border-radius: 50% 50% 10% 10% / 100% 100% 0% 0%;
            border-bottom: none; transform-origin: bottom;
            animation: hatchTop 2.5s infinite ease-in-out;
        }
        .egg-bottom {
            bottom: 1.25rem; border-radius: 10% 10% 50% 50% / 0% 0% 100% 100%;
            border-top: none; transform-origin: top;
            animation: hatchBottom 2.5s infinite ease-in-out;
        }
        .chick {
            position: absolute; width: 3.4375rem; height: 3.4375rem; background: #FFEB3B;
            border-radius: 50%; z-index: 2; display: flex;
            justify-content: center; align-items: center;
            animation: chickPop 2.5s infinite ease-in-out;
            box-shadow: 0 0.3125rem 0.9375rem rgba(255, 235, 59, 0.3);
        }
        .chick-eye {
            position: absolute; width: 0.375rem; height: 0.375rem; background: #333;
            border-radius: 50%; top: 1.125rem;
        }
        .chick-eye.left { left: 0.9375rem; }
        .chick-eye.right { right: 0.9375rem; }
        .chick-beak {
            position: absolute; width: 0; height: 0;
            border-left: 0.4375rem solid transparent; border-right: 0.4375rem solid transparent;
            border-top: 0.5rem solid #FF9800; top: 1.75rem;
        }

        @keyframes hatchTop {
            0%, 30% { transform: translateY(0) rotate(0); }
            50%, 90% { transform: translateY(-2.5rem) rotate(-20deg); opacity: 0.8; }
            100% { transform: translateY(0) rotate(0); }
        }
        @keyframes hatchBottom {
            0%, 30% { transform: translateY(0); }
            50%, 90% { transform: translateY(0.9375rem); }
            100% { transform: translateY(0); }
        }
        @keyframes chickPop {
            0%, 30% { transform: translateY(0.9375rem) scale(0.6); opacity: 0; }
            50%, 90% { transform: translateY(-0.625rem) scale(1.1); opacity: 1; }
            100% { transform: translateY(0.9375rem) scale(0.6); opacity: 0; }
        }

        .dots span { animation: dotLoader 1.4s infinite; opacity: 0; display: inline-block; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        .dots span:nth-child(4) { animation-delay: 0.6s; }
        @keyframes dotLoader {
            0%, 20% { opacity: 0; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-0.1875rem); }
            80%, 100% { opacity: 0; transform: translateY(0); }
        }

        /* REVERTED LOGO - Simple & Clean */
        .logo-group {
            display: flex; align-items: center; gap: 0.5rem;
            text-decoration: none; color: var(--primary);
            font-size: 1.4rem; font-weight: 950;
        }
        .logo-icon {
            width: 1.8rem; height: 1.8rem; color: var(--primary);
        }

        /* CARD REFINEMENT - Soft & Smooth */
        .card-modern {
            background: var(--card-bg);
            border-radius: 1.5rem;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            padding: 1.5rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-modern:hover {
            transform: translateY(-0.5rem);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            border-color: var(--primary-light);
        }

        /* BUTTON REFINEMENT */
        .btn-smooth {
            border-radius: 1rem;
            padding: 0.75rem 1.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 800;
        }

        /* BACK TO TOP BUTTON - Restored */
        .back-to-top {
            position: fixed; bottom: 6.5rem; right: 1.5rem;
            background: var(--primary); color: white;
            width: 3rem; height: 3rem; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 10px 30px rgba(27, 94, 32, 0.3);
            z-index: 999; cursor: pointer; border: none;
            opacity: 0; visibility: hidden; transition: all 0.4s;
        }
        .back-to-top.visible { opacity: 1; visibility: visible; }
        .back-to-top:hover { transform: translateY(-0.25rem); box-shadow: 0 15px 35px rgba(27, 94, 32, 0.4); }

        /* NAVIGATION - RESPONSIVE */
        nav {
            background: var(--nav-bg); backdrop-filter: blur(20px);
            border-bottom: 0.0625rem solid var(--border-color);
            position: sticky; top: 0; z-index: 1000; padding: 0.8rem 0;
        }

        .nav-btn {
            background: transparent; border: none; color: var(--text-dark);
            width: 2.625rem; height: 2.625rem; display: flex; align-items: center;
            justify-content: center; cursor: pointer; border-radius: var(--radius-md);
            transition: all 0.3s;
        }
        .nav-btn:hover { background: rgba(0,0,0,0.03); transform: scale(1.05); }
        [data-theme="dark"] .nav-btn:hover { background: rgba(255,255,255,0.05); }

        .lang-switch {
            font-weight: 800; text-decoration: none; color: var(--text-dark);
            height: 2.625rem; padding: 0 1rem; display: flex; align-items: center;
            justify-content: center; transition: all 0.3s; border-radius: var(--radius-md);
        }
        .lang-switch:hover { background: rgba(0,0,0,0.03); color: var(--primary); }

        /* FOOTER - MOBILE FIRST */
        .footer-premium {
            background: var(--footer-bg); color: white;
            padding: 5rem 0 3rem; margin-top: 6rem;
            text-align: center;
        }
        .footer-brand { margin-bottom: 2.5rem; }
        .footer-brand h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.8rem; }
        .footer-brand p { color: #a0aec0; max-width: 31.25rem; margin: 0 auto; line-height: 1.7; }
        
        .footer-links {
            display: flex; justify-content: center; gap: 2.5rem;
            flex-wrap: wrap; margin-bottom: 3rem;
        }
        .footer-links a {
            color: #cbd5e0; text-decoration: none; font-weight: 700;
            font-size: 1rem; transition: all 0.3s;
        }
        .footer-links a:hover { color: var(--primary-light); transform: translateY(-0.125rem); }

        .footer-social-row {
            display: flex; justify-content: center; gap: 1.2rem; margin-bottom: 3rem;
        }
        .social-circle {
            width: 3rem; height: 3rem; border-radius: 50%;
            background: rgba(255,255,255,0.06); display: flex;
            align-items: center; justify-content: center; color: white;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-decoration: none;
        }
        .social-circle:hover { transform: translateY(-0.5rem) scale(1.1); color: white; }
        .social-circle.fb:hover { background: #1877F2; box-shadow: 0 0.625rem 1.25rem rgba(24, 119, 242, 0.4); }
        .social-circle.ig:hover { background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); box-shadow: 0 0.625rem 1.25rem rgba(220, 39, 67, 0.4); }
        .social-circle.tk:hover { background: #000000; box-shadow: 0 0.625rem 1.25rem rgba(0,0,0,0.6); }

        .footer-contact-row {
            display: flex; justify-content: center; gap: 1.5rem;
            margin-bottom: 3.5rem; flex-wrap: nowrap;
        }
        .contact-item {
            display: flex; align-items: center; gap: 0.7rem;
            color: white; text-decoration: none; font-weight: 800;
            padding: 0.7rem 1.4rem; border-radius: 3.125rem;
            background: rgba(255,255,255,0.05); transition: all 0.3s;
            white-space: nowrap; font-size: 0.95rem;
        }
        .contact-item:hover { background: rgba(255,255,255,0.12); transform: translateY(-0.1875rem); }
        .contact-item.wa:hover { color: #25D366; }

        @media (max-width: 48rem) {
            .footer-contact-row { gap: 0.5rem; }
            .contact-item { padding: 0.5rem 0.8rem; font-size: 0.75rem; gap: 0.4rem; }
            .contact-item i { width: 0.9rem !important; height: 0.9rem !important; }
        }

        @media (max-width: 40rem) { /* 640px */
            .footer-links { gap: 1.5rem; }
            .nav-brand-text { display: none; }
        }

        .whatsapp-btn {
            position: fixed; bottom: 1.875rem; left: 1.875rem;
            background: var(--whatsapp-gradient); color: white;
            width: 4rem; height: 4rem; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0.75rem 1.875rem rgba(18, 140, 126, 0.4);
            z-index: 1000; transition: all 0.4s;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 0.9375rem rgba(37, 211, 102, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        [data-theme="dark"] .light-only { display: none; }
        [data-theme="light"] .dark-only { display: none; }

        .broken-egg-fallback {
            background: var(--bg-beige); height: 100%; width: 100%;
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; color: var(--text-muted); gap: 0.5rem;
            text-align: center; padding: 1rem;
        }
    </style>
    <script>
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    </script>
    @stack('styles')
</head>
<body>
    <!-- Natural Loader -->
    <div id="loader">
        <div class="hatching-container">
            <div class="chick">
                <div class="chick-eye left"></div>
                <div class="chick-eye right"></div>
                <div class="chick-beak"></div>
            </div>
            <div class="egg-shell egg-top"></div>
            <div class="egg-shell egg-bottom"></div>
        </div>
        <p style="margin-top: 2rem; color: var(--primary); font-weight: 950; font-size: 1.4rem; display: flex; align-items: center; gap: 0.375rem;">
            {{ __('Loading Farm') }}
            <span class="dots">
                <span>.</span><span>.</span><span>.</span><span>.</span>
            </span>
        </p>
    </div>

    <nav>
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <a href="/" class="logo-group">
                <i data-lucide="sprout" class="logo-icon"></i>
                <span>{{ __('Brand Name') }}</span>
            </a>
            
            <div style="display: flex; gap: 0.6rem; align-items: center;">
                <button onclick="toggleTheme()" class="nav-btn" id="theme-toggle" title="{{ __('Toggle Theme') }}">
                    <i data-lucide="moon" class="dark-only" style="width: 1.375rem;"></i>
                    <i data-lucide="sun" class="light-only" style="width: 1.375rem;"></i>
                </button>

                <a href="/lang/{{ app()->getLocale() === 'ar' ? 'en' : 'ar' }}" class="lang-switch">
                    @if(app()->getLocale() === 'ar')
                        <span style="font-weight: 700; font-size: 0.95rem;">EN</span>
                    @else
                        <span style="font-weight: 900; font-size: 1.2rem;">ع</span>
                    @endif
                </a>

                @auth
                    @if(auth()->user()->is_admin)
                        <a href="/admin" class="btn" style="background: var(--primary); color: white; padding: 0.6rem 1.2rem; border-radius: 0.75rem; text-decoration: none; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem;">
                            <i data-lucide="layout-dashboard" style="width: 1.0625rem;"></i>
                            <span>{{ __('Admin') }}</span>
                        </a>
                    @endif
                @else
                    <a href="/login" class="btn" style="background: var(--primary); color: white; padding: 0.6rem 1.4rem; border-radius: 0.75rem; text-decoration: none; font-weight: 800; font-size: 0.95rem;">
                        <span>{{ __('Login') }}</span>
                    </a>
                @endauth
            </div>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <a href="https://wa.me/{{ $settings['whatsapp'] ?? '201515419092' }}" target="_blank" class="whatsapp-btn">
        <i data-lucide="message-circle" style="width: 2.125rem; height: 2.125rem; fill: white;"></i>
    </a>

    <footer class="footer-premium">
        <div class="container">
            <div class="footer-brand">
                <h2>{{ __('Brand Name') }}</h2>
                <p>{{ __('Fresh from the farm') }}</p>
            </div>

            <div class="footer-links">
                <a href="/products">{{ __('All Products') }}</a>
                <a href="#">{{ __('About Farm') }}</a>
                <a href="#">{{ __('Delivery Policy') }}</a>
            </div>

            <div class="footer-social-row">
                <a href="{{ $settings['facebook'] ?? '#' }}" target="_blank" class="social-circle fb">
                    <i data-lucide="facebook" style="width: 1.5rem;"></i>
                </a>
                <a href="{{ $settings['instagram'] ?? '#' }}" target="_blank" class="social-circle ig">
                    <i data-lucide="instagram" style="width: 1.5rem;"></i>
                </a>
                <a href="{{ $settings['tiktok'] ?? '#' }}" target="_blank" class="social-circle tk">
                    <svg viewBox="0 0 448 512" style="width: 1.25rem; fill: currentColor;"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.32c7.87 33.35 35.09 63.63 76.91 77.07V152.09A162.55 162.55 0 0 1 448 209.91z"/></svg>
                </a>
            </div>

            <div class="footer-contact-row">
                <a href="tel:{{ str_replace(' ', '', $settings['phone'] ?? '+201515419092') }}" class="contact-item">
                    <i data-lucide="phone" style="width: 1.1875rem; color: var(--primary);"></i>
                    <span>{{ $settings['phone'] ?? '+20 15 15419092' }}</span>
                </a>
                <a href="https://wa.me/{{ $settings['whatsapp'] ?? '201515419092' }}" target="_blank" class="contact-item wa">
                    <i data-lucide="message-circle" style="width: 1.1875rem;"></i>
                    <span>WhatsApp</span>
                </a>
            </div>

            <p style="color: #4a5568; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.25rem; flex-wrap: wrap;">
                <span>{{ __('All Rights Reserved') }} &copy; {{ date('Y') }} {{ __('Brand Name') }}</span>
                <span style="margin: 0 0.5rem;">|</span>
                <span>{{ __('Developed by') }}</span>
                <a href="https://github.com/AbdullahSayed3" target="_blank" style="text-decoration: none; color: var(--primary); font-weight: 900; transition: all 0.3s;">
                    {{ app()->getLocale() === 'ar' ? 'عبدالله سيد' : 'Abdulla Sayed' }}
                </a>
            </p>
        </div>
    </footer>

    <script>
        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            lucide.createIcons();
        }

        // Image fallback handler - Unified & Efficient
        function handleImageError(img) {
            const container = img.parentElement;
            if (container.querySelector('.broken-egg-fallback')) return;
            
            const fallback = document.createElement('div');
            fallback.className = 'broken-egg-fallback';
            fallback.innerHTML = `<i data-lucide="egg-off" style="width:2.5rem;height:2.5rem;"></i><span style="font-size:0.8rem;font-weight:700;">{{ __('Farm Fresh Poultry') }}</span>`;
            
            container.appendChild(fallback);
            img.style.display = 'none';
            lucide.createIcons();
        }

        // Optimized Natural Loader Logic
        (function() {
            const startTime = Date.now();
            const minDuration = 1000; // Chick animation cycle minimum

            function hideLoader() {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, minDuration - elapsed);

                setTimeout(() => {
                    const loader = document.getElementById('loader');
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.visibility = 'hidden';
                            // Defer icon creation until loader is gone
                            lucide.createIcons();
                        }, 500);
                    }
                }, remaining);
            }

            if (document.readyState === 'complete') {
                hideLoader();
            } else {
                window.addEventListener('load', hideLoader);
            }
        })();

        // Global Image Error Delegation
        document.body.addEventListener('error', function(e) {
            if (e.target.tagName.toLowerCase() === 'img') {
                handleImageError(e.target);
            }
        }, true);

        // Back to Top Button Logic
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    </script>

    <!-- Back to Top Button -->
    <button id="backToTop" class="back-to-top" aria-label="Back to top">
        <i data-lucide="arrow-up" style="width: 1.5rem;"></i>
    </button>
</body>
</html>

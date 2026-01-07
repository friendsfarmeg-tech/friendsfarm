<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'Friends Farm'))</title>
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        :root {
            font-size: 16px;
        }
        
        @media (max-width: 768px) {
            :root {
                font-size: 14px;
            }
        }
        
        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16 md:h-20">
                <div class="flex items-center">
                    <a href="{{ route('home') }}" class="text-xl md:text-2xl font-bold text-green-600">
                        Friends Farm
                    </a>
                </div>
                
                <div class="hidden md:flex items-center space-x-4 space-x-reverse">
                    <a href="{{ route('home') }}" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">الرئيسية</a>
                    <a href="{{ route('products.index') }}" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">المنتجات</a>
                    @auth
                        <a href="{{ route('orders.index') }}" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">طلباتي</a>
                        <a href="{{ route('wishlist.index') }}" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">المفضلة</a>
                    @endauth
                </div>
                
                <div class="flex items-center space-x-2 space-x-reverse">
                    <a href="{{ route('cart.index') }}" class="relative p-2 text-gray-700 hover:text-green-600">
                        <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span id="cart-count" class="absolute top-0 left-0 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {{ array_sum(session('cart', [])) }}
                        </span>
                    </a>
                    
                    @auth
                        <a href="{{ route('logout') }}" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600">تسجيل خروج</a>
                    @else
                        <a href="{{ route('login') }}" class="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700">تسجيل دخول</a>
                    @endauth
                    
                    <!-- Mobile menu button -->
                    <button id="mobile-menu-button" class="md:hidden p-2 text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mobile menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a href="{{ route('home') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">الرئيسية</a>
                <a href="{{ route('products.index') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">المنتجات</a>
                @auth
                    <a href="{{ route('orders.index') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">طلباتي</a>
                    <a href="{{ route('wishlist.index') }}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">المفضلة</a>
                @endauth
            </div>
        </div>
    </nav>
    
    <!-- Flash Messages -->
    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
            <span class="block sm:inline">{{ session('success') }}</span>
        </div>
    @endif
    
    @if(session('error'))
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
            <span class="block sm:inline">{{ session('error') }}</span>
        </div>
    @endif
    
    <!-- Main Content -->
    <main class="py-4 md:py-6">
        @yield('content')
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-4">Friends Farm</h3>
                    <p class="text-gray-400 text-sm">منتجات طبيعية طازجة من المزرعة مباشرة</p>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-4">روابط سريعة</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="{{ route('home') }}" class="text-gray-400 hover:text-white">الرئيسية</a></li>
                        <li><a href="{{ route('products.index') }}" class="text-gray-400 hover:text-white">المنتجات</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-4">تواصل معنا</h3>
                    <p class="text-gray-400 text-sm">{{ $settings['contact_phone'] ?? '' }}</p>
                    <p class="text-gray-400 text-sm">{{ $settings['contact_email'] ?? '' }}</p>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {{ date('Y') }} Friends Farm. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    </footer>
    
    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-button')?.addEventListener('click', function() {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
        
        // Update cart count
        function updateCartCount() {
            fetch('{{ route("cart.count") }}')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('cart-count').textContent = data.count || 0;
                });
        }
        
        // Update on page load
        updateCartCount();
    </script>
    
    @yield('scripts')
</body>
</html>

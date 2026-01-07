@extends('layouts.app')

@section('title', 'الصفحة الرئيسية')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-green-400 to-green-600 rounded-2xl overflow-hidden mb-8 md:mb-12" style="min-height: 20rem;">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="relative px-4 md:px-8 py-12 md:py-16 text-center text-white">
            <h1 class="text-3xl md:text-5xl font-bold mb-4">مرحباً بكم في Friends Farm</h1>
            <p class="text-lg md:text-xl mb-6">منتجات طبيعية طازجة من المزرعة مباشرة</p>
            <a href="{{ route('products.index') }}" class="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                تصفح المنتجات
            </a>
        </div>
    </div>
    
    <!-- Categories -->
    @if($categories->count() > 0)
    <section class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold mb-6">الأقسام</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @foreach($categories as $category)
            <a href="{{ route('products.index', ['category' => $category->id]) }}" class="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
                @if($category->image_url)
                    <img src="{{ $category->image_url }}" alt="{{ $category->name_ar }}" class="w-full h-24 object-cover rounded mb-2">
                @endif
                <h3 class="text-sm md:text-base font-semibold text-gray-800">{{ $category->name_ar }}</h3>
            </a>
            @endforeach
        </div>
    </section>
    @endif
    
    <!-- Featured Products -->
    <section>
        <h2 class="text-2xl md:text-3xl font-bold mb-6">منتجات مميزة</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @forelse($products as $product)
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <a href="{{ route('products.show', $product) }}">
                    @if($product->image_url)
                        <img src="{{ $product->image_url }}" alt="{{ $product->name_ar }}" class="w-full h-40 md:h-48 object-cover">
                    @else
                        <div class="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center">
                            <span class="text-gray-400">لا توجد صورة</span>
                        </div>
                    @endif
                    <div class="p-3 md:p-4">
                        <h3 class="font-semibold text-sm md:text-base mb-2 text-gray-800">{{ $product->name_ar }}</h3>
                        <div class="flex items-center justify-between">
                            <span class="text-green-600 font-bold text-base md:text-lg">{{ number_format($product->price, 2) }} ج.م</span>
                            @if($product->average_rating > 0)
                            <div class="flex items-center">
                                <span class="text-yellow-500">⭐</span>
                                <span class="text-xs text-gray-600 mr-1">{{ $product->average_rating }}</span>
                            </div>
                            @endif
                        </div>
                        @if(!$product->is_available)
                            <span class="text-red-600 text-xs">غير متوفر</span>
                        @endif
                    </div>
                </a>
            </div>
            @empty
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500">لا توجد منتجات متاحة حالياً</p>
            </div>
            @endforelse
        </div>
    </section>
</div>
@endsection

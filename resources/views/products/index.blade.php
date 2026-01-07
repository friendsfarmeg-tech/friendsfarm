@extends('layouts.app')

@section('title', 'المنتجات')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- Sidebar Filters -->
        <aside class="w-full md:w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 class="font-bold text-lg mb-4">الأقسام</h3>
                <ul class="space-y-2">
                    <li>
                        <a href="{{ route('products.index') }}" class="block px-3 py-2 rounded {{ !request('category') ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100' }}">
                            الكل
                        </a>
                    </li>
                    @foreach($categories as $category)
                    <li>
                        <a href="{{ route('products.index', ['category' => $category->id]) }}" class="block px-3 py-2 rounded {{ request('category') == $category->id ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100' }}">
                            {{ $category->name_ar }}
                        </a>
                    </li>
                    @endforeach
                </ul>
            </div>
        </aside>
        
        <!-- Products Grid -->
        <main class="flex-1">
            <div class="mb-6">
                <h1 class="text-2xl md:text-3xl font-bold">المنتجات</h1>
                <p class="text-gray-600 mt-2">{{ $products->total() }} منتج</p>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                @forelse($products as $product)
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <a href="{{ route('products.show', $product) }}">
                        @if($product->image_url)
                            <img src="{{ $product->image_url }}" alt="{{ $product->name_ar }}" class="w-full h-40 md:h-48 object-cover">
                        @else
                            <div class="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center">
                                <span class="text-gray-400 text-sm">لا توجد صورة</span>
                            </div>
                        @endif
                        <div class="p-3 md:p-4">
                            <h3 class="font-semibold text-sm md:text-base mb-2 text-gray-800">{{ $product->name_ar }}</h3>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-green-600 font-bold text-base md:text-lg">{{ number_format($product->price, 2) }} ج.م</span>
                                @if($product->average_rating > 0)
                                <div class="flex items-center">
                                    <span class="text-yellow-500 text-sm">⭐</span>
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
                    <p class="text-gray-500">لا توجد منتجات متاحة</p>
                </div>
                @endforelse
            </div>
            
            <!-- Pagination -->
            <div class="mt-8">
                {{ $products->links() }}
            </div>
        </main>
    </div>
</div>
@endsection

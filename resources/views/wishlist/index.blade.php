@extends('layouts.app')

@section('title', 'قائمة الأمنيات')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl md:text-3xl font-bold mb-6">قائمة الأمنيات</h1>
    
    @if($wishlistItems->count() > 0)
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        @foreach($wishlistItems as $item)
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <a href="{{ route('products.show', $item->product) }}">
                @if($item->product->image_url)
                    <img src="{{ $item->product->image_url }}" alt="{{ $item->product->name_ar }}" class="w-full h-40 md:h-48 object-cover">
                @else
                    <div class="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-400 text-sm">لا توجد صورة</span>
                    </div>
                @endif
                <div class="p-3 md:p-4">
                    <h3 class="font-semibold text-sm md:text-base mb-2 text-gray-800">{{ $item->product->name_ar }}</h3>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-green-600 font-bold text-base md:text-lg">{{ number_format($item->product->price, 2) }} ج.م</span>
                        @if($item->product->average_rating > 0)
                        <div class="flex items-center">
                            <span class="text-yellow-500 text-sm">⭐</span>
                            <span class="text-xs text-gray-600 mr-1">{{ $item->product->average_rating }}</span>
                        </div>
                        @endif
                    </div>
                </div>
            </a>
            <div class="p-3 md:p-4 pt-0">
                <button onclick="removeFromWishlist({{ $item->product->id }})" class="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm font-semibold">
                    إزالة من المفضلة
                </button>
            </div>
        </div>
        @endforeach
    </div>
    
    <div class="mt-6">
        {{ $wishlistItems->links() }}
    </div>
    @else
    <div class="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <h2 class="text-xl font-semibold mb-2">قائمة الأمنيات فارغة</h2>
        <p class="text-gray-600 mb-6">لم تضف أي منتجات إلى المفضلة بعد</p>
        <a href="{{ route('products.index') }}" class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            تصفح المنتجات
        </a>
    </div>
    @endif
</div>

<script>
function removeFromWishlist(productId) {
    if (confirm('هل أنت متأكد من إزالة هذا المنتج من المفضلة؟')) {
        fetch(`/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    }
}
</script>
@endsection

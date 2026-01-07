@extends('layouts.app')

@section('title', $product->name_ar)

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
            <!-- Product Image -->
            <div>
                @if($product->image_url)
                    <img src="{{ $product->image_url }}" alt="{{ $product->name_ar }}" class="w-full rounded-lg object-cover" style="max-height: 32rem;">
                @else
                    <div class="w-full bg-gray-200 rounded-lg flex items-center justify-center" style="height: 32rem;">
                        <span class="text-gray-400">لا توجد صورة</span>
                    </div>
                @endif
            </div>
            
            <!-- Product Details -->
            <div>
                <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ $product->name_ar }}</h1>
                
                @if($product->average_rating > 0)
                <div class="flex items-center mb-4">
                    <div class="flex items-center">
                        @for($i = 1; $i <= 5; $i++)
                            <span class="text-xl {{ $i <= round($product->average_rating) ? 'text-yellow-500' : 'text-gray-300' }}">⭐</span>
                        @endfor
                    </div>
                    <span class="mr-2 text-gray-600">({{ $product->reviews_count }} تقييم)</span>
                </div>
                @endif
                
                <div class="mb-6">
                    <span class="text-3xl md:text-4xl font-bold text-green-600">{{ number_format($product->price, 2) }} ج.م</span>
                    <span class="text-gray-600 mr-2">/ {{ $product->unit }}</span>
                </div>
                
                @if($product->description_ar)
                <div class="mb-6">
                    <h3 class="font-semibold mb-2">الوصف</h3>
                    <p class="text-gray-700 leading-relaxed">{{ $product->description_ar }}</p>
                </div>
                @endif
                
                @if($product->is_available && $product->stock > 0)
                <form action="{{ route('cart.add', $product) }}" method="POST" class="mb-6">
                    @csrf
                    <div class="flex items-center gap-4 mb-4">
                        <label for="quantity" class="font-semibold">الكمية:</label>
                        <input type="number" name="quantity" id="quantity" value="1" min="1" max="{{ $product->stock }}" class="border border-gray-300 rounded-lg px-4 py-2 w-24">
                    </div>
                    <button type="submit" class="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                        أضف إلى السلة
                    </button>
                </form>
                
                @auth
                <div class="flex gap-4">
                    <button onclick="toggleWishlist({{ $product->id }})" id="wishlist-btn" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                        <span id="wishlist-icon">🤍</span> <span class="mr-2">أضف إلى المفضلة</span>
                    </button>
                </div>
                @endauth
                
                @else
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p>المنتج غير متوفر حالياً</p>
                </div>
                @endif
            </div>
        </div>
    </div>
    
    <!-- Reviews Section -->
    <div class="bg-white rounded-lg shadow-md p-4 md:p-8 mb-6">
        <h2 class="text-2xl font-bold mb-6">التقييمات</h2>
        
        <!-- Add Review Form -->
        @auth
        <div class="mb-8 border-b pb-6">
            <h3 class="text-lg font-semibold mb-4">أضف تقييمك</h3>
            <form action="{{ route('reviews.store', $product) }}" method="POST">
                @csrf
                <div class="mb-4">
                    <label class="block mb-2 font-semibold">التقييم</label>
                    <select name="rating" required class="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48">
                        <option value="">اختر التقييم</option>
                        <option value="5">⭐⭐⭐⭐⭐ ممتاز</option>
                        <option value="4">⭐⭐⭐⭐ جيد جداً</option>
                        <option value="3">⭐⭐⭐ جيد</option>
                        <option value="2">⭐⭐ مقبول</option>
                        <option value="1">⭐ ضعيف</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block mb-2 font-semibold">التعليق</label>
                    <textarea name="comment" required rows="4" class="border border-gray-300 rounded-lg px-4 py-2 w-full" placeholder="اكتب تعليقك هنا..."></textarea>
                </div>
                <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                    إضافة التقييم
                </button>
            </form>
        </div>
        @else
        <p class="mb-6 text-gray-600">يجب <a href="{{ route('login') }}" class="text-green-600 underline">تسجيل الدخول</a> لإضافة تقييم</p>
        @endauth
        
        <!-- Reviews List -->
        <div class="space-y-6">
            @forelse($product->reviews as $review)
            <div class="border-b pb-4 last:border-0">
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <h4 class="font-semibold">{{ $review->customer_name }}</h4>
                        <div class="flex items-center mt-1">
                            @for($i = 1; $i <= 5; $i++)
                                <span class="text-sm {{ $i <= $review->rating ? 'text-yellow-500' : 'text-gray-300' }}">⭐</span>
                            @endfor
                        </div>
                    </div>
                    <span class="text-sm text-gray-500">{{ $review->created_at->diffForHumans() }}</span>
                </div>
                <p class="text-gray-700">{{ $review->comment }}</p>
                @auth
                    @if($review->user_id === auth()->id())
                    <form action="{{ route('reviews.destroy', $review) }}" method="POST" class="mt-2">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 text-sm hover:underline">حذف</button>
                    </form>
                    @endif
                @endauth
            </div>
            @empty
            <p class="text-gray-500 text-center py-8">لا توجد تقييمات بعد</p>
            @endforelse
        </div>
    </div>
</div>

@auth
<script>
    // Check if product is in wishlist
    fetch(`/wishlist/toggle/{{ $product->id }}`, {method: 'GET'})
        .then(() => {
            // Will be toggled on click
        });
    
    function toggleWishlist(productId) {
        fetch(`/wishlist/toggle/${productId}`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            const icon = document.getElementById('wishlist-icon');
            if (data.is_favorited) {
                icon.textContent = '❤️';
            } else {
                icon.textContent = '🤍';
            }
        });
    }
</script>
@endauth
@endsection

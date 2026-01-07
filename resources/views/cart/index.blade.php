@extends('layouts.app')

@section('title', 'السلة')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl md:text-3xl font-bold mb-6">سلة التسوق</h1>
    
    @if(count($items) > 0)
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">المنتج</th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">السعر</th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">الكمية</th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجمالي</th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @foreach($items as $item)
                    <tr>
                        <td class="px-4 py-4">
                            <div class="flex items-center">
                                @if($item['product']->image_url)
                                    <img src="{{ $item['product']->image_url }}" alt="{{ $item['product']->name_ar }}" class="w-16 h-16 object-cover rounded ml-4">
                                @endif
                                <div>
                                    <h3 class="font-semibold text-sm md:text-base">{{ $item['product']->name_ar }}</h3>
                                    <p class="text-sm text-gray-500">{{ $item['product']->unit }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-4 text-sm md:text-base">{{ number_format($item['product']->price, 2) }} ج.م</td>
                        <td class="px-4 py-4">
                            <form action="{{ route('cart.update', $item['product']) }}" method="POST" class="inline-flex items-center">
                                @csrf
                                @method('PUT')
                                <input type="number" name="quantity" value="{{ $item['quantity'] }}" min="1" max="{{ $item['product']->stock }}" onchange="this.form.submit()" class="border border-gray-300 rounded-lg px-2 py-1 w-16 text-center">
                            </form>
                        </td>
                        <td class="px-4 py-4 font-semibold text-sm md:text-base">{{ number_format($item['subtotal'], 2) }} ج.م</td>
                        <td class="px-4 py-4">
                            <form action="{{ route('cart.remove', $item['product']) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-800">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        
        <div class="border-t bg-gray-50 px-4 py-6">
            <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-semibold">الإجمالي:</span>
                <span class="text-2xl font-bold text-green-600">{{ number_format($total, 2) }} ج.م</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <a href="{{ route('products.index') }}" class="px-6 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-100 transition">
                    متابعة التسوق
                </a>
                <form action="{{ route('cart.clear') }}" method="POST" class="flex-1 sm:flex-none">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="w-full px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                        تفريغ السلة
                    </button>
                </form>
                @auth
                <a href="{{ route('orders.checkout') }}" class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center">
                    إتمام الطلب
                </a>
                @else
                <a href="{{ route('login') }}" class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center">
                    تسجيل الدخول لإتمام الطلب
                </a>
                @endauth
            </div>
        </div>
    </div>
    @else
    <div class="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h2 class="text-xl font-semibold mb-2">السلة فارغة</h2>
        <p class="text-gray-600 mb-6">لم تضف أي منتجات إلى السلة بعد</p>
        <a href="{{ route('products.index') }}" class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            تصفح المنتجات
        </a>
    </div>
    @endif
</div>
@endsection

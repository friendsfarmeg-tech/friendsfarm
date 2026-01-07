@extends('layouts.app')

@section('title', 'إتمام الطلب')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl md:text-3xl font-bold mb-6">إتمام الطلب</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Order Form -->
        <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                <h2 class="text-xl font-bold mb-4">معلومات الطلب</h2>
                <form action="{{ route('orders.store') }}" method="POST">
                    @csrf
                    
                    <div class="mb-4">
                        <label for="address" class="block mb-2 font-semibold">العنوان *</label>
                        <textarea name="address" id="address" rows="4" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="اكتب عنوانك الكامل"></textarea>
                        @error('address')
                            <p class="text-red-600 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="mb-4">
                        <label for="notes" class="block mb-2 font-semibold">ملاحظات (اختياري)</label>
                        <textarea name="notes" id="notes" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="ملاحظات إضافية للطلب"></textarea>
                    </div>
                    
                    <button type="submit" class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                        تأكيد الطلب
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Order Summary -->
        <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20">
                <h2 class="text-xl font-bold mb-4">ملخص الطلب</h2>
                
                <div class="space-y-3 mb-6">
                    @foreach($items as $item)
                    <div class="flex justify-between items-center pb-3 border-b">
                        <div class="flex-1">
                            <p class="font-semibold text-sm">{{ $item['product']->name_ar }}</p>
                            <p class="text-sm text-gray-600">× {{ $item['quantity'] }}</p>
                        </div>
                        <span class="text-sm font-semibold">{{ number_format($item['subtotal'], 2) }} ج.م</span>
                    </div>
                    @endforeach
                </div>
                
                <div class="border-t pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-semibold">الإجمالي:</span>
                        <span class="text-2xl font-bold text-green-600">{{ number_format($total, 2) }} ج.م</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

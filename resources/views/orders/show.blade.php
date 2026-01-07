@extends('layouts.app')

@section('title', 'تفاصيل الطلب')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <a href="{{ route('orders.index') }}" class="text-green-600 hover:text-green-700 mb-4 inline-block">
        ← العودة إلى الطلبات
    </a>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold mb-2">طلب #{{ substr($order->id, 0, 8) }}</h1>
                    <p class="text-gray-600">تاريخ الطلب: {{ $order->created_at->format('Y-m-d H:i') }}</p>
                </div>
                @php
                    $statusColors = [
                        'pending' => 'bg-yellow-100 text-yellow-800',
                        'confirmed' => 'bg-blue-100 text-blue-800',
                        'preparing' => 'bg-purple-100 text-purple-800',
                        'delivered' => 'bg-green-100 text-green-800',
                        'cancelled' => 'bg-red-100 text-red-800',
                    ];
                    $statusLabels = [
                        'pending' => 'جديد',
                        'confirmed' => 'مؤكد',
                        'preparing' => 'جاري التجهيز',
                        'delivered' => 'تم التوصيل',
                        'cancelled' => 'ملغي',
                    ];
                @endphp
                <span class="px-4 py-2 rounded-full text-base font-semibold {{ $statusColors[$order->status] ?? 'bg-gray-100 text-gray-800' }} mt-4 md:mt-0">
                    {{ $statusLabels[$order->status] ?? $order->status }}
                </span>
            </div>
            
            <div class="border-t border-b py-6 mb-6">
                <h2 class="text-xl font-bold mb-4">المنتجات</h2>
                <div class="space-y-4">
                    @foreach($order->items as $item)
                    <div class="flex items-center justify-between">
                        <div class="flex items-center flex-1">
                            @if($item->product && $item->product->image_url)
                                <img src="{{ $item->product->image_url }}" alt="{{ $item->product->name_ar }}" class="w-16 h-16 object-cover rounded ml-4">
                            @endif
                            <div>
                                <h3 class="font-semibold">{{ $item->product->name_ar ?? 'منتج محذوف' }}</h3>
                                <p class="text-sm text-gray-600">الكمية: {{ $item->quantity }} × {{ number_format($item->price, 2) }} ج.م</p>
                            </div>
                        </div>
                        <span class="font-bold">{{ number_format($item->price * $item->quantity, 2) }} ج.م</span>
                    </div>
                    @endforeach
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 class="font-bold mb-2">معلومات التسليم</h3>
                    <p class="text-gray-700">{{ $order->address }}</p>
                </div>
                <div>
                    <h3 class="font-bold mb-2">الإجمالي</h3>
                    <p class="text-2xl font-bold text-green-600">{{ number_format($order->total, 2) }} ج.م</p>
                </div>
            </div>
            
            @if($order->notes)
            <div class="border-t pt-6">
                <h3 class="font-bold mb-2">ملاحظات</h3>
                <p class="text-gray-700">{{ $order->notes }}</p>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection

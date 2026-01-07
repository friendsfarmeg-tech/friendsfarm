@extends('layouts.app')

@section('title', 'طلباتي')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl md:text-3xl font-bold mb-6">طلباتي</h1>
    
    @if($orders->count() > 0)
    <div class="space-y-4">
        @foreach($orders as $order)
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 md:p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold">طلب #{{ substr($order->id, 0, 8) }}</h3>
                        <p class="text-sm text-gray-600">{{ $order->created_at->format('Y-m-d H:i') }}</p>
                    </div>
                    <div class="mt-2 md:mt-0">
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
                        <span class="px-3 py-1 rounded-full text-sm font-semibold {{ $statusColors[$order->status] ?? 'bg-gray-100 text-gray-800' }}">
                            {{ $statusLabels[$order->status] ?? $order->status }}
                        </span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-semibold mb-2">المنتجات:</h4>
                    <ul class="space-y-2">
                        @foreach($order->items as $item)
                        <li class="flex justify-between text-sm">
                            <span>{{ $item->product->name_ar ?? 'منتج محذوف' }} × {{ $item->quantity }}</span>
                            <span>{{ number_format($item->price * $item->quantity, 2) }} ج.م</span>
                        </li>
                        @endforeach
                    </ul>
                </div>
                
                <div class="border-t pt-4 flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-600">العنوان:</p>
                        <p class="text-sm">{{ $order->address }}</p>
                    </div>
                    <div class="text-left">
                        <p class="text-lg font-bold text-green-600">{{ number_format($order->total, 2) }} ج.م</p>
                    </div>
                </div>
                
                @if($order->notes)
                <div class="mt-4 pt-4 border-t">
                    <p class="text-sm text-gray-600">ملاحظات:</p>
                    <p class="text-sm">{{ $order->notes }}</p>
                </div>
                @endif
                
                <div class="mt-4">
                    <a href="{{ route('orders.show', $order) }}" class="text-green-600 hover:text-green-700 font-semibold text-sm">
                        عرض التفاصيل →
                    </a>
                </div>
            </div>
        </div>
        @endforeach
    </div>
    
    <div class="mt-6">
        {{ $orders->links() }}
    </div>
    @else
    <div class="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h2 class="text-xl font-semibold mb-2">لا توجد طلبات</h2>
        <p class="text-gray-600 mb-6">لم تقم بأي طلبات بعد</p>
        <a href="{{ route('products.index') }}" class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            تصفح المنتجات
        </a>
    </div>
    @endif
</div>
@endsection

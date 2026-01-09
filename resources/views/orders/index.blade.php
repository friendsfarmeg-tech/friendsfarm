@extends('layouts.app')

@section('content')
<div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem; color: var(--primary);">{{ __('My Orders') }}</h1>

    @if($orders->isEmpty())
        <div style="text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <i data-lucide="package" style="width: 4rem; height: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">{{ __('No orders found') }}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">{{ __('You haven\'t placed any orders yet.') }}</p>
            <a href="{{ route('products.index') }}" class="btn" style="background: var(--primary); color: white; padding: 0.8rem 2rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="shopping-bag" style="width: 1.2rem;"></i>
                <span>{{ __('Start Shopping') }}</span>
            </a>
        </div>
    @else
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            @foreach($orders as $order)
                <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
                    
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.2rem;">
                            {{ __('Order #') }}{{ substr($order->id, 0, 8) }}
                        </div>
                        <div style="font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="calendar" style="width: 1rem; color: var(--primary);"></i>
                            {{ $order->created_at->format('d M Y, h:i A') }}
                        </div>
                    </div>

                    <div style="display: flex; gap: 2rem; align-items: center; flex: 1; justify-content: center;">
                        <div style="text-align: center;">
                            <span style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.2rem;">{{ __('Total') }}</span>
                            <span style="font-weight: 900; color: var(--primary); font-size: 1.2rem;">
                                {{ number_format($order->total, 2) }} {{ __('EGP') }}
                            </span>
                        </div>
                        <div style="text-align: center;">
                            <span style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.2rem;">{{ __('Status') }}</span>
                            <span style="padding: 0.3rem 0.8rem; border-radius: 2rem; font-size: 0.85rem; font-weight: 800; 
                                background: {{ $order->status == 'completed' ? '#d1fae5' : ($order->status == 'cancelled' ? '#fee2e2' : '#fef3c7') }}; 
                                color: {{ $order->status == 'completed' ? '#065f46' : ($order->status == 'cancelled' ? '#991b1b' : '#92400e') }};">
                                {{ ucfirst(__($order->status)) }}
                            </span>
                        </div>
                    </div>

                    <a href="{{ route('orders.show', $order) }}" class="btn" style="background: transparent; border: 2px solid var(--primary); color: var(--primary); padding: 0.6rem 1.2rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem;">
                        <span>{{ __('View Details') }}</span>
                        <i data-lucide="arrow-right" style="width: 1rem;"></i>
                    </a>

                </div>
            @endforeach
        </div>

        <div style="margin-top: 2rem;">
            {{ $orders->links() }}
        </div>
    @endif
</div>
@endsection

@extends('layouts.app')

@section('content')
<div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <div style="margin-bottom: 2rem;">
        <a href="{{ route('orders.index') }}" style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-weight: 700; transition: color 0.3s;">
            <i data-lucide="arrow-left" style="width: 1.2rem;"></i>
            <span>{{ __('Back to Orders') }}</span>
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success" style="background: #d1fae5; color: #065f46; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #a7f3d0;">
            <i data-lucide="check-circle-2" style="width: 1.5rem;"></i>
            <span style="font-weight: 700;">{{ session('success') }}</span>
        </div>
    @endif

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        
        <!-- Order Items -->
        <div style="background: var(--card-bg); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <h1 style="font-size: 1.8rem; font-weight: 900; color: var(--primary);">{{ __('Order Details') }}</h1>
                <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">#{{ substr($order->id, 0, 8) }}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                @foreach($order->items as $item)
                    <div style="display: flex; gap: 1.5rem; align-items: center;">
                        <img src="{{ $item->product->image_url }}" alt="" style="width: 5rem; height: 5rem; object-fit: cover; border-radius: var(--radius-md);">
                        
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.3rem;">
                                <a href="{{ route('products.show', $item->product) }}" style="text-decoration: none; color: var(--text-dark);">
                                    {{ $item->product->display_name }}
                                </a>
                            </h3>
                            <div style="color: var(--text-muted); font-size: 0.9rem;">
                                {{ number_format($item->price, 2) }} EGP x {{ $item->quantity }}
                            </div>
                        </div>

                        <div style="font-weight: 800; font-size: 1.1rem;">
                            {{ number_format($item->price * $item->quantity, 2) }} {{ __('EGP') }}
                        </div>
                    </div>
                @endforeach
            </div>
            
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                 <span style="font-size: 1.2rem; font-weight: 700; color: var(--text-muted);">{{ __('Total Amount') }}</span>
                 <span style="font-size: 1.8rem; font-weight: 900; color: var(--primary);">{{ number_format($order->total, 2) }} {{ __('EGP') }}</span>
            </div>
        </div>

        <!-- Order Status & Info -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1rem;">{{ __('Order Status') }}</h3>
                <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem;">
                    @if($order->status == 'pending')
                        <i data-lucide="clock" style="color: #d97706; width: 1.5rem;"></i>
                    @elseif($order->status == 'completed')
                        <i data-lucide="check-circle" style="color: #059669; width: 1.5rem;"></i>
                    @elseif($order->status == 'cancelled')
                         <i data-lucide="x-circle" style="color: #dc2626; width: 1.5rem;"></i>
                    @else
                         <i data-lucide="package" style="color: var(--primary); width: 1.5rem;"></i>
                    @endif
                    <span style="font-weight: 700; font-size: 1.1rem; text-transform: capitalize;">{{ __($order->status) }}</span>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    {{ __('Placed on') }} {{ $order->created_at->format('d M Y, h:i A') }}
                </div>
            </div>

            <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1rem;">{{ __('Delivery Info') }}</h3>
                
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.2rem;">{{ __('Delivery Address') }}</div>
                    <div style="font-weight: 600; line-height: 1.5;">{{ $order->address }}</div>
                </div>

                @if($order->notes)
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.2rem;">{{ __('Notes') }}</div>
                    <div style="font-weight: 600; line-height: 1.5; font-style: italic;">"{{ $order->notes }}"</div>
                </div>
                @endif
            </div>

            <a href="https://wa.me/{{ $settings['whatsapp'] ?? '201515419092' }}?text={{ urlencode('Hello, I have a question about my order #' . substr($order->id, 0, 8)) }}" target="_blank" class="btn" style="background: #25D366; color: white; padding: 1rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-align: center;">
                <i data-lucide="message-circle" style="width: 1.2rem;"></i>
                <span>{{ __('Need Help?') }}</span>
            </a>
        </div>

    </div>
</div>
@endsection

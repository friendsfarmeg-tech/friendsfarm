@extends('layouts.app')

@section('content')
<div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem; color: var(--primary);">{{ __('Checkout') }}</h1>

    @if(session('error'))
        <div class="alert alert-danger" style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            {{ session('error') }}
        </div>
    @endif

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        
        <!-- Checkout Form -->
        <div style="background: var(--card-bg); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="map-pin" style="color: var(--primary);"></i>
                {{ __('Delivery Details') }}
            </h2>

            <form action="{{ route('orders.store') }}" method="POST" id="checkout-form">
                @csrf
                
                <div style="margin-bottom: 1.5rem;">
                    <label for="address" style="display: block; font-weight: 700; margin-bottom: 0.5rem;">{{ __('Delivery Address') }}</label>
                    <textarea name="address" id="address" rows="3" required
                        style="width: 100%; padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-beige); font-size: 1rem;"
                        placeholder="{{ __('Enter your detailed address here...') }}">{{ old('address', auth()->user()->address ?? '') }}</textarea>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label for="phone" style="display: block; font-weight: 700; margin-bottom: 0.5rem;">{{ __('Phone Number') }}</label>
                    <input type="text" name="phone" id="phone" required
                        style="width: 100%; padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-beige); font-size: 1rem;"
                        value="{{ old('phone', auth()->user()->phone ?? '') }}" placeholder="01xxxxxxxxx">
                </div>

                <div style="margin-bottom: 2rem;">
                    <label for="notes" style="display: block; font-weight: 700; margin-bottom: 0.5rem;">{{ __('Delivery Notes (Optional)') }}</label>
                    <textarea name="notes" id="notes" rows="2"
                        style="width: 100%; padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-beige); font-size: 1rem;"
                        placeholder="{{ __('Any special instructions?') }}">{{ old('notes') }}</textarea>
                </div>

                <button type="submit" class="btn" style="background: var(--primary); color: white; width: 100%; padding: 1rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.1rem; border: none; cursor: pointer;">
                    <span>{{ __('Place Order') }}</span>
                    <i data-lucide="check-circle" style="width: 1.2rem;"></i>
                </button>
            </form>
        </div>

        <!-- Order Summary -->
        <div style="background: var(--card-bg); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); height: fit-content; position: sticky; top: 6rem;">
            <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">{{ __('Order Application') }}</h3>
            
            <div style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                @foreach($items as $item)
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <img src="{{ $item['product']->image_url }}" alt="" style="width: 3rem; height: 3rem; object-fit: cover; border-radius: var(--radius-sm);">
                        <div style="flex: 1; font-size: 0.9rem;">
                            <div style="font-weight: 700;">{{ $item['product']->display_name }}</div>
                            <div style="color: var(--text-muted);">x {{ $item['quantity'] }}</div>
                        </div>
                        <div style="font-weight: 700;">
                            {{ number_format($item['product']->price * $item['quantity'], 2) }}
                        </div>
                    </div>
                @endforeach
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-muted);">
                    <span>{{ __('Subtotal') }}</span>
                    <span>{{ number_format($total, 2) }} {{ __('EGP') }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.4rem; font-weight: 900; color: var(--primary); margin-top: 1rem;">
                    <span>{{ __('Total') }}</span>
                    <span>{{ number_format($total, 2) }} {{ __('EGP') }}</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem; font-size: 0.9rem; color: var(--text-muted); display: flex; gap: 0.5rem; align-items: center; justify-content: center;">
                <i data-lucide="shield-check" style="width: 1rem;"></i>
                <span>{{ __('Secure Payment & Delivery') }}</span>
            </div>
        </div>

    </div>
</div>
@endsection

@extends('layouts.app')

@section('content')
<div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem; color: var(--primary);">{{ __('Shopping Cart') }}</h1>

    @if(session('success'))
        <div class="alert alert-success" style="background: #d1fae5; color: #065f46; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            {{ session('success') }}
        </div>
    @endif

    @if(empty($items))
        <div style="text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <i data-lucide="shopping-cart" style="width: 4rem; height: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">{{ __('Your cart is empty') }}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">{{ __('Looks like you haven\'t added any products yet.') }}</p>
            <a href="{{ route('products.index') }}" class="btn" style="background: var(--primary); color: white; padding: 0.8rem 2rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="arrow-right" style="width: 1.2rem;"></i>
                <span>{{ __('Start Shopping') }}</span>
            </a>
        </div>
    @else
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                @foreach($items as $item)
                    <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; gap: 1.5rem; align-items: center;">
                        <img src="{{ $item['product']->image_url }}" alt="{{ $item['product']->display_name }}" style="width: 6rem; height: 6rem; object-fit: cover; border-radius: var(--radius-md);">
                        
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem;">
                                <a href="{{ route('products.show', $item['product']) }}" style="text-decoration: none; color: var(--text-dark);">
                                    {{ $item['product']->display_name }}
                                </a>
                            </h3>
                            <p style="color: var(--theme-color); font-weight: 700;">
                                {{ number_format($item['product']->price, 2) }} {{ __('EGP') }}
                            </p>
                        </div>

                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <form action="{{ route('cart.update', $item['product']) }}" method="POST" style="display: flex; align-items: center; gap: 0.5rem;">
                                @csrf
                                @method('PUT')
                                <input type="number" name="quantity" value="{{ $item['quantity'] }}" min="1" style="width: 4rem; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); text-align: center; font-weight: 700;">
                                <button type="submit" style="background: transparent; border: none; color: var(--primary); cursor: pointer;" title="{{ __('Update') }}">
                                    <i data-lucide="refresh-cw" style="width: 1.2rem;"></i>
                                </button>
                            </form>

                            <form action="{{ route('cart.remove', $item['product']) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" style="background: transparent; border: none; color: #ef4444; cursor: pointer;" title="{{ __('Remove') }}">
                                    <i data-lucide="trash-2" style="width: 1.2rem;"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>

            <div style="background: var(--card-bg); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); height: fit-content; position: sticky; top: 6rem;">
                <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">{{ __('Order Summary') }}</h3>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem;">
                    <span style="color: var(--text-muted);">{{ __('Subtotal') }}</span>
                    <span style="font-weight: 800;">{{ number_format($total, 2) }} {{ __('EGP') }}</span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 1.3rem; font-weight: 900; color: var(--primary);">
                    <span>{{ __('Total') }}</span>
                    <span>{{ number_format($total, 2) }} {{ __('EGP') }}</span>
                </div>

                <a href="{{ route('orders.checkout') }}" class="btn" style="background: var(--primary); color: white; width: 100%; padding: 1rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span>{{ __('Proceed to Checkout') }}</span>
                    <i data-lucide="arrow-right" style="width: 1.2rem;"></i>
                </a>

                <form action="{{ route('cart.clear') }}" method="POST" style="margin-top: 1rem;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" style="background: transparent; border: none; color: var(--text-muted); width: 100%; text-align: center; cursor: pointer; text-decoration: underline; font-size: 0.9rem;">
                        {{ __('Clear Cart') }}
                    </button>
                </form>
            </div>
        </div>
    @endif
</div>
@endsection

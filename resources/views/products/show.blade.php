@extends('layouts.app')

@push('styles')
<style>
    .product-details { padding: 4rem 0; }
    .product-img-box {
        border-radius: 2rem; overflow: hidden; border: 1px solid var(--border-color);
        background: var(--bg-beige); position: sticky; top: 6rem;
    }
    .product-img-box img { width: 100%; height: auto; display: block; }
    
    .rating-form {
        background: var(--bg-beige); padding: 2rem; border-radius: 1.5rem;
        margin-top: 3rem; border: 1px solid var(--border-color);
    }
    .star-rating {
        display: flex; flex-direction: row-reverse; gap: 0.5rem; justify-content: flex-end;
    }
    .star-rating input { display: none; }
    .star-rating label { cursor: pointer; color: var(--text-muted); transition: scale 0.2s; }
    .star-rating input:checked ~ label,
    .star-rating label:hover,
    .star-rating label:hover ~ label { color: var(--gold-egg); }
    .star-rating label:hover { transform: scale(1.2); }
</style>
@endpush

@section('content')
<div class="container product-details">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); gap: 4rem;">
        <!-- Image Column -->
        <div class="product-img-box">
            <img src="{{ $product->image_url ?? 'https://placehold.co/600' }}" alt="{{ $product->display_name }}">
        </div>

        <!-- Info Column -->
        <div>
            <nav style="margin-bottom: 2rem; background: transparent; padding: 0; border: none; backdrop-filter: none; position: static;">
               <a href="{{ route('products.index') }}" style="text-decoration: none; color: var(--text-muted); font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
                   <i data-lucide="{{ app()->getLocale() === 'ar' ? 'arrow-right' : 'arrow-left' }}" style="width: 1.2rem;"></i> {{ __('All Products') }}
               </a>
            </nav>

            <span style="color: var(--primary); font-weight: 850; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1rem;">
                {{ $product->category->display_name ?? '' }}
            </span>
            <h1 style="font-size: 2.8rem; font-weight: 950; color: var(--text-dark); margin: 0.5rem 0 1.5rem; line-height: 1.1;">
                {{ $product->display_name }}
            </h1>

            <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem;">
                <div style="display: flex; align-items: baseline; gap: 0.2rem;">
                    <span style="font-size: 2.4rem; font-weight: 950; color: var(--primary);">{{ number_format($product->price) }}</span>
                    <small style="font-size: 1rem; font-weight: 850; color: var(--primary);">{{ __('EGP') }}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-beige); padding: 0.5rem 1rem; border-radius: 3rem;">
                    <div style="display: flex; gap: 0.1rem; color: var(--gold-egg);">
                        @php $avg = round($product->average_rating); @endphp
                        @for($i=1; $i<=5; $i++) <i data-lucide="{{ $i <= $avg ? 'egg' : 'egg-off' }}" style="width: 1.1rem; fill: {{ $i <= $avg ? 'currentColor' : 'none' }};"></i> @endfor
                    </div>
                    <span style="font-weight: 900; font-size: 0.9rem;">({{ $product->reviews()->count() }})</span>
                </div>
            </div>

            <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.8; margin-bottom: 3rem;">
                {{ $product->display_description ?: __('Fresh from our farm directly to you, unbeatable quality and prices.') }}
            </p>

            <button class="add-btn-bouncy" style="width: 100%; justify-content: center; font-size: 1.2rem; gap: 0.8rem;">
                <i data-lucide="shopping-basket"></i>
                {{ __('Add to Cart') }}
            </button>

            <!-- Rating Section -->
            <div class="rating-form">
                <h3 style="font-weight: 900; color: var(--text-dark); margin-bottom: 1.5rem;">{{ __('How Customers Say') }}?</h3>
                <form action="#" method="POST">
                    <div class="star-rating" style="margin-bottom: 1.5rem;">
                        @for($i=5; $i>=1; $i--)
                        <input type="radio" id="egg{{ $i }}" name="rating" value="{{ $i }}">
                        <label for="egg{{ $i }}"><i data-lucide="egg" style="width: 2rem; height: 2rem;"></i></label>
                        @endfor
                    </div>
                    <textarea placeholder="{{ __('Comment') }}..." style="width: 100%; padding: 1rem; border-radius: 1rem; border: 1px solid var(--border-color); background: white; font-family: inherit; margin-bottom: 1rem; resize: none; height: 6rem;"></textarea>
                    <button type="button" style="background: var(--text-dark); color: white; border: none; padding: 0.8rem 2rem; border-radius: 3rem; font-weight: 800; cursor: pointer;">
                        {{ __('Send') }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

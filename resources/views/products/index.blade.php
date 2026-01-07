@extends('layouts.app')

@push('styles')
<style>
    .products-header {
        background: var(--bg-beige);
        padding: 4rem 1.5rem;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 3rem;
    }
    
    .filter-container {
        display: flex;
        justify-content: center;
        gap: 0.8rem;
        flex-wrap: wrap;
        margin-bottom: 3rem;
    }
    
    .filter-btn {
        padding: 0.6rem 1.2rem;
        border-radius: 2rem;
        border: 1px solid var(--border-color);
        background: white;
        color: var(--text-dark);
        text-decoration: none;
        font-weight: 800;
        font-size: 0.9rem;
        transition: all 0.3s;
    }
    
    .filter-btn:hover, .filter-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        box-shadow: 0 0.5rem 1rem rgba(27, 94, 32, 0.15);
    }

    /* CARD STYLES (Copied from home for consistency) */
    .p-card {
        background: var(--card-bg); border-radius: 1.2rem; border: 1px solid var(--border-color);
        overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        height: 100%; display: flex; flex-direction: column;
        box-shadow: 0 0.4rem 1.2rem rgba(0,0,0,0.03);
    }
    .p-card:hover { 
        transform: translateY(-0.5rem); 
        box-shadow: 0 1rem 2.5rem rgba(0,0,0,0.07); 
        border-color: var(--primary-light); 
    }
    .p-img-box { position: relative; height: 11rem; overflow: hidden; background: var(--bg-beige); border-bottom: 1px solid var(--border-color); }
    .p-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
    
    .p-badge {
        position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(255,255,255,0.92);
        backdrop-filter: blur(5px); color: var(--primary); padding: 0.3rem 0.7rem;
        border-radius: 3rem; font-weight: 850; font-size: 0.7rem;
    }

    .rating-mini { display: flex; gap: 0.15rem; color: var(--gold-egg); margin-bottom: 0.4rem; }
    .rating-mini i { fill: var(--gold-egg); width: 0.85rem; height: 0.85rem; }

    .pagination-container {
        margin-top: 4rem;
        display: flex;
        justify-content: center;
    }

    @media (max-width: 48rem) {
        .products-header { padding: 3rem 1rem; margin-bottom: 2rem; }
        .p-img-box { height: 10rem; }
    }
</style>
@endpush

@section('content')
<div class="products-header">
    <div class="container">
        <h1 class="section-title" style="font-size: 2.5rem; margin-bottom: 1rem;">{{ __('Our Products') }}</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 30rem; margin: 0 auto; font-weight: 700;">
            {{ __('Fresh from our farm to your kitchen') }}
        </p>
    </div>
</div>

<div class="container" style="margin-bottom: 5rem;">
    <!-- CATEGORY FILTERS -->
    <div class="filter-container animate-fade-in">
        <a href="{{ route('products.index') }}" class="filter-btn {{ !request('category') ? 'active' : '' }}">
            {{ __('All') }}
        </a>
        @foreach($categories as $category)
        <a href="{{ route('products.index', ['category' => $category->id]) }}" 
           class="filter-btn {{ request('category') == $category->id ? 'active' : '' }}">
            {{ $category->display_name }}
        </a>
        @endforeach
    </div>

    <!-- PRODUCTS GRID -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); gap: 1.5rem;" class="animate-fade-in">
        @forelse($products as $product)
        <div class="p-card">
            <a href="{{ route('products.show', $product) }}" class="p-img-box">
                <img src="{{ $product->image_url ?? 'https://placehold.co/300' }}" alt="{{ $product->display_name }}" loading="lazy">
                <span class="p-badge">{{ $product->category->display_name ?? '' }}</span>
            </a>
            <div style="padding: 1.2rem; flex: 1; display: flex; flex-direction: column;">
                <div class="rating-mini">
                     @php $rating = round($product->average_rating); @endphp
                     @for($i=1; $i<=5; $i++) 
                        <i data-lucide="{{ $i <= $rating ? 'egg' : 'egg-off' }}"></i> 
                     @endfor
                </div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 850; color: var(--text-dark);">
                    <a href="{{ route('products.show', $product) }}" style="text-decoration: none; color: inherit;">
                        {{ $product->display_name }}
                    </a>
                </h3>
                
                <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 1rem;">
                    <div style="display: flex; align-items: baseline; gap: 0.15rem;">
                        <span style="font-size: 1.25rem; font-weight: 950; color: var(--primary);">{{ number_format($product->price) }}</span>
                        <small style="font-size: 0.65rem; font-weight: 800; color: var(--primary);">{{ __('EGP') }}</small>
                    </div>
                    <button class="add-btn-bouncy" title="{{ __('Add to Cart') }}">
                        <i data-lucide="shopping-basket" style="width: 1.2rem;"></i>
                    </button>
                </div>
            </div>
        </div>
        @empty
        <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 0;">
            <i data-lucide="search-x" style="width: 4rem; height: 4rem; color: var(--border-color); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-muted);">{{ __('No products found') }}</h3>
        </div>
        @endforelse
    </div>

    <!-- PAGINATION -->
    @if($products->hasPages())
    <div class="pagination-container animate-fade-in">
        {{ $products->links() }}
    </div>
    @endif
</div>
@endsection

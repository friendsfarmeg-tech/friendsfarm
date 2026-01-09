@extends('layouts.app')

@section('content')
<div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem; color: var(--primary);">{{ __('My Wishlist') }}</h1>

    @if(session('success'))
        <div class="alert alert-success" style="background: #d1fae5; color: #065f46; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            {{ session('success') }}
        </div>
    @endif

    @if($wishlistItems->isEmpty())
        <div style="text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <i data-lucide="heart" style="width: 4rem; height: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">{{ __('Your wishlist is empty') }}</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">{{ __('Save items you love here for later.') }}</p>
            <a href="{{ route('products.index') }}" class="btn" style="background: var(--primary); color: white; padding: 0.8rem 2rem; border-radius: var(--radius-md); text-decoration: none; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="arrow-right" style="width: 1.2rem;"></i>
                <span>{{ __('Browse Products') }}</span>
            </a>
        </div>
    @else
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">
            @foreach($wishlistItems as $item)
                <div style="background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="position: relative; padding-top: 100%;">
                        <img src="{{ $item->product->image_url }}" alt="{{ $item->product->display_name }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                        <form action="{{ route('wishlist.destroy', $item->product) }}" method="POST" style="position: absolute; top: 0.5rem; right: 0.5rem;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" style="background: white; border: none; width: 2.2rem; height: 2.2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ef4444; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i data-lucide="x" style="width: 1.2rem;"></i>
                            </button>
                        </form>
                    </div>
                    
                    <div style="padding: 1rem; flex: 1; display: flex; flex-direction: column;">
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem;">
                                <a href="{{ route('products.show', $item->product) }}" style="text-decoration: none; color: var(--text-dark);">
                                    {{ $item->product->display_name }}
                                </a>
                            </h3>
                            <p style="color: var(--primary); font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">
                                {{ number_format($item->product->price, 2) }} {{ __('EGP') }}
                            </p>
                        </div>
                        
                        <form action="{{ route('cart.add', $item->product) }}" method="POST">
                            @csrf
                            <button type="submit" style="background: var(--primary); color: white; width: 100%; padding: 0.8rem; border-radius: var(--radius-md); border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background 0.3s;">
                                <i data-lucide="shopping-cart" style="width: 1.2rem;"></i>
                                <span>{{ __('Add to Cart') }}</span>
                            </button>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>
        
        <div style="margin-top: 2rem;">
            {{ $wishlistItems->links() }}
        </div>
    @endif
</div>
@endsection

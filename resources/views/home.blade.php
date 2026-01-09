@extends('layouts.app')

@push('styles')
<style>
    /* HERO SECTION - SEMANTIC IMAGE FIX */
    .hero-section {
        position: relative; min-height: 100vh; overflow: hidden;
        background: #050f06; display: flex; align-items: center;
        text-align: center;
    }
    .hero-img {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        object-fit: cover; object-position: center 40%;
        filter: brightness(0.5); z-index: 1;
    }
    .hero-overlay {
        position: absolute; inset: 0; z-index: 2;
        background: rgba(5, 15, 6, 0.45); /* Unified Dark Green Layer */
        backdrop-filter: blur(1px); /* Subtle focus */
    }
    .hero-content { position: relative; z-index: 3; width: 100%; padding: 3rem 1rem; }
    
    /* COMPACT HEADINGS */
    .h-title { 
        font-size: 3rem; font-weight: 900; margin-bottom: 1rem; color: white; 
        text-shadow: 0 0.3rem 1.2rem rgba(0,0,0,0.4); line-height: 1.1; 
    }
    .h-subtitle { 
        font-size: 1.15rem; color: #e2e8f0; margin-bottom: 2rem; max-width: 35rem; 
        margin-left: auto; margin-right: auto; font-weight: 700; opacity: 0.9; 
    }
    
    .section-title {
        font-size: 1.8rem; font-weight: 950; color: var(--primary); 
        letter-spacing: -0.05rem; margin-bottom: 0.5rem;
    }

    @media (max-width: 48rem) {
        .hero-section { min-height: 40vh; }
        .h-title { font-size: 2rem; }
        .h-subtitle { font-size: 0.95rem; margin-bottom: 1.5rem; }
        .section-title { font-size: 1.5rem; }
    }

    /* 3-CARD FEATURE GRID - CRITICAL FLEX FIX */
    .feature-grid {
        display: flex;
        gap: 0.8rem;
        margin-bottom: 3rem;
        width: 100%;
        justify-content: space-between;
    }
    .feature-card-modern {
        flex: 1;
        min-width: 0;
        background: var(--card-bg);
        border-radius: 1.2rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 20px rgba(0,0,0,0.02);
        padding: 1.2rem 0.4rem;
        text-align: center;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @media (max-width: 48rem) {
        .feature-grid { gap: 0.2rem; margin-bottom: 2rem; }
        .feature-card-modern { border-radius: 0.6rem; padding: 0.6rem 0.1rem; }
        .feature-card-modern h4 { 
            font-size: 0.5rem !important; font-weight: 900 !important; 
            margin-bottom: 0.1rem !important; line-height: 1; 
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 95%;
        }
        .feature-card-modern p { 
            font-size: 0.4rem !important; line-height: 1; 
            letter-spacing: -0.01rem; white-space: nowrap; 
            overflow: hidden; text-overflow: ellipsis; width: 95%;
            opacity: 0.8;
        }
        .feature-card-modern .icon-box { 
            width: 1.8rem !important; height: 1.8rem !important; 
            margin-bottom: 0.25rem !important; border-radius: 0.5rem !important;
        }
        .feature-card-modern i { width: 0.8rem !important; height: 0.8rem !important; }
    }

    /* OFFERS SECTION */
    .offers-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 1.5rem;
        margin-bottom: 4rem;
    }
    .offer-card {
        background: var(--card-bg); border-radius: 1.5rem; overflow: hidden;
        border: 1px solid var(--border-color); position: relative;
        box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.04);
        transition: all 0.4s;
    }
    .offer-card:hover { transform: translateY(-0.5rem); box-shadow: 0 1rem 3rem rgba(0,0,0,0.08); border-color: var(--primary-light); }
    .offer-badge {
        position: absolute; top: 1rem; left: 1rem; background: var(--gold-egg);
        color: #1B5E20; padding: 0.4rem 1rem; border-radius: 3rem;
        font-weight: 900; font-size: 0.85rem; z-index: 2;
    }
    .offer-img { height: 12rem; width: 100%; object-fit: cover; }
    .offer-content { padding: 1.2rem; }
    .offer-price-row { display: flex; align-items: center; gap: 0.8rem; margin-top: 0.8rem; }
    .offer-price { font-size: 1.4rem; font-weight: 950; color: var(--primary); }
    .offer-original { font-size: 0.95rem; color: var(--text-muted); text-decoration: line-through; }

    /* SLIDER STYLES */
    .featured-slider {
        display: flex; gap: 1.2rem; overflow-x: auto; 
        scroll-snap-type: x mandatory; padding: 0.5rem 0 2rem;
        scrollbar-width: none; -ms-overflow-style: none;
    }
    .featured-slider::-webkit-scrollbar { display: none; }
    .featured-item { scroll-snap-align: start; flex: 0 0 calc(25% - 1rem); min-width: 15rem; }

    @media (max-width: 64rem) { .featured-item { flex: 0 0 45%; } }
    @media (max-width: 37.5rem) { .featured-item { flex: 0 0 75%; } }

    /* CARD MODERNIZATION */
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

    /* CATEGORY CARDS - 2 COL MOBILE */
    .c-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    @media (max-width: 64rem) { .c-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 37.5rem) { .c-grid { grid-template-columns: repeat(2, 1fr); gap: 0.8rem; } }

    .c-card {
        position: relative; height: 10rem; border-radius: 1.2rem; overflow: hidden;
        text-decoration: none; color: white; display: flex; align-items: flex-end;
        padding: 1.2rem; transition: all 0.4s; border: 1.5px solid transparent;
    }
    .c-card:hover { transform: translateY(-0.3125rem); border-color: var(--primary-light); }
    .c-card img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; filter: brightness(0.7); transition: 0.4s; }
    .c-card:hover img { filter: brightness(0.6); transform: scale(1.05); }
    .c-card .gradient { position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); z-index: 2; }
    .c-card h3 { position: relative; z-index: 3; font-size: 1.1rem; font-weight: 900; margin: 0; }

    /* TESTIMONIALS SECTION */
    .testimonial-card {
        background: var(--bg-beige); padding: 1.5rem; border-radius: 1.2rem;
        border: 1px solid var(--border-color); text-align: center;
    }
    .testimonial-quote { font-style: italic; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; }
    .testimonial-author { font-weight: 850; color: var(--text-dark); font-size: 0.9rem; }

    /* CART BUTTON ANIMATION - Restored & Smooth */
    .add-btn-bouncy {
        background: var(--primary); color: white;
        width: 2.8rem; height: 2.8rem; border-radius: 1rem;
        display: flex; align-items: center; justify-content: center;
        border: none; cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .add-btn-bouncy:hover {
        transform: scale(1.1) rotate(8deg);
        background: var(--primary-light);
        box-shadow: 0 0.5rem 1rem rgba(27, 94, 32, 0.3);
    }
    .add-btn-bouncy:active { transform: scale(0.9); }

    /* FEATURE GRID - STRICTLY SIDE-BY-SIDE */
    .feature-grid {
        display: flex; gap: 0.8rem; flex-wrap: nowrap; /* Force 3 columns */
        padding: 0.5rem 0.5rem 2rem; margin-bottom: 3rem;
        width: 100%;
    }
    .feature-card-modern {
        flex: 1; min-width: 0; /* Allow equal shrinking */
        background: var(--card-bg); border-radius: 1.5rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        padding: 1.5rem 0.5rem; text-align: center; /* Compact padding */
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex; flex-direction: column; align-items: center;
    }
    .feature-card-modern h4 { font-size: 0.95rem; white-space: nowrap; }
    .feature-card-modern p { font-size: 0.8rem; }
    
    .feature-card-modern:hover {
        transform: translateY(-0.75rem);
        box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        border-color: var(--primary-light);
    }
</style>
@endpush

@section('content')
    <!-- Semantic Hero Section with <img> -->
    <div class="hero-section">
        <img src="{{ $settings['hero_image'] ?? asset('hero-bg.png') }}" alt="Friends Farm Hero" class="hero-img" loading="eager">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
            <span class="animate-fade-in" style="display: inline-block; background: rgba(255,255,255,0.15); color: white; padding: 0.4rem 1.2rem; border-radius: 2rem; font-weight: 800; font-size: 0.85rem; margin-bottom: 1.2rem; backdrop-filter: blur(5px);">{{ __('Welcome Message') }}</span>
            <h1 class="animate-fade-in h-title">
                {{ $settings['hero_title'] ?? __('Brand Name') }}
            </h1>
            <p class="animate-fade-in h-subtitle">
                {{ $settings['hero_subtitle'] ?? __('Hero Slogan') }}
            </p>
            <div class="animate-fade-in" style="animation-delay: 0.3s;">
                <a href="/products" class="btn" style="padding: 0.9rem 3rem; font-size: 1.05rem; background: var(--gold-egg); color: #1B5E20; font-weight: 900; border-radius: 3rem; text-decoration: none; box-shadow: 0 0.5rem 1.5rem rgba(255, 214, 0, 0.3); transition: all 0.3s; display: inline-block;">
                    {{ __('Shop Now') }}
                </a>
            </div>
        </div>
    </div>

    <div class="container" style="margin-top: -2.5rem; position: relative; z-index: 10;">
        <!-- 3-Card Feature Grid (Strict Horizontal) -->
        <div class="feature-grid animate-fade-in">
            <div class="feature-card-modern">
                <div class="icon-box" style="width: 3.5rem; height: 3.5rem; background: rgba(27, 94, 32, 0.05); border-radius: 1.2rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: var(--primary);">
                    <i data-lucide="truck" style="width: 1.75rem;"></i>
                </div>
                <h4 style="font-weight: 900; color: var(--text-dark); margin-bottom: 0.5rem; font-size: 1.1rem;">{{ __('Fast Delivery') }}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">{{ __('Within 24 hours') }}</p>
            </div>
            <div class="feature-card-modern">
                <div class="icon-box" style="width: 3.5rem; height: 3.5rem; background: rgba(27, 94, 32, 0.05); border-radius: 1.2rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: var(--primary);">
                    <i data-lucide="home" style="width: 1.75rem;"></i>
                </div>
                <h4 style="font-weight: 900; color: var(--text-dark); margin-bottom: 0.5rem; font-size: 1.1rem;">{{ __('Home Raised') }}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">{{ __('No hormones') }}</p>
            </div>
            <div class="feature-card-modern">
                <div class="icon-box" style="width: 3.5rem; height: 4rem; background: rgba(27, 94, 32, 0.05); border-radius: 1.2rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: var(--primary);">
                    <i data-lucide="award" style="width: 1.75rem;"></i>
                </div>
                <h4 style="font-weight: 900; color: var(--text-dark); margin-bottom: 0.5rem; font-size: 1.1rem;">{{ __('High Quality') }}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">{{ __('Halal Slaughter') }}</p>
            </div>
        </div>

        <!-- Special Offers Section (Dynamic) -->
        @if($offers->count() > 0)
        <div class="animate-fade-in" style="margin-bottom: 4rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.8rem;">
                <div>
                    <h2 class="section-title">{{ __('Special Offers') }}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem; font-weight: 700;">{{ __('Limited Time Deals') }}</p>
                </div>
            </div>
            <div class="offers-grid">
                @foreach($offers as $offer)
                <div class="offer-card">
                    @if($offer->discount_percentage > 0)
                    <span class="offer-badge">-{{ $offer->discount_percentage }}%</span>
                    @endif
                    <img src="{{ $offer->image_url ?? 'https://placehold.co/400x300' }}" alt="{{ $offer->display_title }}" class="offer-img" loading="lazy">
                    <div class="offer-content">
                        <h3 style="font-weight: 900; font-size: 1.1rem; margin: 0 0 0.3rem; color: var(--text-dark);">{{ $offer->display_title }}</h3>
                        @if($offer->display_description)
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">{{ Str::limit($offer->display_description, 60) }}</p>
                        @endif
                        <div class="offer-price-row">
                            <span class="offer-price">{{ number_format($offer->offer_price) }} {{ __('EGP') }}</span>
                            @if($offer->original_price)
                            <span class="offer-original">{{ number_format($offer->original_price) }}</span>
                            @endif
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Categories Section -->
        <div class="animate-fade-in" style="margin-bottom: 4rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.8rem;">
                <div>
                    <h2 class="section-title">{{ __('Explore Our Sections') }}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem; font-weight: 700;">{{ __('Best Poultry Selection') }}</p>
                </div>
                <a href="/products" style="display: flex; align-items: center; gap: 0.4rem; font-weight: 900; color: var(--primary); text-decoration: none; font-size: 0.95rem;">
                    {{ __('All') }} <i data-lucide="{{ app()->getLocale() === 'ar' ? 'arrow-left' : 'arrow-right' }}" style="width: 1rem;"></i>
                </a>
            </div>
            <div class="c-grid">
                @foreach($categories as $category)
                <a href="/products?category={{ $category->id }}" class="c-card">
                    <img src="{{ $category->image_url ?? 'https://placehold.co/300' }}" alt="{{ $category->display_name }}" loading="lazy">
                    <div class="gradient"></div>
                    <h3>{{ $category->display_name }}</h3>
                </a>
                @endforeach
            </div>
        </div>

        <!-- Featured Products Slider -->
        <div class="animate-fade-in" style="margin-bottom: 4rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 class="section-title">{{ __('Featured Products') }}</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="document.querySelector('.featured-slider').scrollBy({left: -250, behavior: 'smooth'})" class="nav-btn" style="width: 2.2rem; height: 2.2rem; border: 1px solid var(--border-color);"><i data-lucide="chevron-left" style="width: 1rem;"></i></button>
                    <button onclick="document.querySelector('.featured-slider').scrollBy({left: 250, behavior: 'smooth'})" class="nav-btn" style="width: 2.2rem; height: 2.2rem; border: 1px solid var(--border-color);"><i data-lucide="chevron-right" style="width: 1rem;"></i></button>
                </div>
            </div>
            
            <div class="featured-slider" id="autoSlider">
                @foreach($featuredProducts as $product)
                <div class="featured-item">
                    <div class="p-card">
                        <div class="p-img-box">
                            <img src="{{ $product->image_url ?? 'https://placehold.co/300' }}" alt="{{ $product->display_name }}" loading="lazy">
                            <span class="p-badge">{{ $product->category->display_name ?? '' }}</span>
                        </div>
                        <div style="padding: 1.2rem; flex: 1; display: flex; flex-direction: column;">
                            <div class="rating-mini">
                                @php $rating = round($product->average_rating); @endphp
                                @for($i=1; $i<=5; $i++)
                                    <i data-lucide="{{ $i <= $rating ? 'egg' : 'egg-off' }}"></i>
                                @endfor
                            </div>
                            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 850; color: var(--text-dark);">{{ $product->display_name }}</h3>
                            
                            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 1rem;">
                                <div style="display: flex; align-items: baseline; gap: 0.15rem;">
                                    <span style="font-size: 1.2rem; font-weight: 950; color: var(--primary);">{{ number_format($product->price) }}</span>
                                    <small style="font-size: 0.65rem; font-weight: 800; color: var(--primary);">{{ __('EGP') }}</small>
                                </div>
                                <button class="add-btn-bouncy">
                                    <i data-lucide="shopping-basket" style="width: 1.3rem;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <!-- All Products Grid -->
        <div class="animate-fade-in" style="margin-bottom: 4rem;">
            <h2 class="section-title" style="margin-bottom: 1.8rem;">{{ __('All Products') }}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr)); gap: 1rem;">
                @foreach($products as $product)
                <div class="p-card">
                    <div class="p-img-box" style="height: 10rem;">
                        <img src="{{ $product->image_url ?? 'https://placehold.co/300' }}" alt="{{ $product->display_name }}" loading="lazy">
                    </div>
                    <div style="padding: 1rem; flex: 1; display: flex; flex-direction: column;">
                        <div class="rating-mini">
                             @php $rating = round($product->average_rating); @endphp
                             @for($i=1; $i<=5; $i++) 
                                <i data-lucide="{{ $i <= $rating ? 'egg' : 'egg-off' }}"></i> 
                             @endfor
                        </div>
                        <h3 style="margin: 0; font-size: 1rem; font-weight: 850; color: var(--text-dark);">{{ $product->display_name }}</h3>
                        <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 0.8rem;">
                            <span style="font-size: 1.15rem; font-weight: 950; color: var(--primary);">{{ number_format($product->price) }} <small style="font-size: 0.6rem;">{{ __('EGP') }}</small></span>
                            <button class="add-btn-bouncy">
                                <i data-lucide="shopping-basket" style="width: 1.1rem;"></i>
                            </button>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <!-- Testimonials Section -->
        @if($testimonials->count() > 0)
        <div class="animate-fade-in" style="margin-bottom: 5rem; padding: 4rem 1.5rem; background: var(--white); border-radius: 2rem; border: 1px solid var(--border-color);">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 class="section-title">{{ __('What Customers Say') }}</h2>
                <p style="color: var(--text-muted); font-weight: 700;">{{ __('Customer Stories') }}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 2rem;">
                @foreach($testimonials as $review)
                <div class="testimonial-card">
                    <div class="rating-mini" style="justify-content: center; margin-bottom: 1rem;">
                        @for($i=1; $i<=$review->rating; $i++) <i data-lucide="egg"></i> @endfor
                    </div>
                    <p class="testimonial-quote">"{{ $review->comment }}"</p>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.8rem;">
                        <div style="width: 2.5rem; height: 2.5rem; background: var(--primary-light); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900;">
                            {{ substr($review->display_name, 0, 1) }}
                        </div>
                        <span class="testimonial-author">{{ $review->display_name }}</span>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif
    </div>

    <script>
        // Auto-moving Featured Slider
        const slider = document.getElementById('autoSlider');
        if (slider) {
            setInterval(() => {
                if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
                    slider.scrollTo({left: 0, behavior: 'smooth'});
                } else {
                    slider.scrollBy({left: 280, behavior: 'smooth'});
                }
            }, 5000);
        }
    </script>
@endsection
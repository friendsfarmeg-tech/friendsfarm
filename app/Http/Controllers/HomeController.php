<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Offer;

class HomeController extends Controller
{
    public function index()
    {
        // Cache data for 5 minutes to speed up loading
        $categories = Cache::remember('home_categories', 300, function () {
            return Category::all();
        });
        
        $products = Cache::remember('home_products', 300, function () {
            return Product::where('is_available', true)->latest()->take(12)->get();
        });
        
        $featuredProducts = Cache::remember('home_featured', 300, function () {
            return Product::where('is_featured', true)->where('is_available', true)->take(8)->get();
        });
        
        $testimonials = Cache::remember('home_testimonials', 300, function () {
            return \App\Models\Review::where('is_approved', true)->latest()->take(5)->get();
        });
        
        $offers = Cache::remember('home_offers', 300, function () {
            return Offer::where('is_active', true)->latest()->take(3)->get();
        });

        // Fallback for featured products if none marked as featured
        if ($featuredProducts->isEmpty()) {
            $featuredProducts = $products->take(5);
        }

        return view('home', compact('categories', 'products', 'featuredProducts', 'testimonials', 'offers'));
    }
}

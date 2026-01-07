<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('categories_all', 3600, function () {
            return Category::all();
        });

        // Fetch products with their category and average rating
        $products = Product::with('category')->latest()->take(12)->get();
        
        // Featured products: Products with the most reviews/ratings appear in "Chosen for You"
        $featuredProducts = Product::with('category')
            ->withCount('reviews')
            ->orderBy('reviews_count', 'desc')
            ->take(8)
            ->get();

        // Testimonials (Approved reviews)
        $testimonials = \App\Models\Review::where('is_visible', true)->latest()->take(5)->get();

        // Active Offers
        $offers = \App\Models\Offer::where('is_active', true)->latest()->take(4)->get();

        return view('home', compact('categories', 'products', 'featuredProducts', 'testimonials', 'offers'));
    }
}

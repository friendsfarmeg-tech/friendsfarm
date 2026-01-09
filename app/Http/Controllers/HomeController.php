<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

use App\Models\Offer;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $products = Product::where('is_available', true)->latest()->take(12)->get();
        $featuredProducts = Product::where('is_featured', true)->where('is_available', true)->take(8)->get();
        $testimonials = \App\Models\Review::where('is_approved', true)->latest()->take(5)->get();
        $offers = Offer::where('is_active', true)->latest()->take(3)->get();

        // Fallback for featured products if none marked as featured
        if ($featuredProducts->isEmpty()) {
            $featuredProducts = $products->take(5);
        }

        return view('home', compact('categories', 'products', 'featuredProducts', 'testimonials', 'offers'));
    }
}

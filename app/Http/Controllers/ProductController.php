<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_available', true);

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $products = $query->latest()->paginate(12);
        $categories = Category::all();

        return view('products.index', compact('products', 'categories'));
    }

    public function show(Product $product)
    {
        $product->load(['reviews', 'category']);
        return view('products.show', compact('product'));
    }
}

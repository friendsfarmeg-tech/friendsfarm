<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:500',
            'customer_name' => 'nullable|string|max:255',
            'customer_email' => 'nullable|email|max:255',
        ]);

        // Check if user already reviewed this product
        if (Auth::check()) {
            $existingReview = Review::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->first();

            if ($existingReview) {
                return redirect()->back()->with('error', 'لقد قمت بتقييم هذا المنتج من قبل');
            }
        }

        Review::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'customer_name' => $request->customer_name ?? Auth::user()->name ?? 'مجهول',
            'customer_email' => $request->customer_email ?? Auth::user()->email ?? null,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => Auth::check() ? true : false, // Auto-approve authenticated users
            'is_admin_added' => false,
        ]);

        return redirect()->back()->with('success', 'تم إضافة التقييم بنجاح');
    }

    public function destroy(Review $review)
    {
        if (Auth::check() && $review->user_id === Auth::id()) {
            $review->delete();
            return redirect()->back()->with('success', 'تم حذف التقييم');
        }

        abort(403);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $wishlistItems = Wishlist::where('user_id', Auth::id())
            ->with('product.category')
            ->latest()
            ->paginate(12);

        return view('wishlist.index', compact('wishlistItems'));
    }

    public function store(Product $product)
    {
        $wishlist = Wishlist::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        if ($wishlist->wasRecentlyCreated) {
            return response()->json([
                'success' => true,
                'message' => 'تمت الإضافة إلى المفضلة',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'المنتج موجود بالفعل في المفضلة',
        ]);
    }

    public function destroy(Product $product)
    {
        Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم الحذف من المفضلة',
        ]);
    }

    public function toggle(Product $product)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json([
                'success' => true,
                'is_favorited' => false,
                'message' => 'تم الحذف من المفضلة',
            ]);
        } else {
            Wishlist::create([
                'user_id' => Auth::id(),
                'product_id' => $product->id,
            ]);
            return response()->json([
                'success' => true,
                'is_favorited' => true,
                'message' => 'تمت الإضافة إلى المفضلة',
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function index()
    {
        $cart = Session::get('cart', []);
        $items = [];
        $total = 0;

        foreach ($cart as $productId => $quantity) {
            $product = Product::find($productId);
            if ($product && $product->is_available) {
                $items[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'subtotal' => $product->price * $quantity,
                ];
                $total += $product->price * $quantity;
            }
        }

        return view('cart.index', compact('items', 'total'));
    }

    public function add(Request $request, Product $product)
    {
        $quantity = $request->input('quantity', 1);
        $cart = Session::get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id] += $quantity;
        } else {
            $cart[$product->id] = $quantity;
        }

        Session::put('cart', $cart);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'تمت الإضافة بنجاح',
                'cart_count' => array_sum($cart),
            ]);
        }

        return redirect()->back()->with('success', 'تمت إضافة المنتج إلى السلة');
    }

    public function update(Request $request, Product $product)
    {
        $quantity = $request->input('quantity', 1);
        $cart = Session::get('cart', []);

        if ($quantity <= 0) {
            unset($cart[$product->id]);
        } else {
            $cart[$product->id] = $quantity;
        }

        Session::put('cart', $cart);

        if ($request->ajax()) {
            $total = 0;
            foreach ($cart as $productId => $qty) {
                $p = Product::find($productId);
                if ($p) {
                    $total += $p->price * $qty;
                }
            }
            return response()->json([
                'success' => true,
                'cart_count' => array_sum($cart),
                'total' => number_format($total, 2),
            ]);
        }

        return redirect()->back()->with('success', 'تم تحديث الكمية');
    }

    public function remove(Product $product)
    {
        $cart = Session::get('cart', []);
        unset($cart[$product->id]);
        Session::put('cart', $cart);

        return redirect()->back()->with('success', 'تم حذف المنتج من السلة');
    }

    public function clear()
    {
        Session::forget('cart');
        return redirect()->route('cart.index')->with('success', 'تم تفريغ السلة');
    }

    public function count()
    {
        $cart = Session::get('cart', []);
        return response()->json(['count' => array_sum($cart)]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('items.product')
            ->latest()
            ->paginate(10);

        return view('orders.index', compact('orders'));
    }

    public function checkout()
    {
        $cart = Session::get('cart', []);

        if (empty($cart)) {
            return redirect()->route('products.index')->with('error', 'السلة فارغة');
        }

        $total = 0;
        $items = [];

        foreach ($cart as $id => $quantity) {
            $product = Product::find($id);
            if ($product && $product->is_available) {
                $total += $product->price * $quantity;
                $items[] = [
                    'product' => $product,
                    'quantity' => $quantity
                ];
            }
        }

        if (empty($items)) {
            return redirect()->route('products.index')->with('error', 'المنتجات في السلة غير متوفرة حالياً');
        }

        return view('orders.checkout', compact('items', 'total'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:1000',
        ]);

        $cart = Session::get('cart', []);

        if (empty($cart)) {
            return redirect()->route('products.index')->with('error', 'السلة فارغة');
        }

        try {
            DB::beginTransaction();

            $total = 0;
            $orderItems = [];

            foreach ($cart as $id => $quantity) {
                $product = Product::find($id);
                if ($product && $product->is_available) {
                    $price = $product->price;
                    $total += $price * $quantity;
                    
                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $price,
                    ];
                }
            }

            if (empty($orderItems)) {
                throw new \Exception('No available products found in cart');
            }

            $order = Order::create([
                'user_id' => Auth::id(),
                'total' => $total,
                'status' => 'pending', 
                'address' => $request->address,
                'notes' => $request->notes,
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            Session::forget('cart');

            return redirect()->route('orders.show', $order)->with('success', 'تم طلبك بنجاح!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'حدث خطأ أثناء تنفيذ الطلب: ' . $e->getMessage());
        }
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('items.product');

        return view('orders.show', compact('order'));
    }
}

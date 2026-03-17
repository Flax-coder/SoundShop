<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->where('status', 'approved')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($products);
    }

    public function adminIndex()
    {
        $products = Product::with(['category', 'user'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($products);
    }

    public function show(Request $request, Product $product)
    {
        $product->load('category', 'user');

        $isOwner = $request->user() && $request->user()->id === $product->user_id;
        $isAdmin = $request->user() && (int) $request->user()->is_admin === 1;

        if ($product->status !== 'approved' && !$isOwner && !$isAdmin) {
            return response()->json([
                'message' => 'Product not available.'
            ], 403);
        }

        return response()->json($product);
    }

    public function myProducts(Request $request)
    {
        $products = Product::with('category')
            ->where('user_id', $request->user()->id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        $imagePath = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'title' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'image' => $imagePath,
            'category_id' => $validated['category_id'],
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

            return response()->json([
            'message' => 'Product submitted for approval.',
            'product' => $product->load('category', 'user'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        $imagePath = $product->image;

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            ]);

            $imagePath = $request->file('image')->store('products', 'public');
        } elseif ($request->filled('image') && is_string($request->image)) {
            $imagePath = $request->image;
        }

        $product->update([
            'title' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'image' => $imagePath,
            'category_id' => $validated['category_id'],
        ]);

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->load('category'),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function approve(Product $product)
    {
        $product->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Product approved successfully.',
            'product' => $product->load('category', 'user'),
        ]);
    }

    public function reject(Product $product)
    {
        $product->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Product rejected successfully.',
            'product' => $product->load('category', 'user'),
        ]);
    }
}

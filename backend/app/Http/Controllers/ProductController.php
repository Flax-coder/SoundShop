<?php

namespace App\Http\Controllers;

use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('category')->latest()->get());
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }
}

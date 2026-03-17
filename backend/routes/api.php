<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserOrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user/profile', [UserOrderController::class, 'profile']);
    Route::get('/user/orders', [UserOrderController::class, 'orders']);
    Route::get('/user/orders/{id}', [UserOrderController::class, 'show']);
    Route::get('/my-products', [ProductController::class, 'myProducts']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::patch('/admin/users/{user}/toggle-admin', [UserController::class, 'toggleAdmin']);
        Route::delete('/admin/users/{user}', [UserController::class, 'destroy']);
        Route::get('/admin/products', [ProductController::class, 'adminIndex']);
        Route::patch('/admin/products/{product}/approve', [ProductController::class, 'approve']);
        Route::patch('/admin/products/{product}/reject', [ProductController::class, 'reject']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    });
});
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'is_admin', 'created_at')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($users);
    }

    public function toggleAdmin(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot change your own admin role.'
            ], 403);
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully.',
            'user' => $user
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {

        $users = User::with('roles')->latest()->paginate();
        $roles =  Role::get();

        return inertia('user/index', [
            'users' => UserResource::collection($users),
            'roles' => $roles,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        if($user) {
            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success', 'User created with roles.');
        }

        return redirect()->back()->with('error', 'User creation failed.');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if($user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email
            ]);

            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success', 'User updated with roles.');
        }

        return redirect()->back()->with('error', 'User update failed.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if($user) {
            $user->delete();

            return redirect()->route('users.index')->with('success', 'User deletion completed.');
        }

        return redirect()->back()->with('error', 'User deletion failed.');
    }
}

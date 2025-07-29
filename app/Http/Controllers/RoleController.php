<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->latest()->paginate();

        $permissions = Permission::get()->groupBy('module');

        return inertia('role/index', [
            'roles' => RoleResource::collection($roles),
            'permissions' => $permissions,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create([
            'label' => $request->label,
            'name' => Str::slug($request->label),
            'description' => $request->description,
        ]);

        if($role) {
            $role->syncPermissions($request->permissions);
            return redirect()->route('roles.index')->with('success', 'Role created successfully with permissions.');
        }

        return redirect()->back()->with('error', 'Role creation failed. Please try again');


    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        if($role) {
            $role->label = $request->label;
            $role->name = Str::slug($request->label);
            $role->description = $request->description;

            $role->save();
            $role->syncPermissions($request->permissions);

            return redirect()->route('roles.index')->with('success', 'Role updated successfully with permissions.');
        }

        return redirect()->back()->with('error', 'Role update failed. Please try again');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if($role) {
            $role->delete();

            return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
        }

        return redirect()->back()->with('error', 'Role deletion failed.');
    }
}

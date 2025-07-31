<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//verifyed user
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// only-supper-admin
Route::group(['middleware' => ['auth', 'verified', /*'role:super-admin'*/]], function() {
    Route::resource('admin/permissions', PermissionController::class)->only('index', 'store', 'update', 'destroy');
    Route::resource('admin/roles', RoleController::class)->only('index', 'store', 'update', 'destroy');
    Route::resource('admin/users', UserController::class)->only('index', 'store', 'update', 'destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

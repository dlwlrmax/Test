<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::post('register', [RegisterController::class, 'register']);
Route::post('login', [RegisterController::class, 'login']);

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', [RegisterController::class, 'logout']);
    Route::group(['prefix' => 'user', 'as' => 'user.'], function () {
        Route::get('/', [UserController::class, 'user']);
        Route::post('update', [UserController::class, 'update']);
        Route::post('delete', [UserController::class, 'delete']);
    });

    Route::group(['prefix' => 'tasks', 'as' => 'tasks.'], function () {
        Route::get('/', [TaskController::class, 'index']);
        Route::post('/create',[TaskController::class, 'create']);
        Route::get('{id}', [TaskController::class, 'detail']);
        Route::post('{id}/edit',[TaskController::class, 'edit']);
        Route::post('{id}/delete',[TaskController::class, 'delete']);
    });

    Route::group(['prefix' => 'categories', 'as' => 'categories.'], function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/create', [CategoryController::class, 'create']);
        Route::post('{id}/delete',[CategoryController::class, 'delete']);
    });
});

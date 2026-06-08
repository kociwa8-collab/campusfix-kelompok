<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return 'LARAVEL HIDUP';
});

Route::get('/test', function () {
    return 'TEST BERHASIL';
});

Route::get('/reports', [ReportController::class, 'index']);
Route::post('/reports', [ReportController::class, 'store']);
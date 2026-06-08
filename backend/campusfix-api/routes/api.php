<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatbotController;

Route::get('/reports', [ReportController::class, 'index']);
Route::post('/reports', [ReportController::class, 'store']);
Route::put('/reports/{id}', [ReportController::class, 'update']);
Route::post('/reports/{id}/like', [ReportController::class, 'toggleLike']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/myreports/{id}', [ReportController::class, 'myReports']);

// Chatbot Routes
Route::post('/chat/send', [ChatbotController::class, 'sendMessage']);
Route::get('/chat/history', [ChatbotController::class, 'getChatHistory']);
Route::post('/chat/{chatId}/rate', [ChatbotController::class, 'rateResponse']);
Route::get('/chat/faqs', [ChatbotController::class, 'getFaqList']);

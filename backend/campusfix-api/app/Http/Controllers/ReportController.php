<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json(
            Report::with('user:id,name,email')
                ->latest()
                ->get()
        );
    }

    public function myReports($userId)
    {
       return response()->json(
        Report::with('user:id,name,email')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
    );
    }

   public function store(Request $request)
   {
    $request->validate([
        'user_id' => 'required|integer|exists:users,id',
        'location' => 'required|string|max:255',
        'category' => 'required|string|max:255',
        'description' => 'required|string',
        'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
    ]);

    $photoName = null;

     if ($request->hasFile('photo')) {

    $photoName = time() . '_' . uniqid() . '.' .
        $request->photo->extension();

    $request->photo->move(
        public_path('uploads'),
        $photoName
    );
    }

    $report = Report::create([
    'user_id' => (int)$request->user_id,
    'location' => trim($request->location),
    'category' => trim($request->category),
    'description' => trim($request->description),
    'status' => 'Menunggu Verifikasi',
    'photo' => $photoName,
    'likes_count' => 0,
    'liked_by' => []
    ]);

    return response()->json([
        'message' => 'Laporan berhasil dikirim',
        'data' => $report
    ]);
    }

   public function update(
    Request $request,
    $id
   ) 
   {
    $request->validate([
        'status' =>
        'required|in:Menunggu Verifikasi,Diproses,Selesai'
    ]);

    $report = Report::find($id);

    if (!$report) {

        return response()->json([
            'message' => 'Laporan tidak ditemukan'
        ], 404);
    }

    $report->status =
        $request->status;

    $report->save();

    return response()->json([
        'message' =>
            'Status berhasil diupdate'
    ]);
   }

   public function toggleLike(Request $request, $id)
   {
    $request->validate([
        'user_id' => 'required|integer|exists:users,id',
    ]);

    $report = Report::find($id);

    if (!$report) {
        return response()->json([
            'message' => 'Laporan tidak ditemukan'
        ], 404);
    }

    $userId = (int) $request->user_id;
    $likedBy = $report->liked_by ?? [];

    if (!is_array($likedBy)) {
        $likedBy = [];
    }

    $alreadyLiked = in_array($userId, $likedBy, true);

    if ($alreadyLiked) {
        $likedBy = array_values(array_filter(
            $likedBy,
            fn ($likedUserId) => (int) $likedUserId !== $userId
        ));
    } else {
        $likedBy[] = $userId;
    }

    $report->liked_by = $likedBy;
    $report->likes_count = count($likedBy);
    $report->save();

    return response()->json([
        'message' => $alreadyLiked ? 'Like laporan dibatalkan' : 'Laporan disukai',
        'data' => $report->fresh('user:id,name,email')
    ]);
   }
}

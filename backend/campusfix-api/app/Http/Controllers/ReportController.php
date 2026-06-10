<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $reports =
            Report::with('user:id,name,email')
                ->latest()
                ->get();

        return response()->json(
            $this->withPhotoUrls($reports, $request)
        );
    }

    public function myReports(Request $request, $userId)
    {
       $reports =
        Report::with('user:id,name,email')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

       return response()->json(
        $this->withPhotoUrls($reports, $request)
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
    $photoData = null;

     if ($request->hasFile('photo')) {
    $uploadedPhoto = $request->file('photo');
    $uploadPath = public_path('uploads');

    if (!is_dir($uploadPath)) {
        mkdir($uploadPath, 0775, true);
    }

    $photoName = time() . '_' . uniqid() . '.' .
        $uploadedPhoto->extension();

    $photoData = 'data:' .
        $uploadedPhoto->getMimeType() .
        ';base64,' .
        base64_encode(file_get_contents($uploadedPhoto->getRealPath()));

    $uploadedPhoto->move(
        $uploadPath,
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
    'photo_data' => $photoData,
    'likes_count' => 0,
    'liked_by' => []
    ]);

    return response()->json([
        'message' => 'Laporan berhasil dikirim',
        'data' => $this->withPhotoUrl($report, $request)
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
        'data' => $this->withPhotoUrl(
            $report->fresh('user:id,name,email'),
            $request
        )
    ]);
   }

   private function withPhotoUrls($reports, Request $request)
   {
    return $reports->map(
        fn (Report $report) => $this->withPhotoUrl($report, $request)
    );
   }

   private function withPhotoUrl(Report $report, Request $request): Report
   {
    if ($report->photo_data) {
        $report->photo_url = $report->photo_data;

        return $report;
    }

    $report->photo_url = $report->photo
        ? $this->uploadedPhotoUrl($request, $report->photo)
        : null;

    return $report;
   }

   private function uploadedPhotoUrl(Request $request, string $photo): string
   {
    $scheme = explode(
        ',',
        $request->headers->get('x-forwarded-proto', $request->getScheme())
    )[0];

    $host = explode(
        ',',
        $request->headers->get('x-forwarded-host', $request->getHttpHost())
    )[0];

    return trim($scheme) .
        '://' .
        trim($host) .
        '/uploads/' .
        rawurlencode(basename($photo));
   }
}

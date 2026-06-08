<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'location',
        'category',
        'description',
        'photo',
        'status',
        'likes_count',
        'liked_by'
    ];

    protected $casts = [
        'liked_by' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'likes_count')) {
                $table->unsignedInteger('likes_count')->default(0);
            }

            if (!Schema::hasColumn('reports', 'liked_by')) {
                $table->json('liked_by')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (Schema::hasColumn('reports', 'likes_count')) {
                $table->dropColumn('likes_count');
            }

            if (Schema::hasColumn('reports', 'liked_by')) {
                $table->dropColumn('liked_by');
            }
        });
    }
};

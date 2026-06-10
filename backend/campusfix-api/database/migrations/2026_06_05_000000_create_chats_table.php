<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('chats')) {
            return;
        }

        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable();
            $table->text('user_message');
            $table->text('bot_response');
            $table->string('category')->default('general'); // general, report, account
            $table->integer('helpfulness')->nullable(); // 1 = helpful, 0 = not helpful
            $table->timestamps();
            
            $table->index('session_id');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};

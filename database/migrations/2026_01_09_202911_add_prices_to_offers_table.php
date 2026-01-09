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
        Schema::table('offers', function (Blueprint $table) {
            // Only add if they don't exist yet (to be safe)
            if (!Schema::hasColumn('offers', 'title')) {
                $table->string('title')->after('id');
            }
            if (!Schema::hasColumn('offers', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            if (!Schema::hasColumn('offers', 'image')) {
                $table->string('image')->nullable()->after('description');
            }
            if (!Schema::hasColumn('offers', 'offer_price')) {
                $table->decimal('offer_price', 10, 2)->nullable()->after('image');
            }
            if (!Schema::hasColumn('offers', 'original_price')) {
                $table->decimal('original_price', 10, 2)->nullable()->after('offer_price');
            }
            if (!Schema::hasColumn('offers', 'discount_percentage')) {
                $table->integer('discount_percentage')->nullable()->after('original_price');
            }
            if (!Schema::hasColumn('offers', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('discount_percentage');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn(['title', 'description', 'image', 'offer_price', 'original_price', 'discount_percentage', 'is_active']);
        });
    }
};

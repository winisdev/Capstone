<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            if (!Schema::hasColumn('exams', 'schedule_start_at')) {
                $table->timestamp('schedule_start_at')->nullable()->after('scheduled_at');
            }

            if (!Schema::hasColumn('exams', 'schedule_end_at')) {
                $table->timestamp('schedule_end_at')->nullable()->after('schedule_start_at');
            }
        });

        // Backfill existing scheduled_at values to the new start schedule column.
        DB::table('exams')
            ->whereNotNull('scheduled_at')
            ->whereNull('schedule_start_at')
            ->update([
                'schedule_start_at' => DB::raw('scheduled_at'),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            if (Schema::hasColumn('exams', 'schedule_end_at')) {
                $table->dropColumn('schedule_end_at');
            }

            if (Schema::hasColumn('exams', 'schedule_start_at')) {
                $table->dropColumn('schedule_start_at');
            }
        });
    }
};


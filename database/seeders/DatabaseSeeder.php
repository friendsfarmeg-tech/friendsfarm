<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'friendsfarm.eg@gmail.com'],
            [
                'name' => 'Friends Farm Admin',
                'password' => Hash::make('Friendsfarm@2025'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // Normal User
        User::updateOrCreate(
            ['email' => 'user@friendsfarm.com'],
            [
                'name' => 'Normal User',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'email_verified_at' => now(),
            ]
        );

        // Categories
        $poultry = Category::firstOrCreate(
            ['name' => 'live_poultry'],
            [
                'name_ar' => 'طيور حية',
                'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1678901234/poultry_category.jpg' // Placeholder
            ]
        );
        
        $dressed = Category::firstOrCreate(
            ['name' => 'dressed_poultry'],
            [
                'name_ar' => 'طيور مذبوحة',
                'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1678901234/dressed_category.jpg' // Placeholder
            ]
        );

        $parts = Category::firstOrCreate(
            ['name' => 'poultry_parts'],
            [
                'name_ar' => 'مقطعات',
                'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1678901234/parts_category.jpg' // Placeholder
            ]
        );

        // Products
        Product::firstOrCreate(
            ['name' => 'Whole Chicken'],
            [
                'category_id' => $poultry->id,
                'name_ar' => 'فراخ كاملة', 
                'description' => 'Fresh whole chicken, grain-fed.',
                'description_ar' => 'فراخ كاملة طازجة، تربية بيتي.',
                'price' => 120.00,
                'image_url' => 'https://placehold.co/400',
                'is_featured' => true,
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Baladi Chicken'],
            [
                'category_id' => $poultry->id,
                'name_ar' => 'فراخ بلدي',
                'description' => 'Traditional Baladi chicken, rich taste.',
                'description_ar' => 'فراخ بلدي طعم زمان.',
                'price' => 145.00,
                'image_url' => 'https://placehold.co/400',
                'is_featured' => true,
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Duck'],
            [
                'category_id' => $dressed->id,
                'name_ar' => 'بط',
                'description' => 'Premium quality duck.',
                'description_ar' => 'بط بلدي عالي الجودة.',
                'price' => 180.00,
                'image_url' => 'https://placehold.co/400',
                'is_featured' => true,
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Chicken Panne'],
            [
                'category_id' => $parts->id,
                'name_ar' => 'بانيه',
                'description' => 'Freshly sliced chicken breast.',
                'description_ar' => 'صدور فراخ بانيه طازجة.',
                'price' => 220.00,
                'image_url' => 'https://placehold.co/400',
                'is_featured' => false,
            ]
        );
    }
}

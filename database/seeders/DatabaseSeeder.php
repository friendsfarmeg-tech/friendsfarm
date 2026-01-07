<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Add Admin User
        User::updateOrCreate(
            ['email' => 'friendsfarm.eg@gmail.com'],
            [
                'name' => 'Friends Farm Admin',
                'password' => bcrypt('password'),
                'is_admin' => true,
            ]
        );

        // Default Categories
        $categories = [
            ['name' => 'Chickens', 'name_ar' => 'دجاج', 'image_url' => 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80'],
            ['name' => 'Ducks', 'name_ar' => 'بط', 'image_url' => 'https://images.unsplash.com/photo-1555852095-64e7428df0fa?auto=format&fit=crop&q=80'],
            ['name' => 'Pigeons', 'name_ar' => 'حمام', 'image_url' => 'https://images.unsplash.com/photo-1560037146-24e528ac286c?auto=format&fit=crop&q=80'],
            ['name' => 'Quails', 'name_ar' => 'سمان', 'image_url' => 'https://images.unsplash.com/photo-1599351050730-802c6107bd62?auto=format&fit=crop&q=80'],
        ];

        foreach ($categories as $cat) {
            $category = \App\Models\Category::updateOrCreate(['name' => $cat['name']], $cat);

            if ($cat['name'] === 'Chickens') {
                \App\Models\Product::updateOrCreate(
                    ['name_ar' => 'فراخ بيضاء', 'category_id' => $category->id],
                    [
                        'name' => 'White Chicken',
                        'description_ar' => 'فراخ بيضاء طازجة تربية مزارع',
                        'price' => 85.00,
                        'unit' => 'kg',
                        'stock' => 100,
                        'is_available' => true,
                    ]
                );
                \App\Models\Product::updateOrCreate(
                    ['name_ar' => 'فراخ بلدي', 'category_id' => $category->id],
                    [
                        'name' => 'Baladi Chicken',
                        'description_ar' => 'فراخ بلدي طازجة تربية بيتي',
                        'price' => 105.00,
                        'unit' => 'kg',
                        'stock' => 50,
                        'is_available' => true,
                    ]
                );
            }
        }

        // Default Settings
        $settings = [
            ['key' => 'phone', 'label' => 'رقم الهاتف', 'value' => '+20 15 15419092', 'group' => 'contact'],
            ['key' => 'whatsapp', 'label' => 'رقم الواتساب', 'value' => '201515419092', 'group' => 'contact'],
            ['key' => 'facebook', 'label' => 'رابط الفيسبوك', 'value' => 'https://www.facebook.com/share/1B1UKic94i/', 'group' => 'social'],
            ['key' => 'instagram', 'label' => 'رابط الانستجرام', 'value' => '#', 'group' => 'social'],
            ['key' => 'tiktok', 'label' => 'رابط التيك توك', 'value' => '#', 'group' => 'social'],
            ['key' => 'hero_image', 'label' => 'صورة الهيرو الرئيسية', 'value' => '/hero-bg.png', 'group' => 'design'],
            ['key' => 'hero_title', 'label' => 'عنوان الهيرو', 'value' => 'مرحباً بك في فريندز فارم', 'group' => 'design'],
            ['key' => 'hero_subtitle', 'label' => 'عنوان الهيرو الفرعي', 'value' => 'أجود أنواع الفراخ والطيور الطازجة - توصيل سريع لباب بيتك', 'group' => 'design'],
        ];

        foreach ($settings as $s) {
            \App\Models\Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}

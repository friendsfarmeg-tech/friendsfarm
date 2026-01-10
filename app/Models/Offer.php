<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'image', 'offer_price', 'original_price', 'discount_percentage', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getDisplayTitleAttribute()
    {
        return $this->title;
    }

    public function getDisplayDescriptionAttribute()
    {
        return $this->description;
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        
        // If it's already a full URL (from Cloudinary or elsewhere)
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        return \Illuminate\Support\Facades\Storage::disk(config('filesystems.default'))->url($this->image);
    }
}

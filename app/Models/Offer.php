<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_ar',
        'description',
        'description_ar',
        'image_url',
        'original_price',
        'offer_price',
        'is_active',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'offer_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function getDisplayTitleAttribute()
    {
        return app()->getLocale() === 'ar' ? ($this->title_ar ?: $this->title) : $this->title;
    }

    public function getDisplayDescriptionAttribute()
    {
        return app()->getLocale() === 'ar' ? ($this->description_ar ?: $this->description) : $this->description;
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->original_price && $this->original_price > 0) {
            return round((($this->original_price - $this->offer_price) / $this->original_price) * 100);
        }
        return 0;
    }
}

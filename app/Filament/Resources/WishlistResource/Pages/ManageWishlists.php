<?php

namespace App\Filament\Resources\WishlistResource\Pages;

use App\Filament\Resources\WishlistResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageWishlists extends ManageRecords
{
    protected static string $resource = WishlistResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}

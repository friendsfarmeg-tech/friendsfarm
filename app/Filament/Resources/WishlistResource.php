<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WishlistResource\Pages;
use App\Models\Wishlist;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WishlistResource extends Resource
{
    protected static ?string $model = Wishlist::class;

    protected static ?string $navigationIcon = 'heroicon-o-heart';

    protected static ?string $navigationLabel = 'قوائم الأمنيات';

    protected static ?string $modelLabel = 'مفضلة';

    protected static ?string $pluralModelLabel = 'قوائم الأمنيات';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->label('المستخدم')
                    ->searchable(),
                Forms\Components\Select::make('product_id')
                    ->relationship('product', 'name_ar')
                    ->required()
                    ->label('المنتج')
                    ->searchable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('المستخدم')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('product.name_ar')
                    ->label('المنتج')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('product.image_url')
                    ->label('الصورة')
                    ->circular(),
                Tables\Columns\TextColumn::make('product.price')
                    ->money('EGP')
                    ->label('السعر'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('تاريخ الإضافة')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageWishlists::route('/'),
        ];
    }
}

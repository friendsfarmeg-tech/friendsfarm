<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name_ar')
                    ->required()
                    ->label('القسم'),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->label('الاسم (English)'),
                Forms\Components\TextInput::make('name_ar')
                    ->required()
                    ->label('الاسم (عربي)'),
                Forms\Components\Textarea::make('description')
                    ->label('الوصف (English)'),
                Forms\Components\Textarea::make('description_ar')
                    ->label('الوصف (عربي)'),
                Forms\Components\TextInput::make('price')
                    ->numeric()
                    ->prefix('ج.م')
                    ->required()
                    ->label('السعر'),
                Forms\Components\Select::make('unit')
                    ->options([
                        'kg' => 'كيلو (kg)',
                        'piece' => 'قطعة (piece)',
                        'pair' => 'جوز (pair)',
                    ])
                    ->default('kg')
                    ->required()
                    ->label('الوحدة'),
                Forms\Components\FileUpload::make('image_url')
                    ->image()
                    ->disk('cloudinary')
                    ->label('صورة المنتج'),
                Forms\Components\TextInput::make('stock')
                    ->numeric()
                    ->default(0)
                    ->label('المخزون'),
                Forms\Components\Toggle::make('is_available')
                    ->default(true)
                    ->label('متاح للبيع'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->label('الصورة'),
                Tables\Columns\TextColumn::make('name_ar')
                    ->label('الاسم')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category.name_ar')
                    ->label('القسم')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('EGP')
                    ->label('السعر')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stock')
                    ->label('المخزون')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_available')
                    ->boolean()
                    ->label('متاح'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('تاريخ الإضافة')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}

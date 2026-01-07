<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OfferResource\Pages;
use App\Models\Offer;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OfferResource extends Resource
{
    protected static ?string $model = Offer::class;

    protected static ?string $navigationIcon = 'heroicon-o-gift';

    protected static ?string $navigationLabel = 'العروض';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Offer Details')
                    ->schema([
                        Forms\Components\Grid::make(['default' => 1, 'lg' => 2])
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->label('العنوان (EN)'),
                                Forms\Components\TextInput::make('title_ar')
                                    ->label('العنوان (AR)'),
                            ]),
                        Forms\Components\Grid::make(['default' => 1, 'lg' => 2])
                            ->schema([
                                Forms\Components\Textarea::make('description')
                                    ->label('الوصف (EN)'),
                                Forms\Components\Textarea::make('description_ar')
                                    ->label('الوصف (AR)'),
                            ]),
                        Forms\Components\FileUpload::make('image_url')
                            ->image()
                            ->directory('offers')
                            ->label('صورة العرض'),
                        Forms\Components\Grid::make(['default' => 1, 'lg' => 3])
                            ->schema([
                                Forms\Components\TextInput::make('original_price')
                                    ->numeric()
                                    ->prefix('EGP')
                                    ->label('السعر الأصلي'),
                                Forms\Components\TextInput::make('offer_price')
                                    ->numeric()
                                    ->required()
                                    ->prefix('EGP')
                                    ->label('سعر العرض'),
                                Forms\Components\Toggle::make('is_active')
                                    ->default(true)
                                    ->label('نشط'),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')
                    ->circular()
                    ->label('الصورة'),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->label('العنوان'),
                Tables\Columns\TextColumn::make('offer_price')
                    ->money('EGP')
                    ->label('سعر العرض'),
                Tables\Columns\TextColumn::make('original_price')
                    ->money('EGP')
                    ->label('السعر الأصلي')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('نشط'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('الحالة'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ManageOffers::route('/'),
        ];
    }
}

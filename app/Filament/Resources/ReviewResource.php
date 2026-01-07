<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Filament\Resources\ReviewResource\RelationManagers;
use App\Models\Review;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Review Details')
                    ->schema([
                        Forms\Components\Select::make('product_id')
                            ->relationship('product', 'name_ar')
                            ->required()
                            ->label('المنتج'),
                        Forms\Components\TextInput::make('user_name')
                            ->label('اسم العميل'),
                        Forms\Components\Select::make('rating')
                            ->options([
                                5 => '5 - ممتاز',
                                4 => '4 - جيد جداً',
                                3 => '3 - جيد',
                                2 => '2 - مقبول',
                                1 => '1 - سيء',
                            ])
                            ->required()
                            ->label('التقييم'),
                        Forms\Components\Textarea::make('comment')
                            ->label('التعليق'),
                        Forms\Components\Toggle::make('is_visible')
                            ->default(true)
                            ->label('ظهور'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name_ar')
                    ->label('المنتج')
                    ->sortable(),
                Tables\Columns\TextColumn::make('display_name')
                    ->label('العميل'),
                Tables\Columns\TextColumn::make('rating')
                    ->label('التقييم')
                    ->sortable(),
                Tables\Columns\TextColumn::make('comment')
                    ->label('التعليق')
                    ->limit(50),
                Tables\Columns\IconColumn::make('is_visible')
                    ->boolean()
                    ->label('ظهور'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('التاريخ')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_visible')
                    ->label('فلترة بالظهور'),
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
            'index' => Pages\ManageReviews::route('/'),
        ];
    }
}

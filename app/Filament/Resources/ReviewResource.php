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

    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?string $navigationLabel = 'التقييمات';

    protected static ?string $modelLabel = 'تقييم';

    protected static ?string $pluralModelLabel = 'التقييمات';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('product_id')
                    ->relationship('product', 'name_ar')
                    ->required()
                    ->label('المنتج')
                    ->searchable(),
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->label('المستخدم')
                    ->searchable(),
                Forms\Components\TextInput::make('customer_name')
                    ->required()
                    ->label('اسم العميل')
                    ->maxLength(255),
                Forms\Components\TextInput::make('customer_email')
                    ->email()
                    ->label('البريد الإلكتروني')
                    ->maxLength(255),
                Forms\Components\Select::make('rating')
                    ->options([
                        1 => '⭐',
                        2 => '⭐⭐',
                        3 => '⭐⭐⭐',
                        4 => '⭐⭐⭐⭐',
                        5 => '⭐⭐⭐⭐⭐',
                    ])
                    ->required()
                    ->label('التقييم'),
                Forms\Components\Textarea::make('comment')
                    ->required()
                    ->label('التعليق')
                    ->rows(4)
                    ->maxLength(500),
                Forms\Components\Toggle::make('is_approved')
                    ->default(true)
                    ->label('موافق عليه'),
                Forms\Components\Toggle::make('is_admin_added')
                    ->default(false)
                    ->label('مضاف من المدير'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name_ar')
                    ->label('المنتج')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('اسم العميل')
                    ->searchable(),
                Tables\Columns\TextColumn::make('rating')
                    ->label('التقييم')
                    ->badge()
                    ->formatStateUsing(fn (int $state): string => str_repeat('⭐', $state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('comment')
                    ->label('التعليق')
                    ->limit(50)
                    ->wrap(),
                Tables\Columns\IconColumn::make('is_approved')
                    ->boolean()
                    ->label('موافق عليه')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_admin_added')
                    ->boolean()
                    ->label('من المدير')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('التاريخ')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('is_approved')
                    ->label('الموافقة')
                    ->options([
                        true => 'موافق',
                        false => 'غير موافق',
                    ]),
                Tables\Filters\SelectFilter::make('is_admin_added')
                    ->label('المصدر')
                    ->options([
                        true => 'من المدير',
                        false => 'من العميل',
                    ]),
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

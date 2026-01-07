<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Order Details')
                    ->schema([
                        Forms\Components\Grid::make(['default' => 1, 'lg' => 2])
                            ->schema([
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'pending' => 'جديد',
                                        'confirmed' => 'مؤكد',
                                        'preparing' => 'جاري التجهيز',
                                        'delivered' => 'تم التوصيل',
                                        'cancelled' => 'ملغي',
                                    ])
                                    ->required()
                                    ->label('الحالة'),
                                Forms\Components\TextInput::make('total')
                                    ->numeric()
                                    ->required()
                                    ->disabled()
                                    ->label('الإجمالي'),
                            ]),
                    ]),
                    
                Forms\Components\Section::make('Customer & Shipping')
                    ->schema([
                        Forms\Components\Textarea::make('address')
                            ->required()
                            ->label('العنوان'),
                        Forms\Components\Textarea::make('notes')
                            ->label('ملاحظات'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('رقم الطلب')
                    ->searchable()
                    ->formatStateUsing(fn ($state) => '#' . substr($state, 0, 8))
                    ->copyable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('العميل')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('total')
                    ->money('EGP')
                    ->label('الإجمالي')
                    ->sortable(),
                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'pending' => 'جديد',
                        'confirmed' => 'مؤكد',
                        'preparing' => 'جاري التجهيز',
                        'delivered' => 'تم التوصيل',
                        'cancelled' => 'ملغي',
                    ])
                    ->label('الحالة')
                    ->sortable(),
                Tables\Columns\TextColumn::make('address')
                    ->label('العنوان')
                    ->wrap()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('تاريخ الطلب')
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'جديد',
                        'confirmed' => 'مؤكد',
                        'preparing' => 'جاري التجهيز',
                        'delivered' => 'تم التوصيل',
                        'cancelled' => 'ملغي',
                    ])
                    ->label('الحالة'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}

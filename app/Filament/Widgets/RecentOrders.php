<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

use App\Models\Order;

class RecentOrders extends BaseWidget
{
    protected static ?string $heading = 'آخر الطلبات';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('رقم الطلب')
                    ->formatStateUsing(fn ($state) => '#' . substr($state, 0, 8)),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('العميل'),
                Tables\Columns\TextColumn::make('total')
                    ->money('EGP')
                    ->label('الإجمالي'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'delivered',
                        'danger' => 'cancelled',
                        'info' => ['confirmed', 'preparing'],
                    ])
                    ->label('الحالة'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('التاريخ'),
            ]);
    }
}

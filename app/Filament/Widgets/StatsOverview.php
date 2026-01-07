<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('إجمالي المبيعات', Order::where('status', '!=', 'cancelled')->sum('total') . ' ج.م')
                ->description('إجمالي المبيعات المؤكدة')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('الطلبات الجديدة', Order::where('status', 'pending')->count())
                ->description('قيد الانتظار')
                ->descriptionIcon('heroicon-m-bell')
                ->color('warning'),
            Stat::make('إجمالي الطلبات', Order::count())
                ->description('جميع الحالات')
                ->descriptionIcon('heroicon-m-shopping-bag'),
            Stat::make('المنتجات', Product::count())
                ->description('المسجلة في النظام')
                ->descriptionIcon('heroicon-m-squares-2x2'),
        ];
    }
}

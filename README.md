# 🐔 Friends Farm (فريندز فارم) 🌾

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![Filament](https://img.shields.io/badge/Filament-3.x-FFA116?style=for-the-badge&logo=laravel)](https://filamentphp.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Friends Farm** is a premium, high-performance e-commerce platform dedicated to providing fresh, home-raised poultry directly from the farm to the consumer. Built with a focus on **Visual Excellence**, **Mobile-First Responsiveness**, and **User Experience**.

---

## ✨ Key Features

### 🎨 Premium UI/UX
- **Growth Logo Animation**: Periodicorganic sprout animation for a unique brand identity.
- **Micro-interactions**: Subtle hover effects, glassmorphism, and smooth transitions.
- **Dark/Light Mode**: Full theme support with persistent user preference.
- **Hatching Egg Loader**: A custom, themed loading experience.

### 🐓 Product Showcase
- **High-Density Grids**: 2-column mobile grid optimization for better visibility.
- **Golden Egg Rating System**: Custom evaluation system using Lucide-based "Golden Eggs".
- **Dynamic Featured Slider**: Auto-scrolling carousel for top-rated products.
- **Detailed Product Pages**: Including interactive rating and review forms.

### 🛠️ Advanced Admin Panel (Filament)
- **Comprehensive Management**: Products, Categories, Orders, and Reviews.
- **Responsive Admin UI**: Fully optimized for mobile administration.
- **Custom Widgets**: Real-time sales and order tracking.

### 🚀 Performance & Technical
- **Mobile-First Architecture**: Liquid layouts using `rem`/`em` units.
- **Smart Caching**: Optimized database hits for settings and categories.
- **Eager Loading**: N+1 query prevention across all public views.
- **Lazy Loading**: Native image lazy loading for faster initial paint.

---

## 🛠️ Tech Stack

- **Backend**: [Laravel 11](https://laravel.com)
- **Admin**: [Filament v3](https://filamentphp.com)
- **Frontend**: Blade, Vanilla CSS, JavaScript
- **Icons**: [Lucide Icons](https://lucide.dev)
- **Database**: SQLite (Default) / MySQL
- **Performance**: Laravel Cache, Eager Loading

---

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & NPM

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/AbdullahSayed3/friendsfarm.git
   cd friendsfarm
   ```

2. **Install dependencies**:
   ```bash
   composer install
   npm install && npm run build
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database & Migrations**:
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

5. **Start Dev Server**:
   ```bash
   php artisan serve
   ```

---

## 🧑‍💻 Developed By

**Abdullah Sayed**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github)](https://github.com/AbdullahSayed3)

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

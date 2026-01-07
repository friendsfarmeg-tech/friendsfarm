# 📖 Developer Documentation - Friends Farm

This document provides a technical overview of custom implementations and patterns used in the Friends Farm project.

## 🌈 Architecture Overview

The project follows standard Laravel 11 patterns with a heavy emphasis on **Filament v3** for the administrative layer and **Vanilla CSS/JS** for the frontend to ensure maximum performance.

### 🧩 Custom Components

#### 1. Growth Logo Animation (`app.blade.php`)
- **Implemented via**: CSS Keyframes + periodic animation logic.
- **Classes**: `.logo-sprout`, `.nav-brand-text`.
- **Note**: The animation is timed at 15s to appear organic and non-intrusive.

#### 2. Golden Egg Rating System
- **Model**: `App\Models\Review`
- **Logic**: Average rating is calculated via the `average_rating` attribute on the `Product` model.
- **UI**: Uses Lucide `egg` and `egg-off` icons. Colors are defined in `:root` variables (`--gold-egg`).

#### 3. Natural Loader
- **Logic**: Located in `app.blade.php`.
- **Mechanism**: Blocks UI until `window.load` fires + a minimum 1000ms delay to ensure the hatching animation completes at least one cycle.

## 💾 Data Management

### Caching Strategy
- **Settings**: Cached globally via a View Composer in `AppServiceProvider`.
- **Categories**: Cached in `HomeController` and `ProductController` to reduce redundant lookups.
- **Clear Cache**: `php artisan cache:clear`

### Image Handling
- Images are primarily handled via Filament's file upload.
- **Lazy Loading**: Native `loading="lazy"` is applied to all grid items.
- **Error Handling**: A global JS delegation in `app.blade.php` catches broken images and replaces them with a themed placeholder.

## 🎨 Design System

Styles are managed through CSS Variables and Utility classes following a **Mobile First** approach.

### Key CSS Variables:
- `--primary`: #1B5E20 (Deep Green)
- `--bg-beige`: #faf7f2 (Cream background)
- `--gold-egg`: #FFD600 (Gold)
- `--radius-lg`: 1.2rem (Main border radius)

### Breakpoints:
- `37.5rem` (600px): Mobile optimized grid.
- `48rem` (768px): Tablet/Feature card layout.
- `75rem` (1200px): Max container width.

## 🛠️ Maintenance Tasks

### Updating Hero Content
1. Navigate to Admin Panel -> Settings.
2. Update `hero_image`, `hero_title`, or `hero_subtitle`.
3. Clear cache if changes don't reflect immediately.

### Moderating Reviews
1. Go to Admin Panel -> Reviews.
2. Toggle "Visible" status for user comments.
3. Top-rated products (4.5+) are automatically prioritized in the homepage slider.

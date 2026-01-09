@extends('layouts.app')

@section('content')
    <div class="container"
        style="min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 1rem;">
        <div
            style="background: white; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.05); text-align: center; max-width: 400px; width: 100%; border: 1px solid #f0f0f0;">
            <div
                style="background: var(--bg-beige); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                <i data-lucide="sprout" style="width: 40px; height: 40px; color: var(--primary);"></i>
            </div>
            <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--primary); font-weight: 800;">مرحباً بك</h1>
            <p style="color: var(--text-muted); margin-bottom: 2.5rem; font-size: 0.95rem;">سجل دخولك لتتمكن من الطلب وتتبع
                طلباتك</p>

            @if (session('error'))
                <div
                    style="background: #fee2e2; color: #dc2626; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    {{ session('error') }}
                </div>
            @endif

            <a href="/auth/google" class="btn"
                style="width: 100%; justify-content: center; border: 1px solid #ddd; background: white; color: var(--text-dark); padding: 0.75rem;">
                <img src="https://www.google.com/favicon.ico" alt="Google" style="width: 20px; height: 20px;">
                الدخول بواسطة جوجل
            </a>

            <div style="margin-top: 2rem; font-size: 0.875rem; color: var(--text-muted);">
                بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </div>
        </div>
    </div>
@endsection

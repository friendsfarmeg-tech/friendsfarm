@extends('layouts.app')

@section('title', 'تسجيل الدخول')

@section('content')
<div class="max-w-md mx-auto px-4 py-8 md:py-12">
    <div class="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div class="text-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">مرحباً بك</h1>
            <p class="text-gray-600">سجل دخولك لتتمكن من الطلب وتتبع طلباتك</p>
        </div>

        @if(session('error'))
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {{ session('error') }}
            </div>
        @endif

        <a href="/auth/google" class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition mb-4">
            <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5">
            الدخول بواسطة جوجل
        </a>

        <p class="text-center text-sm text-gray-500 mt-6">
            بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية
        </p>
    </div>
</div>
@endsection

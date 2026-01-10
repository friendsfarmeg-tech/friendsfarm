<?php

// Ensure writable directories for Vercel
$dirs = ['/tmp/views', '/tmp/cache', '/tmp/sessions', '/tmp/framework/cache/data'];
foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Force production settings for Vercel
putenv('APP_ENV=production');
putenv('VIEW_COMPILED_PATH=/tmp/views');
putenv('CACHE_DRIVER=array');
putenv('SESSION_DRIVER=cookie');
putenv('LOG_CHANNEL=stderr');

require __DIR__ . '/../public/index.php';

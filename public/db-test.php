<?php
$host = getenv('DB_HOST');
$port = getenv('DB_PORT');
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

echo "<h1>Database Connection Test</h1>";
echo "Host: $host<br>";
echo "Port: $port<br>";
echo "User: $user<br>";

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db;sslmode=require";
    $pdo = new PDO($dsn, $user, $pass);
    echo "<h2 style='color:green'>Connection Successful! ✅</h2>";
} catch (PDOException $e) {
    echo "<h2 style='color:red'>Connection Failed! ❌</h2>";
    echo "Error: " . $e->getMessage();
}

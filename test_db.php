<?php
$dsn = 'mysql:host=127.0.0.1;dbname=drilleedov2;charset=utf8mb4';
$user = 'admin';
$pass = '622280';

try {
    $pdo = new PDO($dsn, $user, $pass);
    echo "Connected successfully to drilleedov2\n";
    $stmt = $pdo->query("SELECT COUNT(*) FROM category");
    echo "Category count: " . $stmt->fetchColumn() . "\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}

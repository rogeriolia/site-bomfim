<?php
/** Isolated Bomfim analytics PDO connection; credentials stay in the existing server config. */
function bomfim_db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $classFiles = [
        rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/') . '/app/auth/classes/Database.php',
        dirname(__DIR__, 2) . '/www/app/auth/classes/Database.php',
        dirname(__DIR__, 2) . '/app/auth/classes/Database.php',
    ];
    $classFile = null;
    foreach ($classFiles as $candidate) {
        if ($candidate && is_file($candidate)) { $classFile = $candidate; break; }
    }
    if (!$classFile) throw new RuntimeException('Bomfim database provider is unavailable');
    require_once $classFile;
    if (!class_exists('Database')) throw new RuntimeException('Database provider is unavailable');
    $database = new Database(getenv('BOMFIM_DB_NAME') ?: 'bomfim_analytics');
    $pdo = $database->getConnection();
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
}

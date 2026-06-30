<?php
/**
 * WooCommerce API Proxy for Shared Hosting (cPanel)
 * This securely proxies requests from the frontend to WooCommerce without exposing secrets.
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$route = isset($_GET['route']) ? $_GET['route'] : '';
$configFile = __DIR__ . '/woo-config.json';

// Helper to read config safely
function getConfig($file) {
    if (file_exists($file)) {
        $json = file_get_contents($file);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    // Default fallback values if needed, otherwise empty.
    return ['url' => '', 'key' => '', 'secret' => ''];
}

if ($route === 'woo-config') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $config = getConfig($configFile);
        // Mask the keys just like Node.js server
        $response = [
            'url' => isset($config['url']) ? $config['url'] : '',
            'key' => !empty($config['key']) ? substr($config['key'], 0, 7) . '...[HIDDEN]' : '',
            'secret' => !empty($config['secret']) ? substr($config['secret'], 0, 7) . '...[HIDDEN]' : ''
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $currentConfig = getConfig($configFile);
        
        $newKey = (isset($input['key']) && strpos($input['key'], '...[HIDDEN]') === false) ? $input['key'] : (isset($currentConfig['key']) ? $currentConfig['key'] : '');
        $newSecret = (isset($input['secret']) && strpos($input['secret'], '...[HIDDEN]') === false) ? $input['secret'] : (isset($currentConfig['secret']) ? $currentConfig['secret'] : '');

        $newConfig = [
            'url' => isset($input['url']) ? $input['url'] : '',
            'key' => $newKey,
            'secret' => $newSecret
        ];
        
        $result = @file_put_contents($configFile, json_encode($newConfig, JSON_PRETTY_PRINT));
        header('Content-Type: application/json');
        if ($result === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to write configuration file. Please check folder permissions for /api/woo-config.json']);
        } else {
            echo json_encode(['success' => true]);
        }
        exit;
    }
}

if (strpos($route, 'woo/') === 0) {
    $config = getConfig($configFile);
    if (empty($config['url']) || empty($config['key']) || empty($config['secret'])) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'WooCommerce config missing on server proxy.']);
        exit;
    }

    $targetPath = substr($route, 3); // removes prefix 'woo', leaving /wp-json/...
    $baseUrl = rtrim($config['url'], '/');
    
    // Reconstruct full query string safely
    $queryParams = $_GET;
    unset($queryParams['route']);
    $queryString = http_build_query($queryParams);
    
    if ($queryString) {
        $targetUrl = $baseUrl . $targetPath . '?' . $queryString;
    } else {
        $targetUrl = $baseUrl . $targetPath;
    }

    $ch = curl_init($targetUrl);
    
    $headers = [
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode($config['key'] . ':' . $config['secret'])
    ];
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // curl_setopt($ch, CURLOPT_HEADER, true); // Do not include headers in the body output
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Ignore invalid SSL matching NODE_TLS_REJECT_UNAUTHORIZED
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
        $input = file_get_contents('php://input');
        if ($input) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
        }
    }

    // Execute request
    $responseBody = curl_exec($ch);
    
    if (curl_errno($ch)) {
        http_response_code(504);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Request to WooCommerce timed out or failed to connect.', 'details' => curl_error($ch)]);
        curl_close($ch);
        exit;
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    http_response_code($httpCode);
    
    // Attempt decoding response to ensure it's json or just return as is
    header('Content-Type: application/json');
    echo $responseBody;
    
    curl_close($ch);
    exit;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Endpoint not found in proxy or invalid route.', 'route' => $route]);

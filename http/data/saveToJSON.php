<?php
/*
// increase default php settings to prevent page timeout or memory exhaustion issues
$memoryLimit="2048M";
$timeout=600;
ini_set('memory_limit', $memoryLimit);
ini_set('max_execution_time', $timeout);
*/


$json = file_get_contents('php://input');

//echo json_decode($json);

print_r($json);

$file = "./weather.json";

file_put_contents($file, $json);
?>
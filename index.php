<?php
if (!isset($_GET["page"])) {
    $page = "welcome";
} else {
    $page = $_GET["page"];
}


// MUSTACHE ENGINE
require 'assets/src/Mustache/Autoloader.php';
Mustache_Autoloader::register();

$m = new Mustache_Engine(array(
    'loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/views/', array('extension' => '.html')),
    'partials_loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/views/', array('extension' => '.html')),
    'cache' => dirname(__FILE__).'/cache',
));

// LANGUAGE
$locale = json_decode(file_get_contents("locales/de.json"), true);
if(isset($_COOKIE["lang"])) {
    $lang_code = $_COOKIE["lang"];

    if(file_exists("locales/" . $lang_code . ".json")) {
        $locale = array_merge($locale, json_decode(file_get_contents("locales/" . $lang_code . ".json"), true));
    }
}

// DATA
$data = new stdClass();

$data->page = $page;
$data->lang = $locale;

echo $m->render("main", $data);
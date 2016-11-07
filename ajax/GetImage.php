<?php
if (!isset($_POST["url"])) {
    error();
}

$url = $_POST["url"];
$url_data = parse_url($url);

if ($url_data == false) {
    error(9);
}

if (!array_key_exists("scheme", $url_data)) {
    $url = "http://" . $url;
    $url_data = parse_url($url);

    if ($url_data == false) {
        error(18);
    }
}

if (!array_key_exists("host", $url_data)) {
    error(23);
}

$data = false;

$host = strtolower($url_data["host"]);

if(strpos($host, "deviantart.com") !== false) {
    $data = addDeviantart($url);
} else if(strpos($host, "derpibooru.org") !== false) {
    $data = addDerpibooru($url);
}

if($data == false) {
    error(35);
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data);

function addDeviantart($url) {
    $api_data = json_decode(file_get_contents("http://backend.deviantart.com/oembed?url=" . $url));

    $data = array();

    $data["url"] = $url;
    $data["title"] = $api_data->title;
    $data["author_name"] = $api_data->author_name;
    $data["author_url"] = $api_data->author_url;
    $data["width"] = $api_data->width;
    $data["height"] = $api_data->height;

    if(property_exists($api_data, "url")) {
        $data["img_url"] = $api_data->url;
    } else {
        $data["img_url"] = $api_data->thumbnail_url;
    }

    $data["data"] = json_encode($data);

    return $data;
}

function addDerpibooru($url) {

}

function error($text = "")
{
    header('HTTP/1.1 400 Request Error: ' . $text);
    exit;
}
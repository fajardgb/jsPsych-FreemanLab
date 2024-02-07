<?php
$post_data = json_decode(file_get_contents('php://input'), true);
if (!isset($post_data['filedata'])){
    die("filedata not received");
}else{
 $data = $post_data['filedata'];
 $file = uniqid("session-");
 $name = "/home/ratemybr/www/jbfreeman.net/webmt/ratings/GF_antonyms/data/{$file}.csv";
 file_put_contents($name,$data);
}
?>
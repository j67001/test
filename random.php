<?php
//存有美圖鏈接的文件名img.txt
$filename = "img.txt";
if(!file_exists($filename)){
    die('圖片不存在');
}
 
//從文本獲取鏈接
$pics = [];
$fs = fopen($filename, "r");
while(!feof($fs)){
    $line=trim(fgets($fs));
    if($line!=''){
        array_push($pics, $line);
    }
}
 
//從數組隨機獲取鏈接
$pic = $pics[array_rand($pics)];
 
//返回指定格式
$type=$_GET['type'];
switch($type){
 
//JSON返回
case 'json':
    header('Content-type:text/json');
    die(json_encode(['pic'=>$pic]));
 
default:
    die(header("Location: $pic"));
}
?>
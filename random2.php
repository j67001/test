<?php
//設置站點地址及圖片文件夾
$weburl= 'https://xn--sss604efuw.top/%E6%B7%B1%E8%89%B2%E5%A3%81%E7%BA%B8/';
$path = 'bg';

function getImagesFromDir($path) {
    $images = array();
    if ( $img_dir = @opendir($path) ) {
        while ( false !== ($img_file = readdir($img_dir)) ) {
            if ( preg_match("/(\.gif|\.jpg|\.png|\.webp)$/", $img_file) ) {
                $images[] = $img_file;
            }
        }
        closedir($img_dir);
    }
    return $images;
}
function getRandomFromArray($ar) {
    mt_srand( (double)microtime() * 1000000 );
    $num = array_rand($ar);
    return $ar[$num];
}
$imgList = getImagesFromDir($path);
$img = getRandomFromArray($imgList);

header("Location:" . $weburl. $path . '/' . $img);

?>

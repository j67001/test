
var rule={
    title:'djwo',
    host:'https://www.djwo.cc,
    //host:'https://www.tangrenjie.one',
    // url:'/vod/show/id/fyclass/page/fypage.html',
    url:'/show/fyfilter.html',
    filterable:1,//是否启用分类筛选,
    filter_url:'{{fl.cateId}}{{fl.by}}{{fl.year}}/page/fypage',
    filter: {
        "1":[{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"/year/2025"},{"n":"2024","v":"/year/2024"},{"n":"2023","v":"/year/2023"}]}]
    },
    filter_def:{
        1:{cateId:'1',by:'/by/time'}
    },

    searchUrl:'/search/--/?wd=**',
    searchable:2,//是否启用全局搜索,
    headers:{
        'User-Agent':'UC_UA',
    },
    class_parse:'.vod-list row&&li:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
    play_parse:true,
    lazy:'',
    limit:6,
    推荐:'ul.vodlist.vodlist_wi;li;*;*;*;*',
    double:true, // 推荐内容是否双层定位
    一级:'li.vodlist_item;a&&title;a&&data-original;.pic_text.text_right&&Text;a&&href',
    二级:{
        "title":".lazyload&&title;.data:eq(3)--span&&Text",
        "img":".lazyload&&data-original",
        "desc":".data:eq(2)span&&Text;;;.data--span:eq(0)&&Text;.data--span:eq(1)&&Text",
        "content":".content&&Text",
        "tabs":"#NumTab a",
        "lists":".play_list_box:eq(#id) .playlist_full li"
    },
    搜索:'body .searchlist_item;*;.vodlist_thumb&&data-original;*;*',
}

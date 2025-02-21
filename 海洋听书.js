var rule = {
    title:'海洋听书',
    编码:'gb18030',
    host:'http://m.ychy.org',
    homeUrl:'/best.html',
    url:'/list/fyclass_fypage.html',
    searchUrl:'/search.asp?page=fypage&searchword=**&searchtype=-1',
    searchable:2,
    quickSearch:0,
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    class_name:'网络玄幻&恐怖悬疑&评书下载&儿童读物&相声戏曲&传统武侠&都市言情&历史军事&人物传记&广播剧&百家讲坛&有声文学&探险盗墓&职场商战',
    class_url:'52&17&3&4&7&12&13&15&16&18&32&41&45&81',
    play_parse:true,
    lazy:'',
    limit:6,
    double:true,
    推荐:'*',
    一级:'.list-ul li;.tit&&Text;img&&src;p span:eq(0)&&Text;a&&href',
    二级:{
        title:'h2&&Text;.info div:eq(4)&&Text',
        img:'.bookimg img&&src',
        desc:'.info div:eq(3)&&Text;;;.info div:eq(2)&&Text;.info div:eq(1)&&Text',
        content:'.book_intro&&Text',
        tabs:'.sub_tit',
        // lists:'#playlist li',
        lists:`js:
            pd = jsp.pd;
            let url = pd(html, ".bookbutton&&a&&href");
            // log(url);
            html = request(url);
            let v = pd(html, ".booksite&&script&&Html");
            var document = {};
            var VideoListJson;
            VideoListJson = eval(v.split("VideoListJson=")[1].split(",urlinfo")[0]);
            // log(typeof VideoListJson);
            let list1 = VideoListJson[0][1];
            LISTS = [list1];
            // log(LISTS);
        `,
    },
    搜索:`js:
        let d = [];
        pdfh = jsp.pdfh;pdfa = jsp.pdfa;pd = jsp.pd;
        // log(input);
        let html = request(input);
        var list = pdfa(html, '.book_slist&&.bookbox');
        list.forEach(function(it) {
            d.push({
                title: pdfh(it, 'h4&&Text'),
                desc: pdfh(it, '.update&&Text'),
                pic_url: pd(it, 'img&&orgsrc'),
                url: 'http://m.ychy.com/book/' + pdfh(it, '.bookbox&&bookid') + '.html'
            })
        });
        setResult(d);
    `,
}

var rule={
            title: 'movieffm',
            host: 'https://www.movieffm.net/',
            url:'/fyclass/fypage.html',
          //https://www.movieffm.net/xssearch?q=%E5%90%8D
            searchUrl: '/xssearch?q=**',    
            searchable: 2,//是否启用全局搜索,
            quickSearch: 0,//是否启用快速搜索,
            filterable: 0,//是否启用分类筛选,
            headers:{'User-Agent':'MOBILE_UA'},
          class_parse: '.mi_nav&&li;a&&Text;a&&href;.*/(.*?)',
            play_parse: true,
            lazy: '',
            limit: 6,  
          推荐: '.item;h3&&Text;img&&data-lazy-src;.rating&&Text;a&&href',
          一级: '.item;h4&&Text;img&&data-lazy-src;.rating&&Text;a&&href',
          二级: {
                "title": "h1&&Text",
                "content": ".wp-content&&Text",
                "tabs": ".options&&span.title",//解析源
                "lists": ".options&&ul:eq(#id) li"
            },
 }

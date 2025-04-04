
muban.首图.二级.title = 'h1&&Text;p.data:eq(0)&&Text';
muban.首图.二级.desc = 'p.data--span:eq(3)&&Text;;;p.data--span:eq(1)&&Text;p.data--span:eq(2)&&Text';
muban.首图.二级.tabs = '.myui-panel__head.bottom-line h3';
var rule = {
	title:'剧迷',
	模板:'首图',
	// host:'https://gmtv1.xyz',
	host:'https://gimy.video',
	// url:'/genre/fyclass---fypage.html',
	url:'/genre/fyfilter.html',
	class_name:'短剧',
        class_url:'34',
	filterable:1,//是否启用分类筛选,
	filter_url:'{{fl.cateId}}-{{fl.area}}-{{fl.year}}-fypage{{fl.by}}',
/*
	filter: {
		"movies":[{"key":"cateId","name":"類型","value":[{"n":"全部","v":"movies"},{"n":"劇情片","v":"drama"},{"n":"動作片","v":"action"},{"n":"科幻片","v":"scifi"},{"n":"喜劇片","v":"comedy+"},{"n":"愛情片","v":"romance"},{"n":"戰爭片","v":"war"},{"n":"恐怖片","v":"horror"},{"n":"動畫電影","v":"animation"}]},{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"美國","v":"美國"},{"n":"歐美","v":"歐美"},{"n":"大陸","v":"大陸"},{"n":"台灣","v":"臺灣"},{"n":"韓國","v":"韓國"},{"n":"香港","v":"香港"},{"n":"日本","v":"日本"},{"n":"英國","v":"英國"},{"n":"泰國","v":"泰國"},{"n":"歐洲","v":"歐洲"},{"n":"法國","v":"法國"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"tvseries":[{"key":"cateId","name":"類型","value":[{"n":"全部","v":"tvseries"},{"n":"陸劇","v":"cn"},{"n":"韓劇","v":"kr"},{"n":"美劇","v":"us"},{"n":"日劇","v":"jp"},{"n":"台劇","v":"tw"},{"n":"港劇","v":"hk"},{"n":"海外劇","v":"ot"},{"n":"紀錄片","v":"documentary+"}]},{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"歐美","v":"歐美"},{"n":"美國","v":"美國"},{"n":"韓國","v":"韓國"},{"n":"日本","v":"日本"},{"n":"大陸","v":"大陸"},{"n":"台灣","v":"臺灣"},{"n":"香港","v":"香港"},{"n":"泰國","v":"泰國"},{"n":"英國","v":"英國"},{"n":"法國","v":"法國"},{"n":"新加坡","v":"新加坡"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"tv_show":[{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"大陸","v":"大陸"},{"n":"中國大陸","v":"中國大陸"},{"n":"韓國","v":"韓國"},{"n":"台灣","v":"臺灣"},{"n":"美國","v":"美國"},{"n":"歐美","v":"歐美"},{"n":"日本","v":"日本"},{"n":"香港","v":"香港"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"anime":[{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"日本","v":"日本"},{"n":"美國","v":"美國"},{"n":"歐美","v":"歐美"},{"n":"大陸","v":"大陸"},{"n":"台灣","v":"臺灣"},{"n":"香港","v":"香港"},{"n":"韓國","v":"韓國"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}]
	},
	filter_def:{
		movies:{cateId:'movies',by:'/by/time'},
		tvseries:{cateId:'tvseries',by:'/by/time'},
		tv_show:{cateId:'tv_show',by:'/by/time'},
		anime:{cateId:'anime',by:'/by/time'}
	},
 */
	filter: {
		"1":[{"key":"cateId","name":"類型","value":[{"n":"全部","v":"1"},{"n":"劇情片","v":"11"},{"n":"動作片","v":"6"},{"n":"科幻片","v":"9"},{"n":"喜劇片","v":"7"},{"n":"愛情片","v":"8"},{"n":"戰爭片","v":"12"},{"n":"恐怖片","v":"10"},{"n":"動畫電影","v":"24"}]},{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"美國","v":"美國"},{"n":"歐美","v":"歐美"},{"n":"大陸","v":"大陸"},{"n":"台灣","v":"臺灣"},{"n":"韓國","v":"韓國"},{"n":"香港","v":"香港"},{"n":"日本","v":"日本"},{"n":"英國","v":"英國"},{"n":"泰國","v":"泰國"},{"n":"歐洲","v":"歐洲"},{"n":"法國","v":"法國"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"2":[{"key":"cateId","name":"類型","value":[{"n":"全部","v":"2"},{"n":"短劇","v":"34"},{"n":"陸劇","v":"13"},{"n":"韓劇","v":"20"},{"n":"美劇","v":"16"},{"n":"日劇","v":"15"},{"n":"台劇","v":"14"},{"n":"港劇","v":"21"},{"n":"海外劇","v":"31"},{"n":"紀錄片","v":"22"}]},{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"歐美","v":"歐美"},{"n":"美國","v":"美國"},{"n":"韓國","v":"韓國"},{"n":"日本","v":"日本"},{"n":"大陸","v":"大陸"},{"n":"台灣","v":"臺灣"},{"n":"香港","v":"香港"},{"n":"泰國","v":"泰國"},{"n":"英國","v":"英國"},{"n":"法國","v":"法國"},{"n":"新加坡","v":"新加坡"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"29":[{"key":"area","name":"地區","value":[{"n":"全部","v":"29"},{"n":"大陸","v":"大陸"},{"n":"中國大陸","v":"中國大陸"},{"n":"韓國","v":"韓國"},{"n":"台灣","v":"臺灣"},{"n":"美國","v":"美國"},{"n":"歐美","v":"歐美"},{"n":"日本","v":"日本"},{"n":"香港","v":"香港"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"30":[{"key":"area","name":"地區","value":[{"n":"全部","v":"30"},{"n":"日本","v":"日本"},{"n":"美國","v":"美國"},{"n":"歐美","v":"歐美"},{"n":"大陸","v":"大陸"},{"n":"台灣","v":"臺灣"},{"n":"香港","v":"香港"},{"n":"韓國","v":"韓國"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}],
		"34":[{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"by","name":"排序","value":[{"n":"按更新","v":"/by/time"},{"n":"周人氣","v":"/by/hits_week"},{"n":"月人氣","v":"/by/hits_month"}]}]
	},
	filter_def:{
		1:{cateId:'1',by:'/by/time'},
		2:{cateId:'2',by:'/by/time'},
		29:{cateId:'29',by:'/by/time'},
		30:{cateId:'30',by:'/by/time'},
		34:{cateId:'34',by:'/by/time'}
	},
	searchUrl:'/search/**----------fypage---.html',
	class_parse: 'ul.myui-header__menu li:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
	一级:'.myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
}

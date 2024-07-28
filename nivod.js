`user script`;

// Utils
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer':'https://www.nivod.cc/',
    'Origin': 'https://www.nivod.cc'
}

const queryParams = {
    'app_version': "1.0",
    'platform': "3",
    'market_id': "web_nivod",
    'device_code': "web",
    'versioncode': "1",
    'oid': "fd4db9f6473fd325202279a949a7680b83e910e9063c821d"
};

// Main
function buildMedias(inputURL) {
    const bodyList = inputURL.split("-");
    
    let postBody = {
        'sort_by': "4",
        'channel_id': bodyList[0],
        'show_type_id': "0",
        'region_id': "0",
        'lang_id': "0",
        'year_range': "0",
        'start': String((parseInt(bodyList[1]) - 1) * 20)
    };
    if (bodyList.length > 2) {
        if (bodyList[0] = 1) {
            postBody.show_type_id = parseInt(bodyList[2]);
        }else{
            postBody.region_id = parseInt(bodyList[2]);
        }
    }
    const body = Object.keys(postBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postBody[key])}`).join('&');

    const t = new Date().getTime();
    let query = queryParams;
    query._ts = t;
    query.sign  = createSign(query, postBody);
    
    let url = "https://api.nivodz.com/show/filter/WEB/3.2?";
    url += Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');
    const req = {
        url: url,
        method: 'POST',
        body:body,
        headers: headers
    };

    $http.fetch(req).then(res => {
        const items =  JSON.parse(decryptBody(res.body)).list;
        let datas = [];
        items.forEach(item => {
            const title = item.showTitle;
            const href = item.showIdCode;
            const coverURLString = item.showImg;
            var descriptionText = item.episodesTxt;
            if (descriptionText == null||descriptionText ==""||descriptionText ==undefined) {
                descriptionText = item.showTitle;
            }
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });
        $next.toMedias(JSON.stringify(datas));
    });
}

function Episodes(inputURL) {
    const postBody = {
        'show_id_code' : inputURL,
    }
    const body = Object.keys(postBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postBody[key])}`).join('&');

    const t = new Date().getTime();
    let query = queryParams;
    query._ts = t;
    query.sign = createSign(query, postBody);

    const url = "https://api.nivodz.com/show/detail/WEB/3.2?" + Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    const req = {
        url: url,
        method: 'POST',
        body:body,
        headers: headers
    };

    $http.fetch(req).then(res => {
        const items = JSON.parse(decryptBody(res.body)).entity.plays;
        let datas = [];
        items.forEach(item => {
            const href = inputURL + '-' +item.playIdCode;
            const title = item.episodeName;
            datas.push(buildEpisodeData(href, title, href));
        });
        $next.toEpisodes(JSON.stringify(datas));
    });
}

function Player(inputURL) {
    const bodyList = inputURL.split("-");
    const postBody = {
        'show_id_code' : bodyList[0],
        'play_id_code' : bodyList[1],
        'oid' : "1",
        'episode_id' : "0"
    }

    const body = Object.keys(postBody)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postBody[key])}`)
        .join('&');

    const t = new Date().getTime();
    let query = queryParams;
    query._ts = t;
    query.sign = createSign(query, postBody);

    const url = "https://api.nivodz.com/show/play/info/WEB/3.3?" + Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    const req = {
        url: url,
        method: 'POST',
        body:body,
        headers: headers
    };
        
    $http.fetch(req).then(res => {
        const playURL =  JSON.parse(decryptBody(res.body)).entity.plays[0].playUrl;
        $next.toPlayer(playURL);
    });
}

function Search(inputURL) {
    inputURL = decodeURI(inputURL);
    const postBody = {
        'keyword' : inputURL,
        'start' : "0",
        'cat_id' : "1",
        'keyword_type' : "0"
    }
    //const body = Object.keys(postBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postBody[key])}`).join('&');
    const body = "start=0&cat_id=1&keyword_type=0&keyword="+inputURL;

    const t = new Date().getTime();
    let query = queryParams;
    query._ts = t;
    query.sign = createSign(query, postBody);

    const url ='https://api.nivodz.com/show/search/WEB/3.2?'+ Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    const req = {
        url: url,
        method: 'POST',
        body:body,
        headers: headers
    };

    $http.fetch(req).then(res => {
        const items =  JSON.parse(decryptBody(res.body)).list;
        let datas = [];
        items.forEach(item => {
            const title = item.showTitle;
            const href = item.showIdCode;
            const coverURLString = item.showImg;
            let descriptionText = item.episodesTxt;
            if (descriptionText == null||descriptionText ==""||descriptionText ==undefined) {
                descriptionText = item.showTitle;
            }
            datas.push(
                buildMediaData(href, coverURLString, title, descriptionText, href)
            );
        });
        $next.toMedias(JSON.stringify(datas));
    });
}
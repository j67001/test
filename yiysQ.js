import 'assets://js/lib/crypto-js.js';

const HOST = "https://aleig4ah.yiys05.com";
const USER_AGENT = "Android/OkHttp";

let appId = '';
let token = '';

const guid = () =>
  [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const sha256 = s => CryptoJS.SHA256(s).toString();

function getHeaders(params = {}) {
  const headers = {
    "User-Agent": USER_AGENT,
    "Connection": "Keep-Alive",
    "Accept-Encoding": "gzip",
    "APP-ID": appId
  };

  if (params && token) {
    const sortedKeys = Object.keys(params).sort();
    const query = sortedKeys.map(k => `${k}=${params[k]}`).join("&");
    const signStr = `${query}&token=${token}`;
    headers["X-HASH-Data"] = sha256(signStr);
  }

  return headers;
}

async function reqSafe(url, options = {}) {
  try {
    const res = await req(url, options);
    return JSON.parse(res.content);
  } catch (e) {
    return {};
  }
}

async function refreshToken() {
  const ts = Math.floor(Date.now() / 1000).toString();
  const payload = { appID: appId, timestamp: ts };

  const headers = {
    "User-Agent": USER_AGENT,
    "APP-ID": appId,
    "X-Auth-Flow": "1"
  };

  const res = await reqSafe(`${HOST}/vod-app/index/getGenerateKey`, {
    method: "POST",
    data: payload,
    headers
  });

  if (res.data) {
    token = res.data; // ⚠ 这里无法做 RSA 解密
    return true;
  }

  return false;
}

async function init() {
  appId = guid();
  await refreshToken();
  return true;
}

async function home() {
  const ts = Math.floor(Date.now() / 1000).toString();
  const params = { timestamp: ts };

  const res = await reqSafe(`${HOST}/vod-app/type/list?timestamp=${ts}`, {
    headers: getHeaders(params)
  });

  const classes = [];
  const filters = {};

  (res.data || []).forEach(i => {
    const tid = i.typeId.toString();
    classes.push({
      type_id: tid,
      type_name: i.typeName
    });
  });

  return JSON.stringify({ class: classes, filters });
}

async function homeVod() {
  const ts = Math.floor(Date.now() / 1000).toString();
  const params = { timestamp: ts };

  const res = await reqSafe(`${HOST}/vod-app/rank/hotHits?timestamp=${ts}`, {
    headers: getHeaders(params)
  });

  let list = [];

  (res.data || []).forEach(i => {
    if (i.vodBeans) list.push(...i.vodBeans);
  });

  return JSON.stringify({ list });
}

async function category(tid, pg) {
  const payload = {
    tid,
    page: pg.toString(),
    limit: "12",
    timestamp: Math.floor(Date.now() / 1000).toString()
  };

  const res = await reqSafe(`${HOST}/vod-app/vod/list`, {
    method: "POST",
    data: payload,
    headers: getHeaders(payload)
  });

  const data = res.data || {};

  return JSON.stringify({
    list: data.data || [],
    page: +pg,
    pagecount: data.totalPageCount || 1
  });
}

async function detail(id) {
  const payload = {
    vodId: id,
    timestamp: Math.floor(Date.now() / 1000).toString()
  };

  const res = await reqSafe(`${HOST}/vod-app/vod/info`, {
    method: "POST",
    data: payload,
    headers: getHeaders(payload)
  });

  const data = res.data || {};

  const vod = {
    vod_id: data.vodId,
    vod_name: data.vodName,
    vod_pic: data.vodPic,
    vod_content: data.vodContent,
    vod_play_from: "",
    vod_play_url: ""
  };

  return JSON.stringify({ list: [vod] });
}

async function play(_, id) {
  const [sourceCode, rawUrl] = id.split("@");

  const payload = {
    sourceCode,
    timestamp: Math.floor(Date.now() / 1000).toString(),
    urlEncode: rawUrl
  };

  const res = await reqSafe(`${HOST}/vod-app/vod/playUrl`, {
    method: "POST",
    data: payload,
    headers: getHeaders(payload)
  });

  const url = res.data?.url || rawUrl;

  return JSON.stringify({
    parse: 0,
    url,
    header: {
      "User-Agent": USER_AGENT
    }
  });
}

async function search(wd, _, pg = "1") {
  const payload = {
    key: wd,
    limit: "20",
    page: pg,
    timestamp: Math.floor(Date.now() / 1000).toString()
  };

  const res = await reqSafe(`${HOST}/vod-app/vod/segSearch`, {
    method: "POST",
    data: payload,
    headers: getHeaders(payload)
  });

  return JSON.stringify({
    list: res.data?.data || [],
    page: +pg
  });
}

export function __jsEvalReturn() {
  return { init, home, homeVod, category, detail, play, search };
}

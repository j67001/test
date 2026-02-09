let host = 'https://www.ylys.tv';

async function init() {
  return true;
}

async function home() {
  return JSON.stringify({
    class: [
      { type_id: "1", type_name: "电影" }
    ],
    list: []
  });
}

export function __jsEvalReturn() {
  return {
    init,
    home
  };
}

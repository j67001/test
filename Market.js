import 'assets://js/lib/cat.js';
import 'assets://js/lib/crypto-js.js';

let datas = [];
const TAG = "Market";

/**
 * 初始化方法
 * @param {string} extend - 配置地址或 JSON 字符串
 */
export async function init(extend) {
    if (extend.startsWith("http")) {
        const res = await req(extend);
        extend = res.content;
    }
    datas = JSON.parse(extend);
}

/**
 * 首頁內容
 */
export async function home(filter) {
    const classes = [];
    if (datas.length > 1) {
        for (let i = 1; i < datas.length; i++) {
            classes.push({
                type_id: datas[i].name,
                type_name: datas[i].name
            });
        }
    }
    return JSON.stringify({
        class: classes,
        list: datas[0].vod || []
    });
}

/**
 * 分類內容
 */
export async function category(tid, pg, filter, extend) {
    for (const data of datas) {
        if (data.name === tid) {
            return JSON.stringify({
                page: 1,
                pagecount: 1,
                limit: data.vod.length,
                total: data.vod.length,
                list: data.vod
            });
        }
    }
    return "{}";
}

/**
 * 執行下載或特定動作
 * @param {string} action - 下載連結或指令
 */
export async function action(action) {
    try {
        const fileName = action.split('/').pop();
        // 顯示通知
        await notify("正在下載..." + fileName);

        // 執行下載邏輯 (依賴宿主環境提供的下載接口)
        // 在 CatVodJS 中通常使用特定指令或通過播放器調用
        const downloadPath = "download/" + fileName;
        const res = await req(action, {
            timeout: 60000,
            buffer: 1 // 告知請求返回 buffer
        });

        // 保存文件
        await local.save(downloadPath, res.content);

        // 文件後綴處理
        if (fileName.endsWith(".zip")) {
            await local.unzip(downloadPath, "download/");
        } else if (fileName.endsWith(".apk")) {
            await local.openFile(downloadPath);
        }

        // 檢查並複製文本
        checkCopy(action);

        return JSON.stringify({
            msg: "下載完成",
            type: 3 // 通知類型
        });
    } catch (e) {
        return JSON.stringify({
            msg: "錯誤: " + e.message,
            type: 3
        });
    }
}

/**
 * 私有方法：檢查並複製到剪貼簿
 */
function checkCopy(url) {
    for (const data of datas) {
        const item = data.list.find(i => i.url === url);
        if (item && item.copy) {
            // 調用系統剪貼簿
            Util.copy(item.copy);
            break;
        }
    }
}

/**
 * 銷毀方法
 */
export async function destroy() {
    // 停止所有當前 TAG 的請求
    // req.cancel(TAG); 
}

// 導出對象
export default {
    init,
    home,
    category,
    action,
    destroy
};
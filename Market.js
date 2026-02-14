//import 'assets://js/lib/cat.js';
//import 'assets://js/lib/crypto-js.js';
import { _ } from 'lib/cat.js';

// 全域變量存儲配置數據
let datas = [];
const TAG = "Market";

/**
 * 初始化配置
 * @param {string} extend - 可以是遠端 URL 或 JSON 字符串
 */
export async function init(extend) {
    try {
        let content = extend;
        if (extend.startsWith("http")) {
            const res = await req(extend, { method: 'get' });
            content = res.content;
        }
        // 解析 JSON，確保 datas 始終為數組
        const json = JSON.parse(content);
        datas = Array.isArray(json) ? json : [json];
    } catch (e) {
        console.log(`[${TAG}] Init Error: ${e.message}`);
        datas = [];
    }
}

/**
 * 獲取分類清單
 */
export async function home(filter) {
    const classes = datas.slice(1).map(item => ({
        type_id: item.name,
        type_name: item.name
    }));

    return JSON.stringify({
        class: classes,
        list: datas[0]?.vod || [] // 第一筆通常是默認推薦
    });
}

/**
 * 獲取分類下的列表
 */
export async function category(tid, pg, filter, extend) {
    const target = datas.find(d => d.name === tid);
    if (!target) return JSON.stringify({ list: [] });

    return JSON.stringify({
        page: 1,
        pagecount: 1,
        limit: target.vod.length,
        total: target.vod.length,
        list: target.vod
    });
}

/**
 * 核心：模擬 Java 的下載、解壓與自動執行邏輯
 */
export async function action(actionUrl) {
    if (!actionUrl) return JSON.stringify({ msg: "無效連結", type: 3 });

    try {
        const uri = actionUrl.split('?')[0]; // 去除參數
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        
        // 1. 顯示 UI 通知 (調用殼端的 Notify)
        await notify(`正在下載: ${fileName}`);

        // 2. 執行下載 (使用 buffer 模式獲取原始數據)
        // 注意：某些引擎 req 支持直接 download 參數，若不支持則用 content
        const res = await req(actionUrl, {
            method: 'get',
            timeout: 0, // 下載大文件建議不設限時
            buffer: 2   // 2 通常代表下載到暫存文件或返回 bytes
        });

        // 3. 定義路徑 (依據 Path.download() 邏輯)
        const downloadDir = "cache://download/";
        const filePath = `${downloadDir}${fileName}`;

        // 4. 保存並處理文件
        // 假設 local 插件提供 IO 操作
        await local.save(filePath, res.content);

        if (fileName.endsWith(".zip")) {
            await local.unzip(filePath, downloadDir);
        } else if (fileName.endsWith(".apk")) {
            // 自動調用系統安裝器
            await local.openFile(filePath);
        }

        // 5. 執行 Java 中的 checkCopy 邏輯
        checkCopy(actionUrl);

        return JSON.stringify({
            msg: "處理完成",
            type: 3
        });

    } catch (e) {
        console.log(`[${TAG}] Action Error: ${e.message}`);
        return JSON.stringify({
            msg: `下載失敗: ${e.message}`,
            type: 3
        });
    }
}

/**
 * 私有邏輯：檢查並複製文本到剪貼簿
 */
function checkCopy(url) {
    for (const data of datas) {
        const item = (data.list || []).find(i => i.url === url);
        if (item && item.copy) {
            // 調用 JS 橋接的複製功能
            if (typeof bash !== 'undefined' && bash.copy) {
                bash.copy(item.copy);
            } else {
                console.log(`[Copy]: ${item.copy}`);
            }
            break;
        }
    }
}

/**
 * 銷毀資源
 */
export async function destroy() {
    // 清理閉包或取消未完成的請求
}

export default {
    init,
    home,
    category,
    action,
    destroy
};

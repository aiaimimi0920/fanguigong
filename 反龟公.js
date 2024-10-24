// ==UserScript==
// @name         反龟公
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display a huge red cross in the center of the screen on a specific webpage until navigating away
// @author       mimi
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      GPL
// ==/UserScript==
(async function() {
    'use strict';

    // const jsonUrl = 'https://raw.githubusercontent.com/aiaimimi0920/fanguigong/main/blacklist.json';
    const jsonUrl = 'https://pub-120dfe5d44734d658b1a5a6e046fd9a9.r2.dev/blacklist.json';
    let urlList = [];
    const isLoaded = GM_getValue('isLoaded', false); // 从存储中获取标志
    const lastUpdate = GM_getValue('lastUpdate', 0); // 获取上次更新的时间戳
    let shouldUpdate = (Date.now() - lastUpdate) > 24 * 60 * 60 * 1000; // 每24小时更新一次
    // shouldUpdate = true;
    // 如果还未加载或者需要更新
    if (!isLoaded || shouldUpdate) {
        await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: jsonUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            console.log("111111");
                            urlList = JSON.parse(response.responseText);
                            GM_setValue('urlList', urlList); // 保存到 Local Storage
                            GM_setValue('isLoaded', true); // 设置标志为已加载
                            GM_setValue('lastUpdate', Date.now()); // 保存当前时间戳
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error('Failed to load URL list'));
                    }
                },
                onerror: reject,
            });
        });
    } else {
        // 如果已经加载过，从 Local Storage 获取网址列表
        urlList = GM_getValue('urlList', []);
    }
    console.log("urlList",urlList);
    const currentUrl = window.location.href;
    console.log(currentUrl);
    if (currentUrl.includes('bilibili.com')) {
        handleBilibili();
    } else if (currentUrl.includes('jd.com')) {
        handleJD();
    } else {
        console.log('不支持的站点',currentUrl);
        return; // 如果不在支持的网站列表中，直接返回
    }

    function handleBilibili() {
        let cur_urlList = urlList["bilibili"];

        function extractUniqueNumber(url) {
            // 使用正则表达式匹配最后一个数字字段，确保后面不是字母
            const match = url.match(/\/(\d+)(?=\?|$)/);
            // 返回匹配到的数字，如果没有匹配到则返回 null
            return match ? match[1] : null;
        }

        // 检查当前URL是否在列表中
        console.log("currentUrl",currentUrl);
        console.log("extractUniqueNumber(currentUrl)",extractUniqueNumber(currentUrl));
        console.log("extractUniqueNumber(currentUrl)",extractUniqueNumber(currentUrl));
        if (!cur_urlList.includes(extractUniqueNumber(currentUrl))) {
            if (document.readyState == 'loading') {
                // 仍在加载，等待事件
                    document.addEventListener('DOMContentLoaded', check_work);
                    return;
                }
            check_work();
            return;
        }
        work();

        function check_work(){
            let links = document.querySelectorAll(".up-avatar"); // 假设链接在 <a> 标签内
            if(!cur_urlList.includes(extractUniqueNumber(links[0].href))){
                return; // 如果不在列表中，直接返回
            }
            work();
        }


        }

    function handleJD() {
        work();
    }


    function work(){
        const turtlePattern = document.createElement('div');
        Object.assign(turtlePattern.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text x=\'0\' y=\'70\' font-size=\'50\'>🐢</text></svg>")',
            backgroundSize: '300px 300px',
            backgroundRepeat: 'repeat',
            zIndex: '1',
        });

        function createTextBox(text) {
            const textBox = document.createElement('div');
            Object.assign(textBox.style, {
                color: '#499F4B',
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: '#E0181E',
                padding: '10px',
                borderRadius: '5px',
                position: 'fixed',
                zIndex: '10000',
                fontSize: 'min(13vw, 13vh)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            });
            textBox.textContent = text;
            return textBox;
        }

        // 创建顶部文本框
        const topText = createTextBox('看龟公');
        topText.style.left = '30vw';
        topText.style.top = '10vh';
        topText.style.width = '40vw';
        topText.style.height = '20vh'; // 自适应高度

        // 创建左侧文本框
        const leftText = createTextBox('变龟公');
        leftText.style.left = '10vw';  // 左侧位置
        leftText.style.top = '50vh';    // 垂直居中
        leftText.style.width = '20vw';    //
        leftText.style.transform = 'translateY(-50%)'; // 垂直居中
        leftText.style.writingMode = 'vertical-rl'; // 竖直排列文本

        // 创建右侧文本框
        const rightText = createTextBox('看龟公');
        rightText.style.right = '10vw'; // 右侧位置
        rightText.style.top = '50vh';    // 垂直居中
        rightText.style.width = '20vw';    //
        rightText.style.transform = 'translateY(-50%)'; // 垂直居中
        rightText.style.writingMode = 'vertical-rl'; // 竖直排列文本

        // 创建红色叉叉
        const cross = document.createElement('div');
        cross.style.color = '#E0181E';
        cross.textContent = '❌';
        cross.style.textAlign = 'center';
        cross.style.fontSize = 'min(40vw, 40vh)';
        cross.style.position = 'fixed';
        cross.style.zIndex = '9999';
        cross.style.left = '50%';
        cross.style.top = '50vh'; // 调整叉叉的垂直位置
        cross.style.transform = 'translate(-50%, -50%)'; // 垂直和水平居中

        // 创建底部文本框
        const bottomText = createTextBox('变龟公');
        bottomText.style.left = '30vw';
        bottomText.style.bottom = '10vh';
        bottomText.style.width = '40vw';
        bottomText.style.height =  '20vh'; // 自适应高度

        // 将所有元素添加到文档中
        document.body.appendChild(turtlePattern);
        document.body.appendChild(topText);
        document.body.appendChild(leftText);
        document.body.appendChild(rightText);
        document.body.appendChild(cross);
        document.body.appendChild(bottomText);

        // 清理事件
        window.addEventListener('beforeunload', () => {
            turtlePattern.remove();
            topText.remove();
            leftText.remove();
            rightText.remove();
            cross.remove();
            bottomText.remove();
        });
    }

})();
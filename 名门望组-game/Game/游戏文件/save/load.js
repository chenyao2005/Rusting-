const RESOURCES = {
    // 背景图片
    BACKGROUNDS: {
        BG1: "素材/背景/背景1.png",
        BG2: "素材/背景/背景2.jpg",
        IMG2: "素材/背景/图片2.jpg",
        IMG3: "素材/背景/图片3.png",
        IMG4: "素材/背景/图片4.jpg",
        IMG5: "素材/背景/图片5.jpg",
        IMG7: "素材/背景/图片7.jpg",
        IMG8: "素材/背景/图片8.jpg",
        IMG9: "素材/背景/图片9.jpg",
        IMG10: "素材/背景/图片10.jpg",
        IMG11: "素材/背景/图片11.jpg",
        IMG12: "素材/背景/图片12.jpg",
        IMG13: "素材/背景/图片13.jpg",
        IMG14: "素材/背景/图片14.png",
        IMG15: "素材/背景/图片15.png",
        IMG16: "素材/背景/图片16.png",
        IMG17: "素材/背景/图片17.png",
        IMG18: "素材/背景/图片18.png",
        IMG19: "素材/背景/图片19.png",
        IMG20: "素材/背景/图片20.png"
    },
    
    // 角色立绘
    CHARACTERS: {
        PROTAGONIST: "素材/立绘/主角.png",
        MOTHER: "素材/立绘/母亲.png",
        SECURITY: "素材/立绘/保安.png"
    },
    
    // 角色补充立绘
    SUPPORT_CHARACTERS: {
        CHAR222: "../picture/角色补充/222.png",
        CHAR333: "../picture/角色补充/333.png",
        CHAR444: "../picture/角色补充/444.png"
    },
    
    // 音效
    SOUNDS: {
        FOOTSTEP1: "../音效/脚步声1.MP3",
        FOOTSTEP2: "../音效/脚步声2.MP3",
        CLICK: "../音效/咔哒.MP3",
        DOOR_OPEN: "../音效/开门声.MP3",
        DOOR_HANDLE: "../音效/转门把手(1).MP3",
        BANG: "../音效/砰.MP3",
        HORROR_MUSIC: "../音效/恐怖氛围的音乐.m4a",
        SONG_ZHI_MING: "../音效/《志铭》犬儒乐队.mp3"
    },
};

const BG = RESOURCES.BACKGROUNDS;
const CHAR = RESOURCES.CHARACTERS;
const SUPPORT = RESOURCES.SUPPORT_CHARACTERS;
const SFX = RESOURCES.SOUNDS;
var dialogues = [
    // ... (中间的对话数据保持不变，此处省略以节省篇幅) ...
    {
        id:0,
        text: "正月初二，一个普普通通的一天，醒来已经将近中午。",
        name: "",
        saylihui: "",
        backlihui: "",
        background: BG.BG1,
        back: 0,
        next: 1,
    },
    // ... 这里省略 id:1 到 id:274 的内容 ...
    {
        id:275,
        text: "母亲......母亲......",
        name:"我：",
        saylihui: CHAR.PROTAGONIST,
        backlihui: "",
        background: BG.IMG20,
        back: 274,
        next: 600,// 跳转到结尾
    },
];

// 封装安全的获取 localStorage 函数
function getSafeStorageItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.error("无法读取存档数据:", e);
        return null;
    }
}

// 获取原始存储值
var slot1 = getSafeStorageItem("slot1");
var slot2 = getSafeStorageItem("slot2");
var slot3 = getSafeStorageItem("slot3");

/**
 * 严格的安全检查函数：验证ID是否为有效的数组索引
 * 防止原型污染、JSON注入和数组越界访问
 */
function isValidId(idString) {
    // 1. 基础非空检查
    if (idString === null || idString === undefined) return false;
    
    // 2. 类型检查：必须是字符串（localStorage返回通常是string，但防御性编程）
    // 或者是数字类型（如果已被转换）
    if (typeof idString !== 'string' && typeof idString !== 'number') return false;

    // 3. 格式检查：使用正则严格匹配纯数字
    // 这防止了 parseInt 解析像 "12<script>..." 这样的恶意字符串
    // 同时也防止了浮点数或负数符号
    if (!/^\d+$/.test(String(idString))) return false;
    
    // 4. 转换并检查数值范围
    var id = parseInt(idString, 10);
    
    // 确保 id 在 dialogues 数组的有效索引范围内
    // 并且该索引处确实存在数据
    if (id >= 0 && id < dialogues.length && dialogues[id]) {
        return true;
    }
    
    return false;
}

function loadGame1() {
    if (isValidId(slot1)) {
        // 使用安全的整数格式存入 CD
        localStorage.setItem("CD", parseInt(slot1, 10));
        location.href = "../对话/dialogue.html";
    } else {
        alert("没有有效的存档");
    }
}

function loadGame2() {
    if (isValidId(slot2)) {
        localStorage.setItem("CD", parseInt(slot2, 10));
        location.href = "../对话/dialogue.html";
    } else {
        alert("没有有效的存档");
    }
}

function loadGame3() {
    if (isValidId(slot3)) {
        localStorage.setItem("CD", parseInt(slot3, 10));
        location.href = "../对话/dialogue.html";
    } else {
        alert("没有有效的存档");
    }
}

function showMessage() {
    // 针对 Slot 1 的安全渲染
    if (isValidId(slot1)) {
        var id = parseInt(slot1, 10);
        var btnImg = document.getElementById("save1img");
        var btnText = document.getElementById("save1text");
        
        btnImg.style.display = "inline-block";
        // 安全访问属性
        btnImg.src = dialogues[id].background;
        btnText.innerText = dialogues[id].text; // innerText 会自动转义 HTML，防止 XSS
    } else {
        document.getElementById("save1img").style.display = "none";
        document.getElementById("save1text").innerText = "EMPTY";
    }

    // 针对 Slot 2 的安全渲染
    if (isValidId(slot2)) {
        var id = parseInt(slot2, 10);
        var btnImg = document.getElementById("save2img");
        var btnText = document.getElementById("save2text");
        
        btnImg.style.display = "inline-block";
        btnImg.src = dialogues[id].background;
        btnText.innerText = dialogues[id].text;
    } else {
        document.getElementById("save2img").style.display = "none";
        document.getElementById("save2text").innerText = "EMPTY";
    }

    // 针对 Slot 3 的安全渲染
    if (isValidId(slot3)) {
        var id = parseInt(slot3, 10);
        var btnImg = document.getElementById("save3img");
        var btnText = document.getElementById("save3text");
        
        btnImg.style.display = "inline-block";
        btnImg.src = dialogues[id].background;
        btnText.innerText = dialogues[id].text;
    } else {
        document.getElementById("save3img").style.display = "none";
        document.getElementById("save3text").innerText = "EMPTY";
    }
}

function initGame() {
    showMessage();
}

window.addEventListener("load", function () {
    initGame();
});
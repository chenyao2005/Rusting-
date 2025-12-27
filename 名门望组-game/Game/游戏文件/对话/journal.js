// journal.js - 剧情日志系统
// 放置在与 data.js 相同的目录

class JournalSystem {
    constructor() {
        this.entries = [];
        this.loadEntries();
        this.initializeKeyEntries();
    }
    
    loadEntries() {
        const saved = localStorage.getItem("journalEntries");
        if (saved) {
            try {
                this.entries = JSON.parse(saved);
            } catch (e) {
                console.error("解析日志数据失败:", e);
                this.entries = [];
            }
        }
    }
    
    saveEntries() {
        localStorage.setItem("journalEntries", JSON.stringify(this.entries));
    }
    
    initializeKeyEntries() {
        // 预定义关键剧情的日志条目
        const keyEntries = [
            {
                id: 1,
                dialogueId: 0,
                title: "故事开端",
                content: "正月初二，一个普普通通的一天，醒来已经将近中午。",
                type: "event",
                chapter: "第一章: 开端",
                timestamp: new Date().toLocaleString('zh-CN')
            },
            {
                id: 2,
                dialogueId: 1,
                title: "身世背景",
                content: "今年我27岁了，我从小在养父母家长大，对亲生父母没有丝毫的印象。",
                type: "clue",
                chapter: "第一章: 开端",
                timestamp: new Date().toLocaleString('zh-CN')
            },
            {
                id: 3,
                dialogueId: 2,
                title: "当前处境",
                content: "昨天我已经去看过我的养父母了，他们也有自己亲生的孩子，也有自己的生活，所以今天我就回到了自己的公寓了，加之我还没有步入婚姻，所以这就是百无聊赖的一天。",
                type: "event",
                chapter: "第一章: 开端",
                timestamp: new Date().toLocaleString('zh-CN')
            }
        ];
        
        // 检查是否已存在这些条目，避免重复添加
        keyEntries.forEach(entry => {
            if (!this.entries.find(e => e.dialogueId === entry.dialogueId)) {
                this.entries.push(entry);
            }
        });
    }
    
    addEntry(entry) {
        // 检查是否已存在相同对话ID的条目
        const exists = this.entries.some(e => e.dialogueId === entry.dialogueId);
        
        if (!exists) {
            // 自动生成ID和时间戳
            entry.id = this.entries.length > 0 
                ? Math.max(...this.entries.map(e => e.id)) + 1 
                : 1;
            entry.timestamp = new Date().toLocaleString('zh-CN');
            
            this.entries.push(entry);
            this.saveEntries();
            console.log("已记录日志:", entry.title);
        }
    }
    
    addDialogueEntry(dialogueId, dialogueData) {
        // 预定义的关键对话ID和对应的日志信息
        const keyLogs = {
            // 地点类
            5: { title: "冬日街景", type: "location" },
            12: { title: "穿越到1998", type: "location" },
            28: { title: "设计科大楼", type: "location" },
            44: { title: "时间确认", type: "location" },
            59: { title: "父亲办公室外", type: "location" },
            64: { title: "保卫科", type: "location" },
            70: { title: "父亲办公室内", type: "location" },
            73: { title: "破碎的相片", type: "location" },
            122: { title: "母亲住所外", type: "location" },
            134: { title: "见到母亲", type: "location" },
            163: { title: "三号车间外", type: "location" },
            164: { title: "三号车间内部", type: "location" },
            204: { title: "保安房间", type: "location" },
            219: { title: "夜间保安房", type: "location" },
            
            // 线索类
            15: { title: "父亲的工作单位", type: "clue" },
            20: { title: "时间线索", type: "clue" },
            45: { title: "穿越时间确认", type: "clue" },
            48: { title: "工人死亡传闻", type: "clue" },
            53: { title: "父亲身份信息", type: "clue" },
            55: { title: "身世真相", type: "clue" },
            85: { title: "家庭住址", type: "clue" },
            92: { title: "车间命案关联", type: "clue" },
            144: { title: "父亲购置机器", type: "clue" },
            154: { title: "德国机器", type: "clue" },
            168: { title: "发现血迹", type: "clue" },
            191: { title: "保安与工友关系", type: "clue" },
            196: { title: "裁员矛盾", type: "clue" },
            250: { title: "时间矛盾", type: "clue" },
            271: { title: "书籍作者", type: "clue" },
            
            // 对话类
            83: { title: "内心痛苦", type: "dialogue" },
            107: { title: "保安的质问", type: "dialogue" },
            138: { title: "询问母亲", type: "dialogue" },
            140: { title: "母亲的伤痛", type: "dialogue" },
            176: { title: "保安的仇恨", type: "dialogue" },
            236: { title: "质问保安", type: "dialogue" },
            237: { title: "保安的供述", type: "dialogue" },
            
            // 事件类
            58: { title: "决心调查", type: "event" },
            75: { title: "发现父母照片", type: "event" },
            121: { title: "保安袭击", type: "event" },
            135: { title: "伪装身份", type: "event" },
            213: { title: "保安再次袭击", type: "event" },
            262: { title: "母亲修改日志", type: "event" },
            268: { title: "最后一面", type: "event" },
            275: { title: "真相揭露", type: "event" }
        };
        
        // 如果是预定义的关键对话，使用预设信息
        if (keyLogs[dialogueId]) {
            const logInfo = keyLogs[dialogueId];
            const entry = {
                dialogueId: dialogueId,
                title: logInfo.title,
                content: dialogueData.text,
                type: logInfo.type,
                chapter: this.getChapter(dialogueId),
                timestamp: new Date().toLocaleString('zh-CN')
            };
            
            this.addEntry(entry);
            return;
        }
        
        // 对于非关键对话，不记录
    }
    
    getChapter(dialogueId) {
        if (dialogueId < 12) return "第一章: 开端";
        if (dialogueId < 60) return "第二章: 穿越到1998";
        if (dialogueId < 122) return "第三章: 父亲办公室";
        if (dialogueId < 163) return "第四章: 母亲的家";
        if (dialogueId < 203) return "第五章: 三号车间";
        if (dialogueId < 244) return "第六章: 真相逐渐浮现";
        return "第七章: 结局";
    }
    
    getAllEntries() {
        // 按时间倒序返回
        return [...this.entries].sort((a, b) => b.id - a.id);
    }
    
    clearAll() {
        this.entries = [];
        this.saveEntries();
    }
}

// 创建全局日志系统实例
const journalSystem = new JournalSystem();

// 导出函数，用于在其他文件中调用
function addJournalEntry(dialogueId, dialogueData) {
    journalSystem.addDialogueEntry(dialogueId, dialogueData);
}

function openJournal() {
    // 保存当前游戏进度
    const currentDialogue = parseInt(localStorage.getItem("CD")) || 0;
    localStorage.setItem("journalReturnCD", currentDialogue);
    
    // 打开日志页面
    window.location.href = "journal.html";
}

// 自动记录关键对话的函数
function autoRecordDialogue(dialogueId) {
    const dialogue = dialogues.find(d => d.id === dialogueId);
    if (dialogue) {
        addJournalEntry(dialogueId, dialogue);
    }
}

// 在切换对话时检查是否需要记录
function checkAndRecordDialogue(dialogueId) {
    if (dialogues && dialogues[dialogueId]) {
        // 预定义的关键对话ID列表（包含所有类型）
        const keyDialogueIds = [
            // 地点类
            5, 12, 28, 44, 59, 64, 70, 73, 122, 134, 163, 164, 204, 219,
            
            // 线索类
            15, 20, 45, 48, 53, 55, 85, 92, 144, 154, 168, 191, 196, 250, 271,
            
            // 对话类
            83, 107, 138, 140, 176, 236, 237,
            
            // 事件类
            58, 75, 121, 135, 213, 262, 268, 275
        ];
        
        if (keyDialogueIds.includes(dialogueId)) {
            autoRecordDialogue(dialogueId);
        }
    }
}

// 导出函数供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        journalSystem,
        addJournalEntry,
        openJournal,
        autoRecordDialogue,
        checkAndRecordDialogue
    };
}
/**
 * 五子棋游戏逻辑重构版
 * 解决了原有代码认知复杂度过高、全局变量污染的问题
 */

const GAME_CONFIG = {
    cols: 15,
    rows: 15,
    padding: 15,
    cellSize: 30,
    pieceRadius: 13,
    colors: {
        bg: "#5d4c3c",
        black: "#2a2a2a",
        white: "#8b7355"
    },
    scores: {
        my: [0, 200, 4000, 20000, 100000], // 玩家连子分数 (防守)
        ai: [0, 220, 5200, 22000, 200000]  // 电脑连子分数 (进攻)
    }
};

class GomokuGame {
    constructor(canvasId, statusId) {
        this.canvas = document.getElementsByClassName(canvasId)[0];
        this.statusElement = document.getElementById(statusId);
        this.context = this.canvas.getContext("2d");
        
        // 游戏状态
        this.me = true; // true: 玩家(黑), false: 电脑(白)
        this.over = false;
        this.chessboard = [];
        
        // 赢法统计数组
        this.wins = [];
        this.count = 0;
        this.myWin = [];
        this.computerWin = [];

        this.init();
    }

    init() {
        this.initCanvas();
        this.initBoardData();
        this.initWinCombinations();
        this.initWinStats();
        this.bindEvents();
        this.drawChessBoard();
    }

    // 初始化画布样式
    initCanvas() {
        this.context.strokeStyle = GAME_CONFIG.colors.bg;
        this.context.lineWidth = 1.5;
    }

    // 初始化棋盘数据
    initBoardData() {
        for (let i = 0; i < GAME_CONFIG.cols; i++) {
            this.chessboard[i] = [];
            for (let j = 0; j < GAME_CONFIG.rows; j++) {
                this.chessboard[i][j] = 0;
            }
        }
    }

    // 初始化赢法组合 (拆分出的逻辑)
    initWinCombinations() {
        // 初始化三维数组
        for (let i = 0; i < GAME_CONFIG.cols; i++) {
            this.wins[i] = [];
            for (let j = 0; j < GAME_CONFIG.rows; j++) {
                this.wins[i][j] = [];
            }
        }

        // 辅助函数：添加赢法
        const addWin = (x, y, k) => {
            this.wins[x][y][this.count] = true;
        };

        // 横向
        for (let i = 0; i < GAME_CONFIG.rows; i++) {
            for (let j = 0; j < GAME_CONFIG.cols - 4; j++) {
                for (let k = 0; k < 5; k++) addWin(j + k, i);
                this.count++;
            }
        }

        // 纵向
        for (let i = 0; i < GAME_CONFIG.cols; i++) {
            for (let j = 0; j < GAME_CONFIG.rows - 4; j++) {
                for (let k = 0; k < 5; k++) addWin(i, j + k);
                this.count++;
            }
        }

        // 斜向 (\)
        for (let i = 0; i < GAME_CONFIG.cols - 4; i++) {
            for (let j = 0; j < GAME_CONFIG.rows - 4; j++) {
                for (let k = 0; k < 5; k++) addWin(i + k, j + k);
                this.count++;
            }
        }

        // 反斜向 (/)
        for (let i = 0; i < GAME_CONFIG.cols - 4; i++) {
            for (let j = GAME_CONFIG.rows - 1; j > 3; j--) {
                for (let k = 0; k < 5; k++) addWin(i + k, j - k);
                this.count++;
            }
        }
    }

    // 初始化赢法统计
    initWinStats() {
        for (let i = 0; i < this.count; i++) {
            this.myWin[i] = 0;
            this.computerWin[i] = 0;
        }
    }

    // 绘制棋盘网格
    drawChessBoard() {
        const { padding, cellSize, cols, rows } = GAME_CONFIG;
        const endX = padding + (cols - 1) * cellSize;
        const endY = padding + (rows - 1) * cellSize;

        for (let i = 0; i < cols; i++) {
            const pos = padding + i * cellSize;
            
            // 竖线
            this.context.moveTo(pos, padding);
            this.context.lineTo(pos, endY);
            this.context.stroke();
            
            // 横线
            this.context.moveTo(padding, pos);
            this.context.lineTo(endX, pos);
            this.context.stroke();
        }
    }

    // 绑定点击事件
    bindEvents() {
        this.canvas.onclick = (e) => this.handleBoardClick(e);
    }

    // 处理点击逻辑
    handleBoardClick(e) {
        if (this.over || !this.me) return;

        const x = e.offsetX;
        const y = e.offsetY;
        const i = Math.floor(x / GAME_CONFIG.cellSize);
        const j = Math.floor(y / GAME_CONFIG.cellSize);

        if (this.chessboard[i][j] === 0) {
            this.humanMove(i, j);
        } else {
            alert("此位置已有棋子，请选择其他位置");
        }
    }

    // 玩家落子
    humanMove(i, j) {
        this.executeMove(i, j, 1); // 1 代表玩家
        
        if (this.checkWin(i, j, this.myWin, 5)) {
            this.statusElement.innerHTML = "🎉 恭喜你赢了！！！ 🎉";
            this.gameOver(true);
        } else if (!this.over) {
            this.toggleTurn(false);
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    // 电脑AI入口
    makeComputerMove() {
        if (this.over) return;
        
        const bestMove = this.findBestMove();
        const { x, y } = bestMove;

        this.executeMove(x, y, 2); // 2 代表电脑

        if (this.checkWin(x, y, this.computerWin, 5)) {
            this.statusElement.innerHTML = "🤖 抱歉计算机赢了！！ 🤖";
            this.over = true;
        } else if (!this.over) {
            this.toggleTurn(true);
        }
    }

    // AI核心：寻找最佳落子点 (降低了复杂度)
    findBestMove() {
        let maxScore = 0;
        let bestPoint = { x: 0, y: 0 };

        for (let i = 0; i < GAME_CONFIG.cols; i++) {
            for (let j = 0; j < GAME_CONFIG.rows; j++) {
                if (this.chessboard[i][j] === 0) {
                    // 获取当前点的得分
                    const score = this.calculateSpotScore(i, j);
                    
                    // 更新最佳位置
                    if (score > maxScore) {
                        maxScore = score;
                        bestPoint = { x: i, y: j };
                    }
                }
            }
        }
        return bestPoint;
    }

    // 计算单个坐标点的分数 (从AI逻辑中剥离)
    calculateSpotScore(i, j) {
        let myScore = 0;
        let computerScore = 0;

        for (let k = 0; k < this.count; k++) {
            if (this.wins[i][j][k]) {
                // 计算防守分数 (拦截玩家)
                if (this.myWin[k] > 0 && this.myWin[k] < 5) {
                    myScore += GAME_CONFIG.scores.my[this.myWin[k]];
                }
                // 计算进攻分数 (电脑连子)
                if (this.computerWin[k] > 0 && this.computerWin[k] < 5) {
                    computerScore += GAME_CONFIG.scores.ai[this.computerWin[k]];
                }
            }
        }
        
        // 简单的加权算法：综合考虑进攻和防守
        // 原有逻辑比较依赖 max 值的顺序更新，这里将其量化为一个总分返回
        // 注意：原代码的逻辑是 "先看我方最高分，如果一样再看电脑最高分"，这里简化为总分比较
        // 为了保持原版AI的激进程度，给ComputerScore略微更高的权重 (已在CONFIG中体现)
        return myScore + computerScore;
    }

    // 执行落子动作 (绘图 + 更新数据)
    executeMove(i, j, playerType) {
        this.oneStep(i, j, playerType === 1);
        this.chessboard[i][j] = playerType;
        this.updateWinStats(i, j, playerType);
    }

    // 更新赢法统计
    updateWinStats(i, j, playerType) {
        for (let k = 0; k < this.count; k++) {
            if (this.wins[i][j][k]) {
                if (playerType === 1) {
                    this.myWin[k]++;
                    this.computerWin[k] = 6; // 设置异常值，使该赢法失效
                } else {
                    this.computerWin[k]++;
                    this.myWin[k] = 6;
                }
            }
        }
    }

    // 检查是否胜利
    checkWin(i, j, winArray, threshold) {
        for (let k = 0; k < this.count; k++) {
            if (this.wins[i][j][k] && winArray[k] === threshold) {
                return true;
            }
        }
        return false;
    }

    // 绘制单个棋子
    oneStep(i, j, isMe) {
        this.context.beginPath();
        this.context.arc(
            GAME_CONFIG.padding + i * GAME_CONFIG.cellSize, 
            GAME_CONFIG.padding + j * GAME_CONFIG.cellSize, 
            GAME_CONFIG.pieceRadius, 0, 2 * Math.PI
        );
        this.context.closePath();

        const color = isMe ? GAME_CONFIG.colors.black : GAME_CONFIG.colors.white;
        this.context.shadowColor = isMe ? "rgba(0, 0, 0, 0.8)" : "rgba(139, 115, 85, 0.8)";
        
        this.context.shadowBlur = 6;
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;
        this.context.fillStyle = color;
        this.context.fill();
        
        // 重置阴影，避免影响网格
        this.context.shadowColor = "transparent";
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }

    // 切换回合状态
    toggleTurn(isPlayerTurn) {
        this.me = isPlayerTurn;
        this.statusElement.innerHTML = isPlayerTurn 
            ? "-- 轮到您下棋 (黑子) --" 
            : "-- 计算机思考中... --";
    }

    // 游戏结束处理
    gameOver(playerWon) {
        this.over = true;
        if (playerWon) {
            localStorage.setItem("CD", 163);
            setTimeout(() => {
                location.href = "../对话/dialogue.html";
            }, 2000);
        }
    }
}

// 页面加载完成后初始化游戏
window.onload = function() {
    new GomokuGame("chess", "gameStatus");
};

// 保留原有的跳过函数 (供HTML按钮调用)
function skip() {
    localStorage.setItem("CD", 163);
    location.href = "../对话/dialogue.html";
}
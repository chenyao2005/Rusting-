// 获取DOM元素
var chess = document.getElementsByClassName("chess")[0];
var statusElement = document.getElementById("gameStatus");
var context = chess.getContext("2d");

// 初始化画布样式
context.strokeStyle = "#5d4c3c";
context.lineWidth = 1.5;

// 游戏状态变量
var me = true;
var over = false;
var chessboard = [];
var wins = [];
var myWin = [];
var computerWin = [];
var count = 0;

// 页面加载完成后绘制棋盘
window.onload = function() {
    drawChessBoard();
}

// 绘制棋盘网格
function drawChessBoard() {
    for(var i = 0; i < 15; i++) {
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
        
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
    }
}

// 初始化赢法数组
for(var i = 0; i < 15; i++) {
    wins[i] = [];
    for(var j = 0; j < 15; j++) {
        wins[i][j] = []
    }
}

// 统计所有横向赢法
for(var i = 0; i < 15; i++) {
    for(var j = 0; j < 11; j++) {
        for(var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

// 统计所有纵向赢法
for(var i = 0; i < 15; i++) {
    for(var j = 0; j < 11; j++) {
        for(var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

// 统计所有斜向赢法
for(var i = 0; i < 11; i++) {
    for(var j = 0; j < 11; j++) {
        for(var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

// 统计所有反斜向赢法
for(var i = 0; i < 11; i++) {
    for(var j = 14; j > 3; j--) {
        for(var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

// 初始化棋盘数据
for(var i = 0; i < 15; i++) {
    chessboard[i] = [];
    for(var j = 0; j < 15; j++) {
        chessboard[i][j] = 0;
    }
}

// 初始化赢法统计数组
for(var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

// 棋盘点击事件
chess.onclick = function(e) {
    if(over || !me) {
        return;
    }
    
    var x = e.offsetX;
    var y = e.offsetY;
    
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    
    if(chessboard[i][j] == 0) {
        oneStep(i, j, me);
        chessboard[i][j] = 1;
        
        for(var k = 0; k < count; k++) {
            if(wins[i][j][k]) {
                myWin[k]++;
                
                if(myWin[k] == 5) {
                    statusElement.innerHTML = "🎉 恭喜你赢了！！！ 🎉";
                    over = true;
                    localStorage.setItem("CD", 163);
                    setTimeout(() => {
                        location.href = "../对话/dialogue.html";
                    }, 2000);
                }
            }
        }
    } else {
        alert("此位置已有棋子，请选择其他位置");
        return;
    }
    
    if(!over) {
        me = !me;
        statusElement.innerHTML = me ? "-- 轮到您下棋 (黑子) --" : "-- 计算机思考中... --";
    }
    
    if(!over && !me) {
        setTimeout(computerAI, 500);
    }
}

// 计算机AI逻辑
function computerAI() {
    var myScore = [];
    var computerScore = [];
    
    for(var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        
        for(var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    
    var max = 0;
    var x = 0, y = 0;
    
    for(var i = 0; i < 15; i++) {
        for(var j = 0; j < 15; j++) {
            if(chessboard[i][j] == 0) {
                for(var k = 0; k < count; k++) {
                    if(wins[i][j][k]) {
                        if(myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if(myWin[k] == 2) {
                            myScore[i][j] += 4000;
                        } else if(myWin[k] == 3) {
                            myScore[i][j] += 20000;
                        } else if(myWin[k] == 4) {
                            myScore[i][j] += 100000;
                        }
                        
                        if(computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if(computerWin[k] == 2) {
                            computerScore[i][j] += 5200;
                        } else if(computerWin[k] == 3) {
                            computerScore[i][j] += 22000;
                        } else if(computerWin[k] == 4) {
                            computerScore[i][j] += 200000;
                        }
                    }
                }
                
                if(myScore[i][j] > max) {
                    max = myScore[i][j];
                    x = i;
                    y = j;
                } else if(myScore[i][j] == max) {
                    if(computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        x = i;
                        y = j;
                    }
                }
                
                if(computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    x = i;
                    y = j;
                } else if(computerScore[i][j] == max) {
                    if(myScore[i][j] > max) {
                        max = myScore[i][j];
                        x = i;
                        y = j;
                    }
                }
            }
        }
    }
    
    oneStep(x, y, me);
    chessboard[x][y] = 2;
    
    for(var k = 0; k < count; k++) {
        if(wins[x][y][k]) {
            computerWin[k] += 1;
            if(computerWin[k] == 5) {
                statusElement.innerHTML = "🤖 抱歉计算机赢了！！ 🤖";
                over = true;
            }
        }
    }
    
    if(!over) {
        me = !me;
        statusElement.innerHTML = me ? "-- 轮到您下棋 (黑子) --" : "-- 计算机思考中... --";
    }
}

// 绘制棋子
function oneStep(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    
    var yanse;
    if(me) {
        yanse = "#2a2a2a";
        context.shadowColor = "rgba(0, 0, 0, 0.8)";
    } else {
        yanse = "#8b7355";
        context.shadowColor = "rgba(139, 115, 85, 0.8)";
    }
    
    context.shadowBlur = 6;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.fillStyle = yanse;
    context.fill();
    
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
}

// 跳过游戏功能
function skip() {
    localStorage.setItem("CD", 163);
    location.href = "../对话/dialogue.html";
}
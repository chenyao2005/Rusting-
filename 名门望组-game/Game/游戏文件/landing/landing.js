// 初始化本地存储
function initializeLocalStorage() {
    if (!localStorage.getItem("volume")) {
        localStorage.setItem("volume", 50);
    }
    if (!localStorage.getItem("textSpeed")) {
        localStorage.setItem("textSpeed", 50);
    }
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }
}

// 清理可能存在的恶意数据
function sanitizeExistingData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 清理用户数据中的危险字符
    const sanitizedUsers = users.map(user => ({
        username: user.username?.replace(/[<>'"&\\\/]/g, '') || '',
        password: user.password || ''
    })).filter(user => user.username.length >= 3 && user.password.length >= 6);
    
    localStorage.setItem('users', JSON.stringify(sanitizedUsers));
}

// 输入验证函数（也可在HTML中定义，这里提供备用）
function sanitizeInput(input) {
    return input.replace(/[<>'"&\\\/]/g, '');
}

// 用户名验证
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/;
    return usernameRegex.test(username);
}

// 密码验证
function validatePassword(password) {
    // 密码长度至少6位
    if (password.length < 6) {
        return false;
    }
    
    // 检查是否包含危险字符
    const dangerousChars = /[<>'"&\\\/]/;
    return !dangerousChars.test(password);
}

// 执行初始化
initializeLocalStorage();
sanitizeExistingData();

// 添加额外的安全防护
document.addEventListener('DOMContentLoaded', function() {
    // 防止右键检查（生产环境可选）
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // 防止F12键（仅增加难度，不能完全阻止，生产环境可选）
    document.addEventListener('keydown', function(e) {
        // F12键
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (Chrome开发者工具)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Chrome开发者工具 - 控制台)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (查看源代码)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });
    
    console.log('安全初始化完成');
});

// 导出函数供HTML使用（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeInput,
        validateUsername,
        validatePassword,
        initializeLocalStorage,
        sanitizeExistingData
    };
}
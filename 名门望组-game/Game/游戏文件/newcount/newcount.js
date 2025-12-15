// newcount.js (已修复)

/**
 * 清理输入字符串，移除潜在的危险字符，防止XSS攻击。
 * @param {string} input - 用户输入的字符串。
 * @returns {string} - 清理后的安全字符串。
 */
function sanitizeInput(input) {
    // 移除可能用于注入HTML或脚本的字符
    return input.replace(/[<>'"&\\\/]/g, '');
}

/**
 * 处理用户注册。
 * 对输入进行清理和验证，然后存储新用户信息。
 */
function register() {
    // 1. 从DOM获取原始输入值
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const confirmPasswordInput = document.getElementById('confirm-password').value; // 假设有确认密码字段

    // 2.【关键修复】立即清理所有输入，防止XSS
    const sanitizedUsername = sanitizeInput(usernameInput);
    const sanitizedPassword = sanitizeInput(passwordInput);
    const sanitizedConfirmPassword = sanitizeInput(confirmPasswordInput);

    // 3. 对清理后的数据进行业务逻辑验证
    if (sanitizedUsername.length < 3) {
        alert("用户名长度至少为3位！");
        return;
    }
    if (sanitizedPassword.length < 6) {
        alert("密码长度至少为6位！");
        return;
    }
    if (sanitizedPassword !== sanitizedConfirmPassword) {
        alert("两次输入的密码不一致！");
        return;
    }

    // 从 localStorage 获取现有用户列表
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // 检查用户名是否已存在
    if (users.some(user => user.username === sanitizedUsername)) {
        alert("该用户名已被注册！");
        return;
    }

    // 4. 将清理后的安全数据添加到用户列表并存储
    users.push({
        username: sanitizedUsername,
        password: sanitizedPassword // 实际项目中密码应加密存储
    });
    localStorage.setItem("users", JSON.stringify(users));

    alert("注册成功！现在您可以登录了。");
    // 可选：注册成功后跳转到登录页面或清空表单
    window.location.href = 'login.html'; // 假设登录页面是 login.html
}

/**
 * 处理用户登录。
 * 同样对输入进行清理，然后进行验证。
 */
function login() {
    // 1. 获取并清理输入
    const sanitizedUsername = sanitizeInput(document.getElementById('username').value);
    const sanitizedPassword = sanitizeInput(document.getElementById('password').value);

    // 2. 验证输入
    if (!sanitizedUsername || !sanitizedPassword) {
        alert("请输入用户名和密码！");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // 查找用户
    const foundUser = users.find(user => user.username === sanitizedUsername && user.password === sanitizedPassword);

    if (foundUser) {
        alert("登录成功！");
        // 登录成功后的逻辑，例如保存登录状态并跳转
        sessionStorage.setItem('loggedInUser', sanitizedUsername);
        window.location.href = '../homepage/home.html'; // 跳转到主页
    } else {
        alert("用户名或密码错误！");
    }
}
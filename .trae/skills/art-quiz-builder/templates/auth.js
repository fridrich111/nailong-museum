// AuthManager - Supabase 认证管理模块（兼容夸克浏览器版本）
var AuthManager = (function() {
    var currentUser = null;
    var currentUsername = null;

    // 显示登录弹窗
    function showModal() {
        var modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('show');
            clearMessages();
            showLogin();
        }
    }

    // 隐藏登录弹窗
    function hideModal() {
        var modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('show');
            clearMessages();
        }
    }

    // 清除提示信息
    function clearMessages() {
        var errorMsg = document.getElementById('auth-error');
        var successMsg = document.getElementById('auth-success');
        if (errorMsg) errorMsg.textContent = '';
        if (successMsg) successMsg.textContent = '';
    }

    // 显示错误信息
    function showError(msg) {
        var el = document.getElementById('auth-error');
        var successEl = document.getElementById('auth-success');
        if (el) el.textContent = msg;
        if (successEl) successEl.textContent = '';
    }

    // 显示成功信息
    function showSuccess(msg) {
        var el = document.getElementById('auth-success');
        var errorEl = document.getElementById('auth-error');
        if (el) el.textContent = msg;
        if (errorEl) errorEl.textContent = '';
    }

    // 显示加载状态
    function setLoading(loading) {
        var btns = document.querySelectorAll('.auth-submit-btn');
        for (var i = 0; i < btns.length; i++) {
            if (loading) {
                btns[i].disabled = true;
                btns[i].classList.add('auth-loading');
            } else {
                btns[i].disabled = false;
                btns[i].classList.remove('auth-loading');
            }
        }
    }

    // 切换到登录表单
    function showLogin() {
        var loginForm = document.getElementById('login-form');
        var registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        clearMessages();
    }

    // 切换到注册表单
    function showRegister() {
        var loginForm = document.getElementById('login-form');
        var registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        clearMessages();
    }

    // 处理登录（使用 Promise 链式调用，兼容性更好）
    function handleLogin() {
        var email = document.getElementById('login-email').value.trim();
        var password = document.getElementById('login-password').value;

        if (!email || !password) {
            showError('请填写邮箱和密码');
            return;
        }

        setLoading(true);
        clearMessages();

        // 设置超时
        var timeoutId = setTimeout(function() {
            setLoading(false);
            showError('登录超时，请检查网络后重试');
        }, 15000);

        supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        }).then(function(result) {
            clearTimeout(timeoutId);
            console.log('Login result:', result);

            if (result.error) {
                setLoading(false);
                var msg = result.error.message || '';
                if (msg.indexOf('Invalid login credentials') !== -1) {
                    showError('邮箱或密码错误，或邮箱尚未验证');
                } else if (msg.indexOf('Email not confirmed') !== -1) {
                    showError('邮箱尚未验证，请先查收确认邮件');
                } else if (msg.indexOf('Too many requests') !== -1) {
                    showError('请求过于频繁，请稍后再试');
                } else {
                    showError('登录失败: ' + msg);
                }
                return;
            }

            if (result.data && result.data.user) {
                currentUser = result.data.user;
                loadUsername().then(function() {
                    setLoading(false);
                    updateUI();
                    hideModal();
                    showSuccess('登录成功！');
                }).catch(function() {
                    setLoading(false);
                    updateUI();
                    hideModal();
                    showSuccess('登录成功！');
                });
            } else {
                setLoading(false);
                showError('登录失败，请重试');
            }
        }).catch(function(err) {
            clearTimeout(timeoutId);
            setLoading(false);
            console.error('Login error:', err);
            if (err.message && err.message.indexOf('fetch') !== -1) {
                showError('网络错误，请检查网络连接');
            } else {
                showError('登录失败: ' + (err.message || '请稍后再试'));
            }
        });
    }

    // 处理注册
    function handleRegister() {
        var username = document.getElementById('register-username').value.trim();
        var email = document.getElementById('register-email').value.trim();
        var password = document.getElementById('register-password').value;
        var confirmPassword = document.getElementById('register-confirm-password').value;

        if (!username || !email || !password || !confirmPassword) {
            showError('请填写所有字段');
            return;
        }

        if (password.length < 6) {
            showError('密码至少6位');
            return;
        }

        if (password !== confirmPassword) {
            showError('两次密码不一致');
            return;
        }

        setLoading(true);
        clearMessages();

        var timeoutId = setTimeout(function() {
            setLoading(false);
            showError('注册超时，请检查网络后重试');
        }, 15000);

        supabaseClient.auth.signUp({
            email: email,
            password: password
        }).then(function(result) {
            clearTimeout(timeoutId);
            console.log('Register result:', result);

            if (result.error) {
                setLoading(false);
                var msg = result.error.message || '';
                if (msg.indexOf('already registered') !== -1) {
                    showError('该邮箱已被注册');
                } else if (msg.indexOf('password') !== -1) {
                    showError('密码强度不够，至少6位');
                } else {
                    showError('注册失败: ' + msg);
                }
                return;
            }

            var user = result.data && result.data.user;
            if (user) {
                supabaseClient.from('profiles').insert({
                    id: user.id,
                    username: username
                }).then(function(profileResult) {
                    if (profileResult.error) {
                        console.error('Profile save error:', profileResult.error);
                    }
                    currentUser = user;
                    currentUsername = username;
                    setLoading(false);
                    updateUI();
                    hideModal();
                    showSuccess('注册成功！');
                }).catch(function(err) {
                    console.error('Profile save error:', err);
                    currentUser = user;
                    currentUsername = username;
                    setLoading(false);
                    updateUI();
                    hideModal();
                    showSuccess('注册成功！');
                });
            } else {
                setLoading(false);
                showError('注册失败，请重试');
            }
        }).catch(function(err) {
            clearTimeout(timeoutId);
            setLoading(false);
            console.error('Register error:', err);
            if (err.message && err.message.indexOf('fetch') !== -1) {
                showError('网络错误，请检查网络连接');
            } else {
                showError('注册失败: ' + (err.message || '请稍后再试'));
            }
        });
    }

    // 处理退出登录
    function handleLogout() {
        supabaseClient.auth.signOut().then(function() {
            currentUser = null;
            currentUsername = null;
            updateUI();
        }).catch(function(err) {
            console.error('Logout error:', err);
        });
    }

    // 加载用户名
    function loadUsername() {
        return new Promise(function(resolve, reject) {
            if (!currentUser) {
                resolve();
                return;
            }
            supabaseClient.from('profiles')
                .select('username')
                .eq('id', currentUser.id)
                .single()
                .then(function(result) {
                    if (result.data && result.data.username) {
                        currentUsername = result.data.username;
                    } else {
                        currentUsername = currentUser.email.split('@')[0];
                    }
                    resolve();
                })
                .catch(function(err) {
                    currentUsername = currentUser.email.split('@')[0];
                    console.error('Load username error:', err);
                    resolve();
                });
        });
    }

    // 检查会话状态
    function checkSession() {
        supabaseClient.auth.getSession().then(function(result) {
            if (result.data && result.data.session) {
                currentUser = result.data.session.user;
                loadUsername().then(function() {
                    updateUI();
                }).catch(function() {
                    updateUI();
                });
            } else {
                updateUI();
            }
        }).catch(function(err) {
            console.error('Check session error:', err);
            updateUI();
        });
    }

    // 更新UI显示
    function updateUI() {
        var userInfo = document.getElementById('user-info');
        var guestInfo = document.getElementById('guest-info');
        var usernameSpan = document.querySelector('.username');

        if (currentUser) {
            if (userInfo) userInfo.style.display = 'flex';
            if (guestInfo) guestInfo.style.display = 'none';
            if (usernameSpan) usernameSpan.textContent = currentUsername || currentUser.email;
        } else {
            if (userInfo) userInfo.style.display = 'none';
            if (guestInfo) guestInfo.style.display = 'block';
        }
    }

    // 初始化事件绑定
    function init() {
        console.log('AuthManager init...');

        var closeBtn = document.querySelector('.auth-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                hideModal();
            });
        }

        var modal = document.getElementById('auth-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    hideModal();
                }
            });
        }

        var switchToRegister = document.getElementById('switch-to-register');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', function(e) {
                e.preventDefault();
                showRegister();
            });
        }

        var switchToLogin = document.getElementById('switch-to-login');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                showLogin();
            });
        }

        var loginSubmit = document.getElementById('login-submit');
        if (loginSubmit) {
            loginSubmit.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }

        var registerSubmit = document.getElementById('register-submit');
        if (registerSubmit) {
            registerSubmit.addEventListener('click', function(e) {
                e.preventDefault();
                handleRegister();
            });
        }

        var loginEmail = document.getElementById('login-email');
        var loginPassword = document.getElementById('login-password');
        if (loginEmail) {
            loginEmail.addEventListener('keydown', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    handleLogin();
                }
            });
        }
        if (loginPassword) {
            loginPassword.addEventListener('keydown', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    handleLogin();
                }
            });
        }

        var registerInputs = document.querySelectorAll('#register-form input');
        for (var i = 0; i < registerInputs.length; i++) {
            registerInputs[i].addEventListener('keydown', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    handleRegister();
                }
            });
        }

        try {
            supabaseClient.auth.onAuthStateChange(function(event, session) {
                if (event === 'SIGNED_IN' && session) {
                    currentUser = session.user;
                    loadUsername().then(function() {
                        updateUI();
                    });
                } else if (event === 'SIGNED_OUT') {
                    currentUser = null;
                    currentUsername = null;
                    updateUI();
                }
            });
        } catch (e) {
            console.error('onAuthStateChange error:', e);
        }

        checkSession();
        console.log('AuthManager init done');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        showModal: showModal,
        hideModal: hideModal,
        showLogin: showLogin,
        showRegister: showRegister,
        handleLogin: handleLogin,
        handleRegister: handleRegister,
        handleLogout: handleLogout,
        checkSession: checkSession,
        updateUI: updateUI,
        get currentUser() { return currentUser; },
        get currentUsername() { return currentUsername; }
    };
})();

var authManager = AuthManager;

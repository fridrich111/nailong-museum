// main.js - 奶龙美术馆首页核心逻辑

// 检测是否为移动设备
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// 自动播放背景音乐（音量较小）
window.addEventListener('load', function() {
    // 移动端不自动播放音频
    if (isMobile) {
        console.log('移动设备 detected，跳过音频自动加载');
        return;
    }
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) return;
    
    bgMusic.volume = 0.15; // 设置音量为15%

    // 尝试自动播放
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(function(error) {
            // 自动播放被阻止，等待用户交互
            console.log('自动播放被阻止，等待用户交互');
        });
    }
});

// 音乐开关
function toggleAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const audioControl = document.getElementById('audioControl');
    if (!bgMusic || !audioControl) return;

    if (bgMusic.paused) {
        bgMusic.play();
        audioControl.textContent = '🎵';
        audioControl.classList.remove('muted');
    } else {
        bgMusic.pause();
        audioControl.textContent = '🔇';
        audioControl.classList.add('muted');
    }
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(err) {
            console.log('全屏模式被拒绝:', err);
        });
        localStorage.setItem('wasFullscreen', 'true');
    } else {
        document.exitFullscreen();
        localStorage.removeItem('wasFullscreen');
    }
}

// 页面加载时恢复全屏状态
if (localStorage.getItem('wasFullscreen') === 'true') {
    document.addEventListener('click', function restoreFS() {
        document.documentElement.requestFullscreen().catch(function() {});
        localStorage.removeItem('wasFullscreen');
        document.removeEventListener('click', restoreFS);
    }, { once: true });
}

// 开始答题
function startQuiz() {
    localStorage.setItem('currentQuestion', '0');
    localStorage.setItem('score', '0');
    window.location.href = 'select-quiz.html';
}

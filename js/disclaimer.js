// disclaimer.js - 声明弹窗逻辑

(function() {
    var modal = document.getElementById('disclaimer-modal');
    var agreeBtn = document.getElementById('disclaimer-agree');
    
    if (!modal || !agreeBtn) return;
    
    // 每次访问都显示声明弹窗
    agreeBtn.addEventListener('click', function() {
        modal.classList.add('hidden');
    });
})();

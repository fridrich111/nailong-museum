// submission.js - 投稿功能逻辑

var selectedFile = null;

function openSubmissionPage() {
    var user = null;
    if (typeof authManager !== 'undefined') {
        user = authManager.currentUser;
    }
    if (!user) {
        if (typeof authManager !== 'undefined') {
            authManager.showModal();
        }
        return;
    }
    document.getElementById('submission-modal').style.display = 'flex';
}

function closeSubmissionModal() {
    document.getElementById('submission-modal').style.display = 'none';
}

// 文件选择处理
document.addEventListener('DOMContentLoaded', function() {
    var imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showSubmitMsg('请上传图片文件', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showSubmitMsg('图片大小不能超过5MB', 'error');
                return;
            }
            selectedFile = file;
            var reader = new FileReader();
            reader.onload = function(ev) {
                document.getElementById('previewImage').src = ev.target.result;
                document.getElementById('previewImage').style.display = 'block';
                document.getElementById('uploadPlaceholder').style.display = 'none';
                document.getElementById('removeImage').style.display = 'block';
                validateSubmitForm();
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 表单输入验证
    var originalTitle = document.getElementById('originalTitle');
    if (originalTitle) {
        originalTitle.addEventListener('input', validateSubmitForm);
    }
});

function clearImage() {
    selectedFile = null;
    document.getElementById('imageInput').value = '';
    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('uploadPlaceholder').style.display = 'block';
    document.getElementById('removeImage').style.display = 'none';
    validateSubmitForm();
}

function validateSubmitForm() {
    var hasImage = !!selectedFile;
    var hasTitle = document.getElementById('originalTitle').value.trim() !== '';
    document.getElementById('submitArtworkBtn').disabled = !(hasImage && hasTitle);
}

function submitArtwork() {
    var btn = document.getElementById('submitArtworkBtn');
    btn.disabled = true;
    btn.textContent = '上传中...';

    var user = authManager.currentUser;
    if (!user) {
        showSubmitMsg('请先登录', 'error');
        btn.disabled = false;
        btn.textContent = '提交投稿';
        return;
    }

    var title = document.getElementById('originalTitle').value.trim();
    var artist = document.getElementById('originalArtist').value.trim();

    if (!selectedFile) {
        showSubmitMsg('请选择图片', 'error');
        btn.disabled = false;
        btn.textContent = '提交投稿';
        return;
    }
    if (!title) {
        showSubmitMsg('请填写原画名称', 'error');
        btn.disabled = false;
        btn.textContent = '提交投稿';
        return;
    }

    var fileExt = selectedFile.name.split('.').pop();
    var fileName = Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.' + fileExt;
    var filePath = 'nailong/' + fileName;

    // 设置超时
    var timeoutId = setTimeout(function() {
        showSubmitMsg('上传超时，请重试', 'error');
        btn.disabled = false;
        btn.textContent = '提交投稿';
    }, 30000);

    // 上传图片
    supabaseClient.storage.from('paintings').upload(filePath, selectedFile).then(function(uploadResult) {
        if (uploadResult.error) {
            clearTimeout(timeoutId);
            console.error('Storage upload error:', uploadResult.error);
            showSubmitMsg('图片上传失败: ' + (uploadResult.error.message || '请检查Storage配置'), 'error');
            btn.disabled = false;
            btn.textContent = '提交投稿';
            return;
        }

        // 获取公开URL
        var urlResult = supabaseClient.storage.from('paintings').getPublicUrl(filePath);
        if (!urlResult.data || !urlResult.data.publicUrl) {
            clearTimeout(timeoutId);
            showSubmitMsg('获取图片URL失败', 'error');
            btn.disabled = false;
            btn.textContent = '提交投稿';
            return;
        }

        var publicUrl = urlResult.data.publicUrl;

        // 保存到数据库
        return supabaseClient.from('submissions').insert({
            user_id: user.id,
            image_url: publicUrl,
            original_title: title,
            original_artist: artist || null,
            status: 'pending'
        });
    }).then(function(dbResult) {
        clearTimeout(timeoutId);
        if (dbResult && dbResult.error) {
            console.error('DB insert error:', dbResult.error);
            showSubmitMsg('保存投稿记录失败: ' + (dbResult.error.message || '请检查数据库配置'), 'error');
            btn.disabled = false;
            btn.textContent = '提交投稿';
            return;
        }

        showSubmitMsg('投稿成功！等待审核中...', 'success');
        selectedFile = null;
        document.getElementById('originalTitle').value = '';
        document.getElementById('originalArtist').value = '';
        document.getElementById('submitterName').value = '';
        clearImage();

        setTimeout(closeSubmissionModal, 2000);
    }).catch(function(error) {
        clearTimeout(timeoutId);
        console.error('投稿失败:', error);
        showSubmitMsg('投稿失败: ' + (error.message || '请重试'), 'error');
        btn.disabled = false;
        btn.textContent = '提交投稿';
    });
}

function showSubmitMsg(text, type) {
    var el = document.getElementById('submitMessage');
    el.textContent = text;
    el.className = 'submit-message ' + type;
    setTimeout(function() {
        el.textContent = '';
        el.className = 'submit-message';
    }, 5000);
}

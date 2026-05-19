// 投稿功能
class SubmissionManager {
  constructor() {
    this.selectedFile = null;
    this.init();
  }

  init() {
    // 上传区域点击
    document.getElementById('uploadArea').addEventListener('click', () => {
      document.getElementById('imageInput').click();
    });

    // 文件选择
    document.getElementById('imageInput').addEventListener('change', (e) => {
      this.handleFileSelect(e.target.files[0]);
    });

    // 删除图片
    document.getElementById('removeImage').addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearImage();
    });

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', () => {
      this.handleSubmit();
    });

    // 表单输入监听（验证）
    ['originalTitle', 'originalArtist'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        this.validateForm();
      });
    });
  }

  handleFileSelect(file) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      this.showMessage('请上传图片文件', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('图片大小不能超过5MB', 'error');
      return;
    }

    this.selectedFile = file;
    
    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewImage').src = e.target.result;
      document.getElementById('previewImage').style.display = 'block';
      document.getElementById('uploadPlaceholder').style.display = 'none';
      document.getElementById('removeImage').style.display = 'block';
      this.validateForm();
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.selectedFile = null;
    document.getElementById('imageInput').value = '';
    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('uploadPlaceholder').style.display = 'block';
    document.getElementById('removeImage').style.display = 'none';
    this.validateForm();
  }

  validateForm() {
    const hasImage = !!this.selectedFile;
    const hasTitle = document.getElementById('originalTitle').value.trim() !== '';
    document.getElementById('submitBtn').disabled = !(hasImage && hasTitle);
  }

  async handleSubmit() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '上传中...';

    try {
      const user = authManager.currentUser;
      if (!user) {
        throw new Error('请先登录');
      }

      const title = document.getElementById('originalTitle').value.trim();
      const artist = document.getElementById('originalArtist').value.trim();

      // 1. 上传图片到 Storage
      const fileExt = this.selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabaseClient
        .storage
        .from('submissions')
        .upload(filePath, this.selectedFile);

      if (uploadError) throw uploadError;

      // 2. 获取图片公开 URL
      const { data: urlData } = supabaseClient
        .storage
        .from('submissions')
        .getPublicUrl(filePath);

      // 3. 保存投稿信息到数据库
      const { error: dbError } = await supabaseClient
        .from('submissions')
        .insert({
          user_id: user.id,
          image_url: urlData.publicUrl,
          original_title: title,
          original_artist: artist || null,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // 4. 成功提示
      this.showMessage('投稿成功！等待审核中...', 'success');
      this.clearForm();
      loadMySubmissions(); // 刷新列表

    } catch (error) {
      console.error('投稿失败:', error);
      this.showMessage('投稿失败: ' + error.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '提交投稿';
    }
  }

  clearForm() {
    this.clearImage();
    document.getElementById('originalTitle').value = '';
    document.getElementById('originalArtist').value = '';
  }

  showMessage(text, type) {
    const msgEl = document.getElementById('submitMessage');
    msgEl.textContent = text;
    msgEl.className = 'submit-message ' + type;
    setTimeout(() => {
      msgEl.textContent = '';
      msgEl.className = 'submit-message';
    }, 5000);
  }
}

// 加载用户的投稿列表
async function loadMySubmissions() {
  const user = authManager.currentUser;
  if (!user) return;

  const listEl = document.getElementById('submissionsList');
  listEl.innerHTML = '<p class="loading-text">加载中...</p>';

  try {
    const { data, error } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      listEl.innerHTML = '<p class="empty-text">暂无投稿</p>';
      return;
    }

    listEl.innerHTML = data.map(sub => `
      <div class="submission-item">
        <img src="${sub.image_url}" alt="投稿图片">
        <div class="submission-info">
          <p class="submission-title">${sub.original_title}</p>
          ${sub.original_artist ? `<p class="submission-artist">${sub.original_artist}</p>` : ''}
          <span class="submission-status ${sub.status}">${sub.status === 'pending' ? '审核中' : sub.status === 'approved' ? '已通过' : '已拒绝'}</span>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('加载投稿失败:', error);
    listEl.innerHTML = '<p class="error-text">加载失败</p>';
  }
}

// 初始化
const submissionManager = new SubmissionManager();

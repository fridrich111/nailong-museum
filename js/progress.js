// 答题进度管理
class ProgressManager {
  constructor() {
    this.currentProgress = null;
  }

  // 保存进度到数据库
  async saveProgress(currentQuestion, score) {
    const user = authManager.currentUser;
    if (!user) return;

    try {
      const { error } = await supabaseClient
        .from('user_progress')
        .upsert({
          user_id: user.id,
          current_question: currentQuestion,
          score: score,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      this.currentProgress = { current_question: currentQuestion, score };
    } catch (error) {
      console.error('保存进度失败:', error);
    }
  }

  // 从数据库加载进度
  async loadProgress() {
    const user = authManager.currentUser;
    if (!user) return null;

    try {
      const { data, error } = await supabaseClient
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = 没有数据

      this.currentProgress = data;
      return data;
    } catch (error) {
      console.error('加载进度失败:', error);
      return null;
    }
  }

  // 清除进度（通关或重新开始）
  async clearProgress() {
    const user = authManager.currentUser;
    if (!user) return;

    try {
      const { error } = await supabaseClient
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      this.currentProgress = null;
    } catch (error) {
      console.error('清除进度失败:', error);
    }
  }

  // 检查是否有进行中的进度
  hasProgress() {
    return this.currentProgress && this.currentProgress.current_question > 0;
  }
}

const progressManager = new ProgressManager();

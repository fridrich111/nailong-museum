// supabase-config.js
// 替换占位符为你的 Supabase 项目信息
// {SUPABASE_URL}: Supabase 项目 URL
// {SUPABASE_ANON_KEY}: Supabase 匿名公钥

var supabaseClient = supabase.createClient(
    '{SUPABASE_URL}',
    '{SUPABASE_ANON_KEY}'
);

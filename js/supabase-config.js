// Supabase client init config
var SUPABASE_URL = 'https://datenwietosgfprmxcua.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdGVud2lldG9zZ2Zwcm14Y3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODQ1MzgsImV4cCI6MjA5NDc2MDUzOH0.07g82Otjv8SIxN_YIc3PYm0GLlF9wYwDQyJBkhUD0ME';

try {
    var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase 客户端初始化成功');
} catch (err) {
    console.error('Supabase 初始化失败:', err);
}

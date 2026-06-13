# Supabase 配置指南

## 1. 创建 Supabase 项目
1. 访问 https://supabase.com 注册/登录
2. 点击 "New Project"
3. 记下 Project URL 和 anon public key

## 2. 执行建表 SQL
在 SQL Editor 中执行 supabase-schema.sql

## 3. 创建 Storage Bucket
1. Storage → New Bucket → 名称 `paintings` → Public
2. 执行 RLS 策略

## 4. 配置 Authentication
1. Authentication → Settings
2. 关闭 "Confirm email"（可选）
3. 保存

## 5. 填入配置
修改 js/supabase-config.js 中的 URL 和 anon key

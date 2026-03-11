# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-12

### Added
- 角色选择页面，支持4种学历背景（大学在读/毕业/硕士在读/硕士毕业）
- 材料清单展示，严格按照官方 PDF 排列
- 进度追踪，显示完成百分比和进度条
- 搜索功能，快速过滤材料
- 数据持久化，关闭应用后保留勾选状态
- PDF 下载链接（上海留学签证特别提示 2025-10版）
- 免责提示

### Fixed
- 修复照片数量错误
- 修正清单编号与官方 PDF 一致
- 优化清单筛选性能

### Improved
- 无障碍性：添加键盘导航、焦点指示器、ARIA 标签
- 触摸目标尺寸优化，确保移动端可用性
- 设计令牌系统，统一颜色和样式
- 性能优化，memoize 进度颜色计算
- 添加 prefers-reduced-motion 支持

## [0.1.0] - 2026-03-11

### Added
- 项目初始化
- 基本的签证材料清单功能
- 清单勾选和进度显示

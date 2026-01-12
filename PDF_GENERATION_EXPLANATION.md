# PDF生成说明

## PDF生成流程

PDF生成使用以下技术栈和流程：

1. **构建网站**: 使用 `vitepress build docs` 构建静态网站
2. **启动预览服务器**: 在本地启动预览服务器（默认端口4173）
3. **使用Playwright**: 通过Chromium浏览器打开页面
4. **页面渲染**: 
   - 等待页面完全加载
   - 将视频转换为二维码
   - 确保所有图片加载完成
   - 应用PDF专用CSS样式
5. **生成PDF**: 使用Playwright的 `page.pdf()` 方法生成PDF
6. **合并模板**: 使用pdf-lib合并页眉页脚模板和页码
7. **保存文件**: 保存为最终的PDF文件

## 图片模糊和不完整的原因

### 原因分析：

1. **设备缩放因子过低**: 
   - 原设置：`deviceScaleFactor: 1`
   - 这意味着没有使用高DPI渲染，导致图片分辨率不足

2. **视口大小限制**:
   - 原设置：`viewport: { width: 1280, height: 720 }`
   - 较小的视口可能导致图片被压缩

3. **CSS限制**:
   - `max-width: 100%` 可能限制图片显示尺寸
   - 图片可能被浏览器自动压缩

4. **图片加载时机**:
   - 懒加载图片可能未完全加载
   - 图片解码可能未完成

## 已实施的优化方案

### 1. 提高设备缩放因子
```javascript
deviceScaleFactor: 3  // 从1提高到2，提升图片清晰度
```

### 2. 增大视口尺寸
```javascript
viewport: { width: 1920, height: 1080 }  // 从1280x720提升到1920x1080
```

### 3. 优化图片CSS渲染
- 添加 `image-rendering: crisp-edges` 确保图片清晰
- 使用 `object-fit: contain` 保持图片比例
- 确保图片不被裁剪

### 4. 增强图片加载检查
- 添加图片加载状态验证
- 增加等待时间确保图片完全渲染
- 输出图片加载状态日志

### 5. 文件名修改
- 中文PDF: `折叠支架安装手册.pdf`
- 英文PDF: `Folding Bracket Installation Manual.pdf`

## 使用说明

运行PDF生成命令：
```bash
pnpm docs:pdf
```

生成的PDF文件位置：
- 中文版: `docs/public/downloads/zh-cn/折叠支架安装手册.pdf`
- 英文版: `docs/public/downloads/en/Folding Bracket Installation Manual.pdf`

## 进一步优化建议

如果图片质量仍不理想，可以尝试：

1. **进一步提高deviceScaleFactor**:
   ```javascript
   deviceScaleFactor: 3  // 可以尝试更高的值
   ```

2. **调整PDF生成参数**:
   - 可以尝试不同的 `scale` 值
   - 检查 `preferCSSPageSize` 设置

3. **检查源图片质量**:
   - 确保源图片本身是高质量的
   - 检查图片格式（PNG通常比JPG质量更好）

4. **使用环境变量调整**:
   ```bash
   PDF_TEMPLATE_OPACITY=0.5 pnpm docs:pdf
   ```


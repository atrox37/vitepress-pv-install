#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
翻译英文文件中的表格内容
"""

import re
import os

# 翻译映射表
TRANSLATIONS = {
    "固定框架": "Fixed Frame",
    "组合框架": "Combined Frame",
    "安装限位件": "Installation Limit Piece",
    "导轨连接件": "Rail Connector",
    "混凝土块或其他重物替代（沙袋）": "Concrete Block or Other Heavy Object Substitute (Sandbag)",
    "12X60销轴": "12X60 Pin",
    "B型开口销": "Type B Cotter Pin",
    "光伏组件": "PV Module",
    "压块": "Clamp",
    "U型螺栓套装": "U-Bolt Set",
    "压块防撞块": "Clamp Bumper",
    "组件安装定位块": "Module Installation Positioning Block",
    "扭力扳手": "Torque Wrench",
    "10X60销轴": "10X60 Pin",
    "12X80销轴": "12X80 Pin",
    "组合框架焊接件": "Combined Frame Welding Component",
    "固定框架上边": "Fixed Frame Top",
    "固定框架侧边": "Fixed Frame Side",
    "1件": "1 piece",
    "2件": "2 pieces",
    "10件": "10 pieces",
    "40件": "40 pieces",
    "80件": "80 pieces",
    "40块": "40 blocks",
    "20个": "20 pieces",
    "16": "16",
    "64": "64",
    "2块": "2 pieces",
    "2套": "2 sets",
    "4": "4",
    "6": "6",
}

def translate_table_content(text):
    """翻译表格中的中文内容"""
    lines = text.split('\n')
    result = []
    
    for line in lines:
        if '|' in line and not line.strip().startswith('|---'):
            # 这是表格行，需要翻译
            # 分割单元格
            cells = [cell.strip() for cell in line.split('|')]
            translated_cells = []
            
            for cell in cells:
                if not cell:  # 空单元格
                    translated_cells.append(cell)
                    continue
                
                # 检查是否包含图片标签
                if '<img' in cell:
                    # 包含图片，只翻译图片标签外的文本
                    # 提取图片标签
                    img_match = re.search(r'(<img[^>]*>)', cell)
                    if img_match:
                        img_tag = img_match.group(1)
                        # 获取图片标签前后的文本
                        before_img = cell[:img_match.start()].strip()
                        after_img = cell[img_match.end():].strip()
                        
                        # 翻译图片前后的文本
                        translated_before = before_img
                        translated_after = after_img
                        
                        for cn, en in TRANSLATIONS.items():
                            if cn in translated_before:
                                translated_before = translated_before.replace(cn, en)
                            if cn in translated_after:
                                translated_after = translated_after.replace(cn, en)
                        
                        translated_cells.append(translated_before + ' ' + img_tag + ' ' + translated_after)
                    else:
                        # 没有图片标签，直接翻译
                        translated_cell = cell
                        for cn, en in TRANSLATIONS.items():
                            if cn in translated_cell:
                                translated_cell = translated_cell.replace(cn, en)
                        translated_cells.append(translated_cell)
                else:
                    # 没有图片标签，直接翻译
                    translated_cell = cell
                    for cn, en in TRANSLATIONS.items():
                        if cn in translated_cell:
                            translated_cell = translated_cell.replace(cn, en)
                    translated_cells.append(translated_cell)
            
            # 重新组合行
            translated_line = '|' + '|'.join(translated_cells) + '|'
            result.append(translated_line)
        else:
            result.append(line)
    
    return '\n'.join(result)

def process_file(file_path):
    """处理单个文件"""
    if not os.path.exists(file_path):
        print(f"文件不存在: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 翻译表格内容
    translated_content = translate_table_content(content)
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)
    
    print(f"已处理: {file_path}")

def main():
    """主函数"""
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    en_manuals_dir = os.path.join(repo_root, "docs", "en", "manuals")
    
    # 需要处理的文件
    files_to_process = [
        "step3-assembly.md",
        "step5-pv-modules.md",
        "step1-fixed-frame.md",
        "step2-combined-frame.md",
        "step4-rod-assembly.md",
        "step7-folding.md",
        "folding-bracket-installation.md",
    ]
    
    for filename in files_to_process:
        file_path = os.path.join(en_manuals_dir, filename)
        if os.path.exists(file_path):
            process_file(file_path)
        else:
            print(f"文件不存在: {file_path}")

if __name__ == "__main__":
    main()


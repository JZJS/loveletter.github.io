from PIL import Image, ImageDraw, ImageFont
import os
import textwrap
import datetime
import random

def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    current_line = ""

    for word in words:
        test_line = current_line + " " + word if current_line else word
        bbox = draw.textbbox((0, 0), test_line, font=font)
        line_width = bbox[2] - bbox[0]

        if line_width <= max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word

    if current_line:
        lines.append(current_line)

    return lines


def generate_love_image(text):
    # 图片和字体路径
    # 以当前文件（backend 目录）为起点，构建相对路径
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    index = random.randint(1, 13)
    background_path = os.path.join(BASE_DIR, "image", f"loveletter{index}.jpg")
    font_path = os.path.join(BASE_DIR, "Great_Vibes", "GreatVibes-Regular.ttf")
    output_folder = os.path.join(BASE_DIR, "output")

    os.makedirs(output_folder, exist_ok=True)
    
    # 缩放背景图
    original_img = Image.open(background_path).convert("RGBA")
    scale_factor = 1
    new_size = (int(original_img.width * scale_factor), int(original_img.height * scale_factor))
    img = original_img.resize(new_size)

    # 设置字体
    font_size = 500  # 缩放后的字体
    font = ImageFont.truetype(font_path, font_size)

    # 创建透明图层用于绘制文字
    txt_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_layer)

    # 自动换行
    #sample = "A" * 10
    #avg_char_width = (draw.textbbox((0, 0), sample, font=font)[2] - draw.textbbox((0, 0), sample, font=font)[0]) / 10
    #max_chars = int(img.width / avg_char_width * 0.9)
    #lines = textwrap.wrap(text, width=max_chars)

    # 自动换行（更准确）
    max_width = int(img.width * 0.9)
    lines = wrap_text(draw, text, font, max_width)

    # 计算文字总高
    line_heights = [draw.textbbox((0, 0), line, font=font)[3] - draw.textbbox((0, 0), line, font=font)[1] for line in lines]
    line_spacing = 20
    total_height = sum(line_heights) + line_spacing * (len(lines) - 1)
    start_y = (img.height - total_height) // 2

    # 绘制带描边的文字
    outline_range = 2
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (img.width - text_width) // 2
        y = start_y + sum(line_heights[:i]) + i * line_spacing
        # 描边
        for dx in range(-outline_range, outline_range + 1):
            for dy in range(-outline_range, outline_range + 1):
                if dx != 0 or dy != 0:
                    draw.text((x + dx, y + dy), line, font=font, fill="white")
        # 正文
        draw.text((x, y), line, font=font, fill="#ff69b4")

    # 合成并保存
    final_image = Image.alpha_composite(img, txt_layer).convert("RGB")

    # 保存到 backend/static/output 文件夹中（浏览器可访问）
    static_output_folder = os.path.join(os.path.dirname(__file__), "static", "output")
    os.makedirs(static_output_folder, exist_ok=True)

    filename = datetime.datetime.now().strftime("%Y%m%d%H%M%S") + "_loveletter.jpg"
    output_path = os.path.join(static_output_folder, filename)
    final_image.save(output_path)

    # 返回相对路径，供前端拼接访问地址
    return f"/static/output/{filename}"

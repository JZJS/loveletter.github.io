import {createCanvas, loadImage} from "canvas";

// 生成随机整数函数
const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// 文本换行函数
const wrapText = (ctx, text, font, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = `${currentLine} ${word}`;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    lines.push(currentLine);
    return lines;
};

// 生成图像主函数
const generateLoveImage = async (text) => {
    console.log(text);
    const index = randomIntFromInterval(1, 13);
    const backgroundPath = '../image/' + `loveletter${index}.jpg`;
    const fontPath = '../Great_Vibes/' + 'GreatVibes-Regular.ttf';

    const img = await loadImage(backgroundPath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // 绘制背景图像
    ctx.drawImage(img, 0, 0);

    // 加载字体
    const fontStyle = new FontFace('GreatVibes-Regular', "url('../Great_Vibes/GreatVibes-Regular.ttf')");
    document.fonts.add(fontStyle);
    await fontStyle.load();
    ctx.font = '500px GreatVibes-Regular';

    // 自动换行
    const maxWidth = img.width * 0.9;
    const lines = wrapText(ctx, text, ctx.font, maxWidth);

    // 计算文字总高度
    const lineHeights = lines.map(line => {
        const metrics = ctx.measureText(line);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    });

    const lineSpacing = 20;
    const totalHeight = lineHeights.reduce((acc, height) => acc + height, 0) + lineSpacing * (lines.length - 1);
    let startY = (img.height - totalHeight) / 2;

    // 绘制带描边的文字
    const outlineRange = 2;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const metrics = ctx.measureText(line);
        const textWidth = metrics.width;
        const x = (img.width - textWidth) / 2;
        const y = startY + lineHeights.slice(0, i).reduce((acc, height) => acc + height, 0) + i * lineSpacing;

        // 描边
        for (let dx = -outlineRange; dx <= outlineRange; dx++) {
            for (let dy = -outlineRange; dy <= outlineRange; dy++) {
                if (dx!== 0 || dy!== 0) {
                    ctx.fillStyle = 'white';
                    ctx.fillText(line, x + dx, y + dy);
                }
            }
        }

        // 正文
        ctx.fillStyle = '#ff69b4';
        ctx.fillText(line, x, y);
    }

    const dataURL = canvas.toDataURL('image/jpeg');
    // 将dataURL转换为Blob对象
    const response = await fetch(dataURL);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, 'loveletter.jpg');

    const uploadUrl = 'https://node.lighthouse.storage/api/v0/add';
    const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_LIGHTHOUSE_API_KEY}`
    };

    const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData
    });

    if (uploadResponse.ok) {
        return await uploadResponse.json();
    } else {
        throw new Error('upload fail');
    }
};

export { generateLoveImage };

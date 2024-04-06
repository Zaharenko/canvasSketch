const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const settings = {
    dimensions: [1080, 1080],
};

const sketch = ({ context, width, height }) => {
    let x, y, w, h, fill, stroke, blend;
    let animationStep = 0;

    const num = 40;

    const rects = [];
    let triangleColors, circleColors;

    do {
        triangleColors = [random.pick(risoColors), random.pick(risoColors)];
        circleColors = [random.pick(risoColors), random.pick(risoColors)];
    } while (
        triangleColors[0].hex === circleColors[0].hex ||
        triangleColors[1].hex === circleColors[1].hex
    );

    const limitedBgColors = [
        "#f9eec9",
        "#d3b786",
        "#886839",
        "#af672d",
        "#e4b455",
    ];
    const bgColor = random.pick(limitedBgColors);

    const mask = {
        radius: width * 0.4,
        sides: 4,
        x: width * 0.5,
        y: height * 0.5,
    };

    for (let i = 0; i < num; i++) {
        x = random.range(0, width);
        y = random.range(0, height);
        w = random.range(200, 300);
        h = random.range(150, 250);
        rotation = random.range(0, 360);

        fill = random.pick(triangleColors).hex;
        stroke = random.pick(triangleColors).hex;

        blend = random.value() > 0.5 ? "overlay" : "source-over";

        rects.push({ x, y, w, h, fill, stroke, blend, rotation });
    }

    const animate = () => {
        animationStep++;

        rects.forEach((rect) => {
            const { x, y } = rect;

            rect.x = x + Math.sin(animationStep * 0.05) * 7;
            rect.y = y + Math.cos(animationStep * 0.05) * 14;
        });

        draw();
        requestAnimationFrame(animate);
    };

    const draw = () => {
        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);

        context.save();
        context.translate(mask.x, mask.y);

        drawPolygon({ context, radius: mask.radius, sides: mask.sides });

        context.clip();

        rects.forEach((rect) => {
            const { x, y, w, h, fill, stroke, blend, rotation } = rect;
            let shadowColor;

            context.save();
            context.translate(-mask.x, -mask.y);
            context.translate(x, y);

            context.strokeStyle = stroke;
            context.fillStyle = fill;
            context.lineWidth = 10;

            context.globalCompositeOperation = blend;

            drawSkewedTriangle({
                context,
                w,
                h,
                rotation: rect.rotation,
                fill: random.pick(limitedBgColors),
                circleColors: circleColors,
            });

            shadowColor = Color.offsetHSL(fill, 0, 0, -20);
            shadowColor.rgba[3] = 0.5;

            context.shadowColor = Color.style(shadowColor.rgba);
            context.shadowOffsetX = -10;
            context.shadowOffsetY = 20;

            context.fill();

            context.shadowColor = null;
            context.stroke();

            context.globalCompositeOperation = "source-over";

            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.stroke();

            context.restore();
        });

        context.restore();

        // polygon outline
        context.save();
        context.translate(mask.x, mask.y);
        context.lineWidth = 20;

        drawPolygon({
            context,
            radius: mask.radius - context.lineWidth,
            sides: mask.sides,
        });

        context.globalCompositeOperation = "color-burn";
        context.strokeStyle = triangleColors[0].hex;
        context.stroke();

        context.restore();
    };

    animate();
};

const drawSkewedTriangle = ({
    context,
    w = 600,
    h = 200,
    rotation = -45,
    fill,
    circleColors,
}) => {
    const halfWidth = w * 0.5;
    const halfHeight = h * 0.5;
    context.save();

    // Нарисовать круги
    const circles = 5;
    const circleRadius = w * 0.2;
    const spacing = w * 0.4;

    for (let i = 0; i < circles; i++) {
        const cx = random.range(
            -halfWidth + circleRadius,
            halfWidth - circleRadius,
        );
        const cy = random.range(
            -halfHeight + circleRadius,
            halfHeight - circleRadius,
        );

        context.fillStyle = random.pick(circleColors).hex; // цвет круга
        context.beginPath();
        context.arc(cx, cy, circleRadius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    // Нарисовать треугольник
    context.fillStyle = fill; // Задаем цвет заливки
    context.rotate(math.degToRad(rotation)); // Поворот контекста на указанный угол
    context.beginPath();
    context.moveTo(-halfWidth, halfHeight);
    context.lineTo(halfWidth, halfHeight);
    context.lineTo(0, -halfHeight);
    context.closePath();
    context.fill();

    context.restore();
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
    const slice = (Math.PI * 2) / sides;

    context.beginPath();
    context.moveTo(0, -radius);

    for (let i = 1; i < sides; i++) {
        const theta = i * slice - Math.PI * 0.5;
        context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
    }

    context.closePath();
};

canvasSketch(sketch, settings);

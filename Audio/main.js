const canvasSketch = require("canvas-sketch");

const settings = {
    dimensions: [1080, 1080],
};

let audio;
let isPlaying = false;

const sketch = () => {
    audio = document.createElement("audio");
    audio.src = "song/Deja-Vu.mp3";

    return ({ context, width, height }) => {
        // Clear the canvas
        context.clearRect(0, 0, width, height);

        if (!isPlaying) {
            context.fillStyle = "white";
            context.fillRect(0, 0, width, height);

            context.fillStyle = "green";
            context.beginPath();
            context.moveTo(width / 2 - 30, height / 2 - 50);
            context.lineTo(width / 2 + 30, height / 2);
            context.lineTo(width / 2 - 30, height / 2 + 50);
            context.fill();
        }
    };
};

const addEventListener = () => {
    window.addEventListener("mousedown", () => {
        if (!isPlaying && audio.paused) {
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
    });
};

addEventListener();
canvasSketch(sketch, settings);

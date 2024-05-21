let sun = new Image();
let moon = new Image();
let earth = new Image();

function init() {
    sun.onload = () => {
        moon.onload = () => {
            earth.onload = () => {
                initSolarSystem();
                initClock();
            };
            earth.src = "canvas_earth.png";
        };
        moon.src = "canvas_moon.png";
    };
    sun.src = "canvas_sun.png";
}

function initSolarSystem() {
    window.requestAnimationFrame(drawSolarSystem);
}

function drawSolarSystem() {
    const canvas = document.getElementById("canvasSolarSystem");
    const ctxS = canvas.getContext("2d");

    ctxS.globalCompositeOperation = "destination-over";
    ctxS.clearRect(0, 0, canvas.width, canvas.height); // limpiar canvas

    ctxS.fillStyle = "rgba(0,0,0,0.4)";
    ctxS.strokeStyle = "rgba(0,153,255,0.4)";
    ctxS.save();
    ctxS.translate(canvas.width / 2, canvas.height / 2);

    // La tierra
    let time = new Date();
    ctxS.rotate(
        ((2 * Math.PI) / 60) * time.getSeconds() +
        ((2 * Math.PI) / 60000) * time.getMilliseconds()
    );
    ctxS.translate(105, 0);
    ctxS.fillRect(0, -12, 50, 24); // Sombra
    ctxS.drawImage(earth, -12, -12);

    // La luna
    ctxS.save();
    ctxS.rotate(
        ((2 * Math.PI) / 6) * time.getSeconds() +
        ((2 * Math.PI) / 6000) * time.getMilliseconds()
    );
    ctxS.translate(0, 28.5);
    ctxS.drawImage(moon, -3.5, -3.5);
    ctxS.restore();

    ctxS.restore();

    ctxS.beginPath();
    ctxS.arc(canvas.width / 2, canvas.height / 2, 105, 0, Math.PI * 2, false); // Órbita terrestre
    ctxS.stroke();

    ctxS.drawImage(sun, 0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(drawSolarSystem);
}

function initClock() {
    const clockCanvas = document.getElementById("clockCanvas");
    const ctx = clockCanvas.getContext("2d");

    function drawClock() {
        ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);

        const radius = clockCanvas.width / 2;
        ctx.save();
        ctx.translate(radius, radius);

        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);

        ctx.restore();
        requestAnimationFrame(drawClock);
    }

    function drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
    }

    function drawNumbers(ctx, radius) {
        let ang;
        let num;
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius) {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        // Hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6) +
               (minute * Math.PI / (6 * 60)) +
               (second * Math.PI / (360 * 60));
        drawHand(ctx, hour, radius * 0.5, radius * 0.07);

        // Minute
        minute = (minute * Math.PI / 30) +
                 (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07);

        // Second
        second = (second * Math.PI / 30);
        drawHand(ctx, second, radius * 0.9, radius * 0.02);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    drawClock();
}

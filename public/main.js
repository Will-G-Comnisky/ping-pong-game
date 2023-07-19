"use strict";
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ballSettings = {
    maxBallSpeed: 40,
    initialBallSpeed: 8,
    ballRadius: 14,
};
const paddle = {
    paddleWidth: 25,
    paddleHeight: 120,
    paddleSpeed: 8,
    netWidth: 5,
    netColor: "BLUE"
};
// Desenhando a rede
const drawNet = (canvas, netWidth, netColor) => {
    const drawRect = (context, x, y, width, height, color) => {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    };
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(context, canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
    }
};
// Desenhando os retangulos
const drawRect = (context, x, y, width, height, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
};
// Desenhando o circulo
const drawCircle = (context, x, y, color, ballRadius) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
};
// Desenhando o texto 
const drawText = (text, x, y, color, fontSize = 60, fontWeight = 'bold', font = 'Roboto') => {
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${font}`;
    context.textAlign = 'center';
    context.fillText(text, x, y);
};
// Desenhando o paddle
const createPaddle = (context, x, y, width, height, color) => {
    return { x, y, width, height, color, score: 0 };
};
// Criando objeto "bola"
const createBall = (x, y, radius, velocityX, velocityY, color) => {
    return { x, y, radius, velocityX, velocityY, color, speed: ballSettings.initialBallSpeed };
};
// definindo objetos paddle do usuário e do computador
const user = createPaddle(context, 0, canvas.height / 2 - paddle.paddleHeight / 2, paddle.paddleWidth, paddle.paddleHeight, "blue");
const compt = createPaddle(context, canvas.width - paddle.paddleWidth, canvas.height / 2 - paddle.paddleHeight / 2, paddle.paddleWidth, paddle.paddleHeight, "red");
// Definindo objeto de bola
const ball = createBall(canvas.width / 2, canvas.height / 2, ballSettings.ballRadius, ballSettings.initialBallSpeed, ballSettings.initialBallSpeed, "white");
// Movimentação paddle baseando-se na movimentação do mouse
const movePaddle = (event) => {
    const rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
};
canvas.addEventListener("mousemove", movePaddle);
// Colisão da bola nos paddles
const collision = (b, p) => {
    return (b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height);
};
// Resetando a bola e velocidade
const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = ballSettings.initialBallSpeed;
};
// Atualizando a logica do jogo
const update = () => {
    // Verificar placar e resetar a bola caso necessário
    if (ball.x - ball.radius < 0) {
        compt.score++;
        resetBall();
    }
    else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
    // Atualizar posição da bola
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    // Atualizar paddle do computador baseando-se na posição da bola
    compt.y += (ball.y - (compt.y + compt.height / 2)) * 0.1;
    // Extremidades de topo e fundo
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }
    // Determinar qual paddle inicia a colisão com a bola
    let player = ball.x + ball.radius < canvas.width / 2 ? user : compt;
    if (collision(ball, player)) {
        const collidePoint = ball.y - (player.y + player.height / 2);
        const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
        ball.velocityY = ball.speed * Math.sin(collisionAngle);
        // Aumentar velocidade da bola e limite de velocidade máxima
        ball.speed += 0.2;
        if (ball.speed > ballSettings.maxBallSpeed) {
            ball.speed = ballSettings.maxBallSpeed;
        }
    }
};
// Renderizando jogo no canvas
const render = () => {
    // Formata com tela preta
    drawRect(context, 0, 0, canvas.width, canvas.height, "black");
    drawNet(canvas, 2, "white");
    drawText(user.score.toString(), canvas.width / 4, canvas.height / 2, "gray", 120, 'bold');
    // Placar
    drawText(compt.score.toString(), (3 * canvas.width) / 4, canvas.height / 2, "gray", 120, 'bold');
    // Paddles
    drawRect(context, user.x, user.y, user.width, user.height, user.color);
    drawRect(context, compt.x, compt.y, compt.width, compt.height, compt.color);
    // Bola
    drawCircle(context, ball.x, ball.y, ball.color, ball.radius);
};
// Rodar loop do jogo
const gameLoop = () => {
    update();
    render();
};
// Configurar gameLoop para rodar a 60fps
const framePerSec = 60;
setInterval(gameLoop, 1000 / framePerSec);

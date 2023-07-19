var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ballSettings = {
    maxBallSpeed: 40,
    initialBallSpeed: 8,
    ballRadius: 12,
};
var paddle = {
    paddleWidth: 18,
    paddleHeight: 120,
    paddleSpeed: 8,
    netWidth: 5,
    netColor: "BLUE"
};
// Desenhando a rede
var drawNet = function (canvas, netWidth, netColor) {
    var drawRect = function (context, x, y, width, height, color) {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    };
    for (var i = 0; i <= canvas.height; i += 15) {
        drawRect(context, canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
    }
};
// Desenhando os retangulos
var drawRect = function (context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
};
// Desenhando o circulo
var drawCircle = function (context, x, y, color, ballRadius) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
};
// Desenhando o texto 
var drawText = function (text, x, y, color, fontSize, fontWeight, font) {
    if (fontSize === void 0) { fontSize = 60; }
    if (fontWeight === void 0) { fontWeight = 'bold'; }
    if (font === void 0) { font = 'Roboto'; }
    context.fillStyle = color;
    context.font = "".concat(fontWeight, " ").concat(fontSize, "px ").concat(font);
    context.textAlign = 'center';
    context.fillText(text, x, y);
};
// Desenhando o paddle
var createPaddle = function (context, x, y, width, height, color) {
    return { x: x, y: y, width: width, height: height, color: color, score: 0 };
};
// Criando objeto "bola"
var createBall = function (x, y, radius, velocityX, velocityY, color) {
    return { x: x, y: y, radius: radius, velocityX: velocityX, velocityY: velocityY, color: color, speed: ballSettings.initialBallSpeed };
};
// definindo objetos paddle do usuário e do computador
var user = createPaddle(context, 0, canvas.height / 2 - paddle.paddleHeight / 2, paddle.paddleWidth, paddle.paddleHeight, "blue");
var compt = createPaddle(context, canvas.width - paddle.paddleWidth, canvas.height / 2 - paddle.paddleHeight / 2, paddle.paddleWidth, paddle.paddleHeight, "red");
// Definindo objeto de bola
var ball = createBall(canvas.width / 2, canvas.height / 2, ballSettings.ballRadius, ballSettings.initialBallSpeed, ballSettings.initialBallSpeed, "white");
// Movimentação paddle baseando-se na movimentação do mouse
var movePaddle = function (event) {
    var rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
};
canvas.addEventListener("mousemove", movePaddle);
// Colisão da bola nos paddles
var collision = function (b, p) {
    return (b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height);
};
// Resetando a bola e velocidade
var resetBall = function () {
    ball.x = canvas.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = ballSettings.initialBallSpeed;
};
// Atualizando a logica do jogo
var update = function () {
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
    var player = ball.x + ball.radius < canvas.width / 2 ? user : compt;
    if (collision(ball, player)) {
        var collidePoint = ball.y - (player.y + player.height / 2);
        var collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
        var direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
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
var render = function () {
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
var gameLoop = function () {
    update();
    render();
};
// Configurar gameLoop para rodar a 60fps
var framePerSec = 60;
setInterval(gameLoop, 1000 / framePerSec);

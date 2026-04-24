const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 8;
const PADDLE_SPEED = 5;
const INITIAL_BALL_SPEED = 4;
const MAX_BALL_SPEED = 8;
const WINNING_SCORE = 5;

// Game Objects
const player = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

const computer = {
    x: canvas.width - PADDLE_WIDTH - 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
};

// Game State
let gameOver = false;
let mouseY = canvas.height / 2;
const keys = { ArrowUp: false, ArrowDown: false };

// Event Listeners
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

// Update player paddle position
function updatePlayer() {
    // Mouse control
    let targetY = mouseY - PADDLE_HEIGHT / 2;
    
    // Keyboard control (overrides or combines with mouse)
    if (keys.ArrowUp) targetY -= PADDLE_SPEED;
    if (keys.ArrowDown) targetY += PADDLE_SPEED;

    // Smooth lerp towards target
    player.y += (targetY - player.y) * 0.1;

    // Clamp to canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer paddle (AI)
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    // Predict where ball will be (simple prediction)
    const predictionOffset = ball.dx > 0 ? ball.dx * 20 : 0;
    const predictedY = ball.y + ball.dy * (ball.speed > 0 ? 10 : 0);

    if (computerCenter < predictedY - 35) {
        computer.y += PADDLE_SPEED * 0.8; // Slightly slower for balance
    } else if (computerCenter > predictedY + 35) {
        computer.y -= PADDLE_SPEED * 0.8;
    }

    // Clamp to canvas
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Check collision with paddle
function checkPaddleCollision(paddle) {
    if (
        ball.x - ball.size < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y - ball.size < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    ) {
        // Calculate where on paddle the ball hit (0 to 1)
        const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        
        // Bounce ball
        ball.dx = -ball.dx;
        ball.x = paddle === player ? player.x + player.width + ball.size : computer.x - ball.size;
        
        // Add spin based on where ball hit paddle
        ball.dy += hitPos * 3;
        
        // Increase speed slightly (capped)
        ball.speed = Math.min(ball.speed + 0.3, MAX_BALL_SPEED);
        ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }

    // Paddle collision
    checkPaddleCollision(player);
    checkPaddleCollision(computer);

    // Scoring
    if (ball.x - ball.size < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        player.score++;
        resetBall();
    }

    // Check win condition
    if (player.score >= WINNING_SCORE) {
        gameOver = true;
        showGameStatus('🎉 YOU WIN! 🎉');
    } else if (computer.score >= WINNING_SCORE) {
        gameOver = true;
        showGameStatus('💻 COMPUTER WINS! 💻');
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = INITIAL_BALL_SPEED;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * INITIAL_BALL_SPEED;
    ball.dy = (Math.random() - 0.5) * INITIAL_BALL_SPEED;
}

// Show game status message
function showGameStatus(message) {
    const statusEl = document.getElementById('gameStatus');
    statusEl.textContent = message;
    statusEl.classList.add('show');
}

// Draw functions
function drawPaddle(paddle, color) {
    ctx.fillStyle = color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Main render function
function render() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles (blue for player, pink for computer)
    drawPaddle(player, '#4488ff');
    drawPaddle(computer, '#ff4488');

    // Draw ball
    drawBall();

    // Update scoreboard
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;

    ctx.shadowColor = 'transparent';
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        updatePlayer();
        updateComputer();
        updateBall();
    }

    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
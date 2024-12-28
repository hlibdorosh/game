// Основна логіка гри

// Вибір елементів
const playButton = document.getElementById('play-button');
const instructionsButton = document.getElementById('instructions-button');
const backToMenuButton = document.getElementById('back-to-menu');
const menu = document.getElementById('menu');
const instructions = document.getElementById('instructions');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'assets/trol.jpg';

const carrotImage = new Image();
carrotImage.src = 'assets/carrot.png';

const idleFrame = new Image();
idleFrame.src = 'assets/run/run1.png'; // Path to the idle sprite


const runFrames = [];
for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `assets/run/run${i}.png`;
    runFrames.push(img);
}


let currentFrame = 0; // Current frame index (0 or 1)
const totalFrames = 6; // Total frames (2 in this case)
const frameDuration = 100; // Duration of each frame in milliseconds
let lastFrameTime = 0; // Timestamp of the last frame update


// Load coin images
const goldCoinFrames = [];
for (let i = 21; i <= 30; i++) {
    const img = new Image();
    img.src = `assets/goldCoin/Gold_${i}.png`;
    goldCoinFrames.push(img);
}

const silverCoinFrames = [];
for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = `assets/silverCoin/Silver_${i}.png`;
    silverCoinFrames.push(img);
}

let coinFrameIndex = 0; // Current frame index for coins
const coinFrameDuration = 100; // Duration of each coin frame in milliseconds
let lastCoinFrameTime = 0; // Timestamp of the last coin frame updat


const rabbitUpLeftFrames = [];
const rabbitUpRightFrames = [];
const rabbitDownLeftFrames = [];
const rabbitDownRightFrames = [];

// Load frames for each movement direction
for (let i = 1; i <= 8; i++) {
    // Rabbit moving up-left
    const upLeftImg = new Image();
    upLeftImg.src = `assets/rabbitUp/left/rabbit${i}.png`;
    rabbitUpLeftFrames.push(upLeftImg);

    // Rabbit moving up-right
    const upRightImg = new Image();
    upRightImg.src = `assets/rabbitUp/right/rabbit${i}.png`;
    rabbitUpRightFrames.push(upRightImg);

    // Rabbit moving down-left
    const downLeftImg = new Image();
    downLeftImg.src = `assets/rabbitDown/left/rabbit${i}.png`;
    rabbitDownLeftFrames.push(downLeftImg);

    // Rabbit moving down-right
    const downRightImg = new Image();
    downRightImg.src = `assets/rabbitDown/right/rabbit${i}.png`;
    rabbitDownRightFrames.push(downRightImg);
}


let enemyFrameIndex = 0; // Current frame index for enemies
const enemyFrameDuration = 100; // Duration of each frame in milliseconds
let lastEnemyFrameTime = 0; // Timestamp of the last enemy frame update



// Розміри ігрового поля
const GAME_WIDTH = window.innerWidth * 0.7;
const GAME_HEIGHT = window.innerHeight * 0.7;
gameCanvas.width = GAME_WIDTH;
gameCanvas.height = GAME_HEIGHT;

// Гравець
const player = {
    x: GAME_WIDTH / 2 - 25,
    y: GAME_HEIGHT / 2 - 25,
    size: 50,
    speed: 5,
    lastDirection: { x: 0, y: -1 }, // Initial direction is up
};

const enemies = [];
//let ENEMY_COUNT = 3;
//let ENEMY_SPEED = 2; // Швидкість руху ворогів

function createEnemies( ENEMY_COUNT,ENEMY_SPEED) {
    enemies.length = 0;
    for (let i = 0; i < ENEMY_COUNT; i++) {
        let x, y;
        do {
            x = Math.random() * (GAME_WIDTH - 50);
            y = Math.random() * (GAME_HEIGHT - 50);
        } while (
            x < player.x + player.size && x + 50 > player.x &&
            y < player.y + player.size && y + 50 > player.y
            );
        enemies.push({
            x,
            y,
            size: 50,
            speedX: (Math.random() < 0.5 ? -1 : 1) * ENEMY_SPEED,
            speedY: (Math.random() < 0.5 ? -1 : 1) * ENEMY_SPEED,
            alive: true,
        });
    }
}

const bullets = [];
const BULLET_SPEED = 8;
const BULLET_RANGE = 0.3 * Math.sqrt(GAME_WIDTH ** 2 + GAME_HEIGHT ** 2);

let blueCoins = [];
const COIN_SIZE = 30;
let blueCoinCounter = 0;

let yellowCoins = [];
const YELLOW_COIN_SIZE = 30;
let yellowCoinCounter = 0;

function spawnBlueCoin() {
    blueCoins.push({
        x: Math.random() * (GAME_WIDTH - COIN_SIZE),
        y: Math.random() * (GAME_HEIGHT - COIN_SIZE),
    });
}

function spawnYellowCoin() {
    yellowCoins.push({
        x: Math.random() * (GAME_WIDTH - YELLOW_COIN_SIZE),
        y: Math.random() * (GAME_HEIGHT - YELLOW_COIN_SIZE),
    });
}



function drawBlueCoins(timestamp) {
    if (timestamp - lastCoinFrameTime > coinFrameDuration) {
        coinFrameIndex = (coinFrameIndex + 1) % silverCoinFrames.length; // Cycle through silver frames
        lastCoinFrameTime = timestamp;
    }

    blueCoins.forEach((coin) => {
        ctx.drawImage(
            silverCoinFrames[coinFrameIndex],
            coin.x,
            coin.y,
            COIN_SIZE,
            COIN_SIZE
        );
    });
}

function drawYellowCoins(timestamp) {
    if (timestamp - lastCoinFrameTime > coinFrameDuration) {
        coinFrameIndex = (coinFrameIndex + 1) % goldCoinFrames.length; // Cycle through gold frames
        lastCoinFrameTime = timestamp;
    }

    yellowCoins.forEach((coin) => {
        ctx.drawImage(
            goldCoinFrames[coinFrameIndex],
            coin.x,
            coin.y,
            YELLOW_COIN_SIZE,
            YELLOW_COIN_SIZE
        );
    });
}



setInterval(spawnBlueCoin, 2000);
setInterval(spawnYellowCoin, 2000);

function checkCoinCollision() {
    blueCoins = blueCoins.filter((coin) => {
        if (
            player.x < coin.x + COIN_SIZE &&
            player.x + player.size > coin.x &&
            player.y < coin.y + COIN_SIZE &&
            player.y + player.size > coin.y
        ) {
            blueCoinCounter++;
            return false;
        }
        return true;
    });
    yellowCoins = yellowCoins.filter((coin) => {
        if (
            player.x < coin.x + YELLOW_COIN_SIZE &&
            player.x + player.size > coin.x &&
            player.y < coin.y + YELLOW_COIN_SIZE &&
            player.y + player.size > coin.y
        ) {
            yellowCoinCounter++;
            player.size += 10;
            return false;
        }
        return true;
    });
}

let gameRunning = false;

playButton.addEventListener('click', () => {
    menu.hidden = true;
    gameCanvas.hidden = false;
    loadLevels().then(() => {
        startGame();
    }).catch((error) => {
        console.error("Не вдалося завантажити рівні:", error);
    });
});

instructionsButton.addEventListener('click', () => {
    menu.hidden = true;
    instructions.hidden = false;
});

backToMenuButton.addEventListener('click', () => {
    instructions.hidden = true;
    menu.hidden = false;
});

const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    Space: false,
};

window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        keys.Space = true;
        shootBullet();
    }
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        keys.Space = false;
    }
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Визначаємо константу для швидкості гравця
const PLAYER_SPEED = 5;

function movePlayer() {
    // Переконаємося, що швидкість залишається незмінною
    if (typeof player.speed === 'undefined') {
        player.speed = PLAYER_SPEED; // Встановлюємо початкову швидкість
    }

    // Перевіряємо, чи натиснуті клавіші для переміщення
    if (keys.w && player.y > 0) {
        player.y -= player.speed;
        player.lastDirection = { x: 0, y: -1 };
    } else if (keys.s && player.y + player.size < GAME_HEIGHT) {
        player.y += player.speed;
        player.lastDirection = { x: 0, y: 1 };
    } else if (keys.a && player.x > 0) {
        player.x -= player.speed;
        player.lastDirection = { x: -1, y: 0 };
    } else if (keys.d && player.x + player.size < GAME_WIDTH) {
        player.x += player.speed;
        player.lastDirection = { x: 1, y: 0 };
    } else {
        // Якщо жодна клавіша не натиснута: гравець у стані спокою
        player.lastDirection = { x: 0, y: 0 };
    }
}

function drawPlayer(timestamp) {
    // Save the current canvas state
    ctx.save();

    // Move the canvas origin to the player's center
    const playerCenterX = player.x + player.size / 2;
    const playerCenterY = player.y + player.size / 2;
    ctx.translate(playerCenterX, playerCenterY);

    // Calculate the rotation angle (add adjustment for -90 degrees)
    const angle = Math.atan2(player.lastDirection.y, player.lastDirection.x) + Math.PI / 2; // Add 90 degrees
    if (player.lastDirection.x !== 0 || player.lastDirection.y !== 0) {
        ctx.rotate(angle); // Rotate player to face the direction
    }

    // Check if the player is idle
    if (player.lastDirection.x === 0 && player.lastDirection.y === 0) {
        // Draw the idle sprite (p0) if the player is not moving
        ctx.drawImage(
            idleFrame,                // Idle sprite
            -player.size / 2, -player.size / 2, // Destination x, y (centered)
            player.size, player.size  // Destination width, height
        );
    } else {
        // Update the current frame based on time
        if (timestamp - lastFrameTime > frameDuration) {
            currentFrame = (currentFrame + 1) % totalFrames; // Cycle through frames
            lastFrameTime = timestamp;
        }

        // Draw the current frame
        ctx.drawImage(
            runFrames[currentFrame],    // Current frame image
            -player.size / 2, -player.size / 2, // Destination x, y (centered)
            player.size, player.size   // Destination width, height
        );
    }

    // Restore the canvas state
    ctx.restore();
}



function drawEnemies(timestamp) {
    if (timestamp - lastEnemyFrameTime > enemyFrameDuration) {
        enemyFrameIndex = (enemyFrameIndex + 1) % rabbitUpLeftFrames.length; // Cycle through frames
        lastEnemyFrameTime = timestamp;
    }

    enemies.forEach(enemy => {
        if (enemy.alive) {
            let spriteFrames;

            // Determine the correct sprite set based on movement direction
            if (enemy.speedY < 0 && enemy.speedX > 0) {
                spriteFrames = rabbitUpRightFrames; // Moving up-right
            } else if (enemy.speedY < 0 && enemy.speedX < 0) {
                spriteFrames = rabbitUpLeftFrames; // Moving up-left
            } else if (enemy.speedY > 0 && enemy.speedX > 0) {
                spriteFrames = rabbitDownRightFrames; // Moving down-right
            } else if (enemy.speedY > 0 && enemy.speedX < 0) {
                spriteFrames = rabbitDownLeftFrames; // Moving down-left
            } else if (enemy.speedY < 0) {
                spriteFrames = rabbitUpLeftFrames; // Moving straight up
            } else if (enemy.speedY > 0) {
                spriteFrames = rabbitDownLeftFrames; // Moving straight down
            } else {
                spriteFrames = rabbitDownLeftFrames; // Default to down-left if no movement
            }

            // Draw the sprite
            ctx.drawImage(
                spriteFrames[enemyFrameIndex], // Current frame
                enemy.x,
                enemy.y,
                enemy.size,
                enemy.size
            );
        }
    });
}


function moveEnemies() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;

        // Reverse direction if they hit canvas boundaries
        if (enemy.x <= 0 || enemy.x + enemy.size >= GAME_WIDTH) {
            enemy.speedX *= -1;
        }
        if (enemy.y <= 0 || enemy.y + enemy.size >= GAME_HEIGHT) {
            enemy.speedY *= -1;
        }
    });
}


let canShoot = true;

function shootBullet() {
    if (keys.Space && canShoot && (player.lastDirection.x !== 0 || player.lastDirection.y !== 0)) {
        canShoot = false;
        setTimeout(() => canShoot = true, 200);
        bullets.push({
            x: player.x + player.size / 2,
            y: player.y + player.size / 2,
            dx: player.lastDirection.x * BULLET_SPEED,
            dy: player.lastDirection.y * BULLET_SPEED,
            traveled: 0,
        });
    }
}

let hitCounter = 0; // Лічильник попадань у ворогів

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        bullet.traveled += Math.sqrt(bullet.dx ** 2 + bullet.dy ** 2);

        const BULLET_SIZE = 20; // Adjust size for the carrot sprite

// Update bullet collision checks if necessary
        enemies.forEach(enemy => {
            if (
                enemy.alive &&
                bullet.x + BULLET_SIZE / 2 > enemy.x &&
                bullet.x - BULLET_SIZE / 2 < enemy.x + enemy.size &&
                bullet.y + BULLET_SIZE / 2 > enemy.y &&
                bullet.y - BULLET_SIZE / 2 < enemy.y + enemy.size
            ) {
                enemy.alive = false;
                enemy.x = -enemy.size;
                enemy.y = -enemy.size;
                bullets.splice(index, 1);
                hitCounter++; // Збільшуємо лічильник попадань
            }
        });


        if (bullet.traveled > BULLET_RANGE) {
            bullets.splice(index, 1);
        }
    });
}

function drawBullets() {
    bullets.forEach((bullet) => {
        // Save the current canvas state
        ctx.save();

        // Translate to the bullet's center
        const centerX = bullet.x;
        const centerY = bullet.y;
        ctx.translate(centerX, centerY);

        // Calculate the rotation angle based on the bullet's direction, with a total shift of 90°
        const angle = Math.atan2(bullet.dy, bullet.dx) + Math.PI / 2; // Add π/2 for the total 90° shift
        ctx.rotate(angle); // Rotate the canvas

        // Draw the carrot image, adjusted for its size
        const size = 20; // Carrot sprite size
        ctx.drawImage(
            carrotImage, // The carrot sprite
            -size / 2,   // Center the carrot horizontally
            -size / 2,   // Center the carrot vertically
            size,        // Width of the carrot sprite
            size         // Height of the carrot sprite
        );

        // Restore the canvas state
        ctx.restore();
    });
}





function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
}




function checkCollision() {
    if (
        enemies.some(enemy => (
            enemy.alive &&
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y
        ))
    ) {
        resetGame(1);
    }
    checkCoinCollision();
}

function endGame() {
    alert("You were caught! Returning to the menu.");
    gameRunning = false;
    enemies.length = 0;
    bullets.length = 0;
    blueCoins = [];
    yellowCoins = [];
    player.size = 50;
    menu.hidden = false;
    gameCanvas.hidden = true;
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Blue Coins: ${blueCoinCounter}`, 10, 30);
    ctx.fillText(`Yellow Coins: ${yellowCoinCounter}`, 10, 60);
    ctx.fillText(`Hits: ${hitCounter}`, 10, 90); // Відображаємо лічильник попадань
}

let levels = [];
let completedLevels = [];

async function loadLevels() {
    const response = await fetch('levels.json');
    levels = await response.json();
}

function getRandomLevel() {
    const availableLevels = levels.filter(level => !completedLevels.includes(level.id));
    if (availableLevels.length === 0) {
        showCompletionModal(); // Показати модальне вікно, якщо всі рівні завершені
        return null;
    }
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    currentLevel = availableLevels[randomIndex];
    return currentLevel;
}


function checkLevelGoal() {
    if (currentLevel.type === "collect_y") {
        if (yellowCoinCounter >= currentLevel.targetYellowCoins) {
            console.log("Рівень завершено!");
            yellowCoinCounter = 0;
            player.size = 50;
            completeLevel(currentLevel.id);
        }
    } else if (currentLevel.type === "collect_b") {
        if (blueCoinCounter >= currentLevel.targetBlueCoins) {
            console.log("Рівень завершено!");
            blueCoinCounter = 0;
            completeLevel(currentLevel.id);
        }
    } else if(currentLevel.type === "feed"){
        if (hitCounter >= currentLevel.targetFeed) {
            console.log("Рівень завершено!");
            hitCounter = 0;
            completeLevel(currentLevel.id);
        }
    } else if (currentLevel.type === "timer") {
        if (timeRemaining <= 0) {
            console.log("Час завершився! Рівень завершено!");
            stopTimer(); // Зупиняємо таймер
            completeLevel(currentLevel.id);
        }
    }
}

function completeLevel(levelId) {
    if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId); // Додаємо рівень до списку завершених
    }

    if (completedLevels.length === levels.length) {
        showCompletionModal(); // Показати модальне вікно, якщо всі рівні завершені
    } else {
        startNextLevel(); // Почати наступний рівень
    }
}

function startNextLevel() {
    const nextLevel = getRandomLevel();
    startGame(nextLevel);
}



function showCompletionModal() {
    // Перевірка, чи модальне вікно вже відображається
    gameRunning = false;

    if (document.getElementById('completion-modal')) return;

    // Створення елементу для затемнення фону
    const overlay = document.createElement('div');
    overlay.id = 'completion-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    overlay.style.pointerEvents = 'none'; // Заблокувати взаємодію з іншими елементами
    document.body.appendChild(overlay);

    // Створення самого модального вікна
    const modal = document.createElement('div');
    modal.id = 'completion-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.style.textAlign = 'center';
    modal.style.zIndex = '1000';

    // Повідомлення
    const message = document.createElement('p');
    message.innerText = 'Ви пройшли всі рівні! Вітаємо!';
    modal.appendChild(message);

    // Кнопка "Back to Menu"
    const backToMenuButton = document.createElement('button');
    backToMenuButton.innerText = 'Back to Menu';
    backToMenuButton.style.marginTop = '10px';
    backToMenuButton.style.padding = '10px 20px';
    backToMenuButton.style.cursor = 'pointer';

    // Обробник кліку для кнопки "Back to Menu"
    backToMenuButton.addEventListener('click', () => {
        // Видалити модальне вікно і затемнення
        document.body.removeChild(modal);
        document.body.removeChild(overlay);

        // Скидання стану гри
        resetGame();

        // Повернення до меню
        menu.hidden = false; // Показати меню
        gameCanvas.hidden = true; // Приховати екран гри
    });

    modal.appendChild(backToMenuButton);
    document.body.appendChild(modal);
}

let timer; // Інтервал таймера
let timeRemaining = 0; // Час, що залишився
let timerRunning = false; // Флаг, який показує, чи таймер працює

function startTimer(durationInSeconds, onTimerEnd) {
    if (timerRunning) return; // Якщо таймер вже працює, нічого не робимо

    timerRunning = true; // Встановлюємо флаг, що таймер працює
    timeRemaining = durationInSeconds;

    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error('Елемент з ID "timer" не знайдено.');
        return;
    }

    timerElement.textContent = `Time left: ${timeRemaining}s`;

    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time left: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            timerRunning = false; // Таймер завершив роботу
            if (typeof onTimerEnd === 'function') {
                onTimerEnd();
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer); // Зупиняємо таймер
    timerRunning = false; // Скидаємо флаг
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = ''; // Очищаємо текст таймера
        //timerElement.style.visibility = 'hidden'; // Ховаємо таймер
    }
}



// Функція для скидання стану гри
function resetGame(caught) {
    completedLevels = [];
    currentLevel = null;
    yellowCoinCounter = 0;
    blueCoinCounter = 0;
    stopTimer();
    if(caught == 1)
        alert("You were caught! Returning to the menu.");
    console.log("Гра скинута. Повернення в меню.");
    enemies.length = 0;
    bullets.length = 0;
    blueCoins = [];
    yellowCoins = [];
    player.size = 50;
    hitCounter = 0; // Скидаємо лічильник попадань
    menu.hidden = false;
    gameCanvas.hidden = true;
}



function gameLoop(timestamp) {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawBackground();
    movePlayer();
    moveEnemies();

    drawPlayer(timestamp);
    if ((currentLevel && currentLevel.type !== "collect_y") && (currentLevel && currentLevel.type !== "collect_b")) {
        blueCoins = [];
        yellowCoins = [];
    } else if (currentLevel && currentLevel.type !== "collect_b") {
        drawYellowCoins(timestamp);
        blueCoins = [];
    } else if (currentLevel && currentLevel.type !== "collect_y") {
        drawBlueCoins(timestamp);
        yellowCoins = [];
    }

    if (currentLevel && currentLevel.type === "feed"){
        moveBullets();
        drawBullets();

    }
    drawEnemies(timestamp);

    drawScore();
    checkCollision();
    checkLevelGoal();
    requestAnimationFrame(gameLoop);
}



function startGame() {
    for (let key in keys) {
        keys[key] = false;
    }

    const selectedLevel = getRandomLevel();
    if (!selectedLevel) return;
    currentLevel = selectedLevel;

    console.log(`Поточний рівень: ${currentLevel.description}`);

    bullets.length = 0;
    blueCoins = [];
    yellowCoins = [];
    blueCoinCounter = 0;
    yellowCoinCounter = 0;
    gameRunning = false;
    // Викликаємо створення ворогів з параметрами рівня
    createEnemies(currentLevel.enemyCount, currentLevel.enemySpeed);



    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawBackground();
    drawPlayer();
    drawEnemies();
    drawBlueCoins();
    drawYellowCoins();
    drawScore();
    // Якщо рівень типу "timer", запускаємо таймер
    if (currentLevel.type === "timer") {
        startTimer(currentLevel.duration, () => {
            console.log("Час завершився! Рівень завершено!");
            checkLevelGoal(); // Викликаємо перевірку мети рівня
        });
    } else {
        stopTimer(); // Зупиняємо таймер для інших типів рівнів
    }
    setTimeout(() => {
        gameRunning = true;
        gameLoop();
    }, 2000);
}


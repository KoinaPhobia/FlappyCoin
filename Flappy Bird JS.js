document.addEventListener('DOMContentLoaded', (event) => {
    const playButton = document.getElementById('play-button');
    const gameContainer = document.getElementById('game-container');
    const menu = document.getElementById('menu');
    const bird = document.getElementById('bird-for-play');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const pointsDisplay = document.getElementById('points');

    let birdY = canvas.height / 2;
    let birdX = canvas.width / 4;
    let gravity = 0.6;
    let lift = -15;
    let velocity = 0;
    let points = 0;
    let pipes = [];
    const pipeWidth = 60;
    const pipeGap = 200;
    const pipeSpeed = 2;
    let isPlaying = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        birdY = canvas.height / 2;
        birdX = canvas.width / 4;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    bird.addEventListener('click', startGame);

    function startGame() {
        isPlaying = true;
        menu.classList.add('hidden');
        gameContainer.style.display = 'block';
        setTimeout(() => {
            gameLoop();
        }, 1000); // delay for transition
        bird.removeEventListener('click', startGame);
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update bird position
        velocity += gravity;
        birdY += velocity;

        // Prevent bird from falling off screen
        if (birdY > canvas.height) {
            birdY = canvas.height;
            velocity = 0;
        } else if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }

        // Draw bird
        ctx.fillStyle = '#FF0';
        ctx.beginPath();
        ctx.arc(birdX, birdY, 20, 0, 2 * Math.PI);
        ctx.fill();

        // Draw pipes
        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;

            if (pipe.x + pipeWidth < 0) {
                pipes.shift();
                points += 10;
                pointsDisplay.textContent = points;
                showPlus10Animation();
            }

            ctx.fillStyle = '#228B22';
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);

            if (collidesWithPipe(pipe)) {
                resetGame();
            }
        });

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
            addPipe();
        }

        requestAnimationFrame(gameLoop);
    }

    function addPipe() {
        let top = Math.random() * (canvas.height - pipeGap);
        let bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
    }

    function collidesWithPipe(pipe) {
        return (
            birdX + 20 > pipe.x &&
            birdX - 20 < pipe.x + pipeWidth &&
            (birdY - 20 < pipe.top || birdY + 20 > canvas.height - pipe.bottom)
        );
    }

    function resetGame() {
        isPlaying = false;
        pipes = [];
        points = 0;
        pointsDisplay.textContent = points;
        birdY = canvas.height / 2;
        menu.classList.remove('hidden');
        gameContainer.style.display = 'none';
        bird.addEventListener('click', startGame);
    }

    function showPlus10Animation() {
        const plus10 = document.createElement('div');
        plus10.textContent = '+10';
        plus10.style.position = 'absolute';
        plus10.style.top = '50%';
        plus10.style.left = '50%';
        plus10.style.transform = 'translate(-50%, -50%)';
        plus10.style.fontSize = '2em';
        plus10.style.color = '#FF0';
        document.body.appendChild(plus10);

        plus10.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 1000,
            easing: 'ease-out'
        });

        setTimeout(() => {
            document.body.removeChild(plus10);
        }, 1000);
    }

    window.addEventListener('keydown', () => {
        if (isPlaying) {
            velocity += lift;
        }
    });
});

/* cake_script.js - Game Logic */

const screens = document.querySelectorAll('.screen');
let currentScreen = 'start-screen';
let audioCtx = null;
let isMusicPlaying = false;

// Audio: Happy Birthday Melody (Same notes, just cleaner implementation)
const melody = [
    { n: 261.63, d: 0.5 }, { n: 261.63, d: 0.5 }, { n: 293.66, d: 1.0 }, { n: 261.63, d: 1.0 }, { n: 349.23, d: 1.0 }, { n: 329.63, d: 2.0 },
    { n: 261.63, d: 0.5 }, { n: 261.63, d: 0.5 }, { n: 293.66, d: 1.0 }, { n: 261.63, d: 1.0 }, { n: 392.00, d: 1.0 }, { n: 349.23, d: 2.0 }
];

function playMusic() {
    if (isMusicPlaying) return;
    isMusicPlaying = true;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    let time = audioCtx.currentTime;
    melody.forEach(m => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = m.n;
        osc.type = 'sine';
        gain.gain.value = 0.1;

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(time);
        osc.stop(time + m.d * 0.4);
        time += m.d * 0.5;
    });

    // Loop
    setTimeout(() => {
        if (isMusicPlaying) {
            isMusicPlaying = false;
            playMusic();
        }
    }, (time - audioCtx.currentTime) * 1000 + 1000);
}

function switchScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    currentScreen = id;
}

// Particle System
function spawnParticles(x, y, type = 'star', count = 10) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.innerText = type === 'star' ? '✨' : (type === 'heart' ? '❤️' : '🧁');
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        // Random Trajectory
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        p.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');

        document.getElementById('particles').appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

// Start Game
document.getElementById('start-game-btn').addEventListener('click', () => {
    playMusic();
    startLevel1();
});

// Home Navigation
document.getElementById('home-btn').addEventListener('click', () => {
    // Flag already set in script.js, but let's be safe
    sessionStorage.setItem('booted', 'true');
    window.location.href = 'index.html';
});

// Level 1: Gather
let lvl1Score = 0;
let lvl1Interval;

function startLevel1() {
    switchScreen('level-1');
    lvl1Score = 0;
    document.getElementById('score-1').innerText = 0;

    // Mouse Tracker for Bowl
    const bowl = document.getElementById('bowl-cursor');
    document.addEventListener('mousemove', (e) => {
        if (currentScreen !== 'level-1') return;
        bowl.style.left = e.clientX + 'px';
        bowl.style.top = e.clientY + 'px';
    });

    // Spawning logic
    lvl1Interval = setInterval(() => {
        if (lvl1Score >= 5) {
            clearInterval(lvl1Interval);
            setTimeout(startLevel2, 1000);
            return;
        }

        const item = document.createElement('div');
        item.classList.add('falling-ingredient');
        item.innerText = ['🥚', '🥡', '🥛', '🍓', '🍒'][Math.floor(Math.random() * 5)];
        item.style.left = Math.random() * (window.innerWidth - 100) + 50 + 'px';
        document.getElementById('game-area-1').appendChild(item);

        // Fall Animation (JS based for collision detection)
        let posY = -100;
        const speed = Math.random() * 3 + 2;

        const fallAnim = setInterval(() => {
            posY += speed;
            item.style.top = posY + 'px';

            // Collision Check with Bowl
            const bowlRect = bowl.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            // Simple overlap check
            if (
                itemRect.left < bowlRect.right &&
                itemRect.right > bowlRect.left &&
                itemRect.top < bowlRect.bottom &&
                itemRect.bottom > bowlRect.top
            ) {
                // CAUGHT!
                clearInterval(fallAnim);
                item.remove();
                lvl1Score++;
                document.getElementById('score-1').innerText = lvl1Score;
                spawnParticles(itemRect.left, itemRect.top, 'heart');
            }

            if (posY > window.innerHeight) {
                clearInterval(fallAnim);
                item.remove();
            }
        }, 16); // ~60fps

    }, 1500);
}

// Level 2: Mix
let mixProgress = 0;
function startLevel2() {
    switchScreen('level-2');
    mixProgress = 0;
    document.getElementById('mix-progress').style.width = '0%';
    const spoon = document.getElementById('spoon');
    const btn = document.getElementById('mix-btn');

    btn.onclick = (e) => {
        mixProgress += 10;
        document.getElementById('mix-progress').style.width = mixProgress + '%';
        spawnParticles(e.clientX, e.clientY, 'star', 5);

        // Rotate Spoon
        spoon.style.transform = `rotate(-${Math.random() * 30 + 10}deg) translate(-10px, 10px)`;
        setTimeout(() => spoon.style.transform = 'none', 100);

        if (mixProgress >= 100) {
            btn.innerText = "BAKED!";
            btn.onclick = null;
            setTimeout(startLevel3, 1500);
        }
    };
}

// Level 3: Wish
function startLevel3() {
    switchScreen('level-3');
    // Spawn Candles
    const row = document.getElementById('candles-row');
    row.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const c = document.createElement('div');
        c.className = 'candle';
        c.innerHTML = '<div class="flame"></div>';
        row.appendChild(c);
    }

    document.getElementById('blow-btn').onclick = (e) => {
        spawnParticles(e.clientX, e.clientY, 'star', 20);
        const flames = document.querySelectorAll('.flame');
        flames.forEach(f => {
            f.style.opacity = 0;
            // Smoke
            const s = document.createElement('div');
            s.className = 'smoke';
            f.parentNode.appendChild(s);
        });

        setTimeout(startFinal, 2000);
    };
}

// Final
function startFinal() {
    switchScreen('final-screen');
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        spawnParticles(x, y, Math.random() > 0.5 ? 'heart' : 'star');
    }, 500);
}

document.getElementById('replay-btn').onclick = () => {
    location.reload();
};

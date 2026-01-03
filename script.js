document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const passwordScreen = document.getElementById('password-screen');
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const desktop = document.getElementById('desktop');
    const clockElement = document.getElementById('clock');

    // Boot Sequence Logic
    const powerScreen = document.getElementById('power-screen');
    const powerBtn = document.querySelector('.power-btn-container');
    const osSelectionScreen = document.getElementById('os-selection-screen');
    const osMac = document.getElementById('os-mac');
    const osWindows = document.getElementById('os-windows');

    // Find Shutdown Button (it's a div, not li)
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const shutdownBtn = Array.from(dropdownItems).find(item => item.textContent.trim() === 'Shut Down...');

    // Initial State Check for "Back from Game"
    const isBooted = sessionStorage.getItem('booted');

    if (isBooted) {
        // Skip Boot
        powerScreen.style.display = 'none';
        osSelectionScreen.style.display = 'none';
        loadingScreen.style.display = 'none';
        passwordScreen.style.display = 'none';
        desktop.classList.remove('hidden');
        desktop.style.opacity = '1';
    } else {
        // Standard Boot Flow
        powerScreen.style.display = 'flex';
        osSelectionScreen.style.display = 'none';
        loadingScreen.style.display = 'none';
        passwordScreen.style.display = 'none';
        desktop.classList.add('hidden');
    }

    // 1. Click Power Button
    powerBtn.addEventListener('click', () => {
        powerScreen.style.display = 'none';
        osSelectionScreen.style.display = 'flex';
    });

    // 2. OS Selection
    // Windows Logic (Reject)
    osWindows.addEventListener('click', () => {
        // Create custom overlay or alert styled nicely
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
            color: white; font-size: 24px; font-family: 'Patrick Hand', cursive;
            flex-direction: column; text-align: center;
        `;
        msg.innerHTML = `
            <div style="background: rgba(30, 30, 30, 0.9); padding: 50px; border-radius: 30px; border: 2px solid #ff5e62; backdrop-filter: blur(20px); box-shadow: 0 0 50px rgba(255, 94, 98, 0.3);">
                <div style="font-size: 80px; margin-bottom: 20px;">😒</div>
                <h2 style="font-family:'Patrick Hand'; font-size: 32px; margin-bottom:10px; color: #ff5e62;">WRONG CHOICE!</h2>
                <p style="font-size: 20px; color: #ddd;">C'mon, change your taste in laptops!</p>
                <p style="font-size: 18px; color: #aaa;">Choose Power over Windows.</p>
                <div style="margin-top: 30px; font-size: 14px; color: #666; font-family:'Inter';">(Click anywhere to return)</div>
            </div>
        `;
        document.body.appendChild(msg);

        msg.addEventListener('click', () => {
            msg.remove();
        });
    });

    // Mac Logic (Success -> Boot)
    osMac.addEventListener('click', () => {
        // Success Message
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
            color: white; font-size: 24px; font-family: 'Patrick Hand', cursive;
        `;
        msg.innerHTML = `
            <div style="background: rgba(30, 30, 30, 0.9); padding: 50px; border-radius: 30px; border: 2px solid #00c6ff; backdrop-filter: blur(20px); box-shadow: 0 0 50px rgba(0, 198, 255, 0.3);">
                <div style="font-size: 80px; margin-bottom: 20px; text-align: center;">🎉</div>
                <h2 style="font-family:'Patrick Hand'; font-size: 40px; margin-bottom:10px; color: #00c6ff;">GREAT CHOICE!</h2>
                <p style="font-size: 20px; color: #ddd;">Powering up macOS...</p>
            </div>
        `;
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.remove();
            osSelectionScreen.style.display = 'none';
            loadingScreen.style.display = 'flex'; // Start original loading screen
            startBootAnimation();
        }, 1500);
    });

    function startBootAnimation() {
        loadingScreen.style.opacity = '1';
        progressBarFill.style.width = '0%'; // Reset

        setTimeout(() => {
            // Start progress bar animation
            progressBarFill.style.width = '30%';

            setTimeout(() => {
                progressBarFill.style.width = '70%';
            }, 2000);

            setTimeout(() => {
                progressBarFill.style.width = '90%';
            }, 4000);

            setTimeout(() => {
                progressBarFill.style.width = '100%';

                // Finish loading, Transition to Password Screen
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';

                    // Show Password Screen
                    passwordScreen.style.display = 'flex';
                    // Small delay to allow display:flex to apply before opacity transition
                    setTimeout(() => {
                        passwordScreen.style.opacity = '1';
                    }, 50);

                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        passwordInput.focus();
                    }, 1000);
                }, 1000); // Wait bit longer at 100%
            }, 5000); // Slightly longer load time for effect
        }, 500);
    }

    // Shutdown Implementation
    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', () => {
            // 1. Fade out Desktop
            desktop.style.transition = 'opacity 1s';
            desktop.style.opacity = '0';

            setTimeout(() => {
                // 2. Hide Desktop & Show Loading Screen (Shutdown Mode)
                desktop.classList.add('hidden');

                // Hide progress bar for shutdown, show only logo (spinner effect)
                const progressBarTrack = document.querySelector('.progress-bar-track');
                if (progressBarTrack) progressBarTrack.style.display = 'none';

                loadingScreen.style.display = 'flex';
                // Trigger reflow/opacity transition
                setTimeout(() => { loadingScreen.style.opacity = '1'; }, 50);

                // 3. Wait (Shutdown Animation)
                setTimeout(() => {
                    // Fade out loading screen
                    loadingScreen.style.opacity = '0';

                    // 4. Return to Power Screen
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        // Reset progress bar visibility for next boot
                        if (progressBarTrack) progressBarTrack.style.display = 'block';

                        powerScreen.style.display = 'flex';

                        // Reset state variables just in case
                        passwordScreen.style.display = 'none';

                    }, 1000);
                }, 3000); // 3 seconds shutdown time
            }, 1000); // Wait for desktop fade out
        });
    }

    // Header: Login Logic
    function attemptLogin() {
        const password = passwordInput.value;
        if (password === 'Aish@202007') {
            // Success
            passwordScreen.style.opacity = '0';

            setTimeout(() => {
                passwordScreen.style.display = 'none';
                desktop.classList.remove('hidden');
                desktop.style.opacity = '1';
            }, 1000);
        } else {
            // Shake effect for wrong password
            const loginContainer = document.querySelector('.login-container');
            passwordInput.value = ''; // Clear input if wrong
            loginContainer.classList.add('shake');
            setTimeout(() => {
                loginContainer.classList.remove('shake');
            }, 400);
        }
    }

    loginBtn.addEventListener('click', attemptLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    // Clock
    function updateClock() {
        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const dayNum = now.getDate();

        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const timeString = `${dayName} ${monthName} ${dayNum} ${hours}:${minutes} ${ampm}`;
        clockElement.textContent = timeString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Dock Icon Bouncing
    const dockIcons = document.querySelectorAll('.dock-icon');
    dockIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            // Bounce Animation
            if (!icon.classList.contains('bounce')) {
                icon.classList.add('bounce');
                setTimeout(() => {
                    icon.classList.remove('bounce');
                }, 1800);
            }
            // Active State (Simple toggle for now)
            dockIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });

    /* -----------------------------------
       Visual interactions (Menu, etc)
       ----------------------------------- */

    // Apple Menu
    const appleMenuBtn = document.getElementById('apple-menu-btn');
    const appleDropdown = document.getElementById('apple-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    appleMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = appleDropdown.style.display === 'flex';
        closeAllMenus();
        if (!isVisible) {
            appleDropdown.style.display = 'flex';
            appleMenuBtn.querySelector('img').style.filter = "brightness(0) invert(1)";
        }
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            closeAllMenus();
            desktop.style.opacity = '0';
            setTimeout(() => {
                desktop.classList.add('hidden');
                desktop.style.display = 'none';
                passwordScreen.style.display = 'flex';
                passwordInput.value = '';
                sessionStorage.removeItem('booted'); // Clear booted state on logout
                setTimeout(() => {
                    passwordScreen.style.opacity = '1';
                    passwordInput.focus();
                }, 50);
            }, 500);
        });
    }

    // Control Center
    const controlCenterBtn = document.getElementById('control-center-btn');
    const controlCenter = document.getElementById('control-center');

    controlCenterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = controlCenter.style.display === 'flex';
        closeAllMenus();
        if (!isVisible) {
            controlCenter.style.display = 'flex';
            controlCenterBtn.querySelector('img').style.filter = "brightness(0) invert(1)";
        }
    });

    // Context Menu
    const contextMenu = document.getElementById('context-menu');
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        closeAllMenus();
        contextMenu.style.display = 'flex';
        let x = e.pageX;
        let y = e.pageY;
        if (x + 200 > window.innerWidth) x -= 200;
        if (y + 200 > window.innerHeight) y -= 200;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
    });

    window.addEventListener('click', () => {
        closeAllMenus();
    });

    function closeAllMenus() {
        appleDropdown.style.display = 'none';
        contextMenu.style.display = 'none';
        controlCenter.style.display = 'none';

        // Reset Icons
        document.querySelector('#apple-menu-btn img').style.filter = "brightness(0)";
        document.querySelector('#control-center-btn img').style.filter = "brightness(0)";
    }

    // Windows Opening Logic
    const aboutBtn = document.getElementById('about-mac-btn');
    const aboutWindow = document.getElementById('about-window');
    const closeAbout = document.querySelector('.close-btn'); // For About window

    aboutBtn.addEventListener('click', () => {
        aboutWindow.style.display = 'flex';
        bringToFront(aboutWindow);
    });

    closeAbout.addEventListener('click', (e) => {
        e.stopPropagation();
        aboutWindow.style.display = 'none';
    });

    /* -----------------------------------
       Window Dragging Logic (Unified)
       ----------------------------------- */
    const windowHeaders = document.querySelectorAll('.window-header');

    windowHeaders.forEach(header => {
        header.onmousedown = function (event) {
            if (event.target.classList.contains('control-btn')) return;

            const win = header.closest('.window');
            bringToFront(win);

            // Calculate shift relative to the window's current position
            let shiftX = event.clientX - win.getBoundingClientRect().left;
            let shiftY = event.clientY - win.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            header.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                header.onmouseup = null;
            };
        };

        header.ondragstart = function () {
            return false;
        };
    });

    function bringToFront(win) {
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = 100);
        win.style.zIndex = 102;
    }

    /* -----------------------------------
       Photos App Logic 
       ----------------------------------- */
    const photosDockBtn = document.getElementById('photos-dock-btn');
    const photosWindow = document.getElementById('photos-window');
    const closePhotos = document.getElementById('close-photos');
    const minimizePhotos = document.getElementById('minimize-photos');
    const maximizePhotos = photosWindow ? photosWindow.querySelector('.zoom-btn') : null;
    const resizeHandle = photosWindow ? photosWindow.querySelector('.resize-handle') : null;

    if (photosDockBtn) {
        photosDockBtn.addEventListener('click', () => {
            // Calculate Center Position
            const winWidth = 1100; // Match CSS
            const winHeight = 700; // Match CSS
            const left = (window.innerWidth - winWidth) / 2;
            const top = (window.innerHeight - winHeight) / 2;

            photosWindow.style.left = `${left}px`;
            photosWindow.style.top = `${top}px`;

            photosWindow.style.display = 'flex';
            bringToFront(photosWindow);

            // Animation Reset
            photosWindow.style.opacity = '0';
            photosWindow.style.transform = 'scale(0.95)';
            photosWindow.style.transition = 'opacity 0.2s, transform 0.2s';
            void photosWindow.offsetWidth; // Trigger reflow
            photosWindow.style.opacity = '1';
            photosWindow.style.transform = 'scale(1)';

            photosDockBtn.classList.add('active');
        });
    }

    if (closePhotos) {
        closePhotos.addEventListener('click', (e) => {
            e.stopPropagation();
            photosWindow.style.opacity = '0';
            photosWindow.style.transform = 'scale(0.95)';
            setTimeout(() => {
                photosWindow.style.display = 'none';
                photosDockBtn.classList.remove('active');
            }, 200);
        });
    }

    if (minimizePhotos) {
        minimizePhotos.addEventListener('click', (e) => {
            e.stopPropagation();
            photosWindow.style.opacity = '0';
            setTimeout(() => {
                photosWindow.style.display = 'none';
            }, 200);
        });
    }

    // Maximize / Zoom Logic
    if (maximizePhotos) {
        let isMaximized = false;
        let preMaxState = { width: '', height: '', top: '', left: '' };

        maximizePhotos.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isMaximized) {
                // Save current state
                preMaxState.width = photosWindow.style.width;
                preMaxState.height = photosWindow.style.height;
                preMaxState.top = photosWindow.style.top;
                preMaxState.left = photosWindow.style.left;

                // Maximize
                photosWindow.style.width = '100%';
                photosWindow.style.height = 'calc(100% - 30px)'; // Account for Menu bar
                photosWindow.style.top = '30px'; // Below menu bar
                photosWindow.style.left = '0';
                photosWindow.style.borderRadius = '0';
                isMaximized = true;
            } else {
                // Restore
                photosWindow.style.width = preMaxState.width || '1100px';
                photosWindow.style.height = preMaxState.height || '700px';
                photosWindow.style.top = preMaxState.top;
                photosWindow.style.left = preMaxState.left;
                photosWindow.style.borderRadius = '10px';
                isMaximized = false;
            }
        });
    }

    // Resizing Logic
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            function resize(e) {
                const newWidth = e.pageX - photosWindow.getBoundingClientRect().left;
                const newHeight = e.pageY - photosWindow.getBoundingClientRect().top;

                if (newWidth > 300) photosWindow.style.width = newWidth + 'px';
                if (newHeight > 200) photosWindow.style.height = newHeight + 'px';
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
            }
        });
    }

    // Sidebar Navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const galleryTitle = document.querySelector('.gallery-title');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const text = item.querySelector('.sidebar-text').innerText;
            if (galleryTitle) galleryTitle.innerText = text;
        });
    });

    // Video Player Logic (Placeholder)
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            // Future: Open video player
            // For now, let's just create a simple Alert or Overlay
            // We can create a video overlay dynamically
            // Check if overlay exists
            let overlay = document.getElementById('video-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'video-overlay';
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); z-index: 9999;
                    display: flex; justify-content: center; align-items: center;
                `;
                overlay.innerHTML = `
                    <div style="position: relative; width: 80%; max-width: 800px; aspect-ratio: 16/9; background: #000; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                        <button id="close-video" style="position: absolute; top: -30px; right: 0; color: white; background: none; border: none; font-size: 20px; cursor: pointer;">✕</button>
                        <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; color:#666;">
                            [Video Player Placeholder]
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);

                document.getElementById('close-video').addEventListener('click', () => {
                    overlay.remove();
                });

                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) overlay.remove();
                });
            }
        });
    });

    /* -----------------------------------
       Birthday Cake Game Logic
       ----------------------------------- */
    const cakeDockBtn = document.getElementById('cake-dock-btn');
    const cakeWindow = document.getElementById('cake-window');
    const closeCake = document.getElementById('close-cake');
    const minimizeCake = document.getElementById('minimize-cake');

    // Audio Context for "Happy Birthday" Tune
    let audioCtx = null;
    let isPlayingMusic = false;

    // Game State
    let currentLevel = 1;
    let scoreLvl1 = 0;
    let mixProgress = 0;

    // Elements
    const level1 = document.getElementById('cake-level-1');
    const level2 = document.getElementById('cake-level-2');
    const level3 = document.getElementById('cake-level-3');
    const finalScreen = document.getElementById('cake-final');

    // Level 1 Elements
    // Level 1 Elements
    const gameArea1 = document.getElementById('game-area-1');
    const itemsCollectedSpan = document.getElementById('items-collected');
    let fallingInterval = null;
    let balloonInterval = null;

    // Window Logic
    // Window Logic
    if (cakeDockBtn) {
        cakeDockBtn.addEventListener('click', () => {
            // Open Dedicated Game App in SAME TAB
            window.location.href = 'cake_game.html';
            cakeDockBtn.classList.add('active');
            setTimeout(() => cakeDockBtn.classList.remove('active'), 2000); // Reset active state visual
        });
    }

    /* --- Particle System --- */
    function createParticles(x, y, count = 10, type = 'star') {
        const particlesContainer = document.body;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.innerText = type === 'star' ? '✨' : (type === 'heart' ? '❤️' : '🧁');
            p.style.position = 'absolute';
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.fontSize = Math.random() * 20 + 10 + 'px';
            p.style.pointerEvents = 'none';
            p.style.zIndex = 1000;
            p.style.transition = 'all 1s ease-out';

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particlesContainer.appendChild(p);

            // Animate
            requestAnimationFrame(() => {
                p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                p.style.opacity = '0';
            });

            setTimeout(() => p.remove(), 1000);
        }
    }

    /* -----------------------------------
       Hidden Hearts Logic
       ----------------------------------- */
    function spawnHiddenHearts() {
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.classList.add('hidden-heart');
            heart.innerText = '❤️';
            // Random position on desktop
            heart.style.top = Math.random() * 80 + 10 + '%';
            heart.style.left = Math.random() * 90 + 5 + '%';

            // Messages
            const msgs = ["You're Cute!", "Love You!", "Cutie!", "My Fav!", "Sweetheart", "Forever!"];

            heart.addEventListener('click', () => {
                if (!heart.classList.contains('found')) {
                    heart.classList.add('found');

                    // Show message tooltip
                    const msg = document.createElement('div');
                    msg.innerText = msgs[i] || "Love!";
                    msg.style.position = 'absolute';
                    msg.style.top = '-30px';
                    msg.style.left = '50%';
                    msg.style.transform = 'translateX(-50%)';
                    msg.style.background = 'white';
                    msg.style.padding = '5px 10px';
                    msg.style.borderRadius = '10px';
                    msg.style.fontSize = '14px';
                    msg.style.fontFamily = 'Patrick Hand';
                    msg.style.whiteSpace = 'nowrap';
                    msg.style.pointerEvents = 'none';
                    heart.appendChild(msg);
                }
            });

            document.getElementById('desktop').appendChild(heart);
        }
    }

    // Init Hearts
    spawnHiddenHearts();

    const playGameBtn = document.getElementById('play-game-btn');
    const gameOverlay = document.getElementById('password-game-overlay');
    const closeGameBtn = gameOverlay ? gameOverlay.querySelector('.close-game-btn') : null;
    const puzzleDisplay = document.getElementById('password-puzzle');
    const gameKeyboard = document.getElementById('game-keyboard');
    const gameStatus = document.getElementById('game-status');

    const TARGET_PASSWORD = "Aish@202007";
    let guessedLetters = new Set();

    if (playGameBtn && gameOverlay) {
        playGameBtn.addEventListener('click', () => {
            gameOverlay.style.display = 'flex';
            resetGame();
        });

        closeGameBtn.addEventListener('click', () => {
            gameOverlay.style.display = 'none';
        });

        // Close on clicking outside
        gameOverlay.addEventListener('click', (e) => {
            if (e.target === gameOverlay) gameOverlay.style.display = 'none';
        });
    }

    function resetGame() {
        guessedLetters.clear();
        updatePuzzleDisplay();
        createKeyboard();
        gameStatus.innerText = "Pick a letter...";
        gameStatus.style.color = "rgba(255,255,255,0.7)";
    }

    function updatePuzzleDisplay() {
        if (!puzzleDisplay) return;

        let displayHTML = "";
        let allGuessed = true;

        for (let char of TARGET_PASSWORD) {
            if (guessedLetters.has(char.toLowerCase())) {
                displayHTML += char + " ";
            } else {
                displayHTML += "_ ";
                allGuessed = false;
            }
        }
        puzzleDisplay.innerText = displayHTML; // Using text for safety

        if (allGuessed) {
            gameWin();
        }
    }

    function createKeyboard() {
        if (!gameKeyboard) return;
        gameKeyboard.innerHTML = '';

        // Define keys: A-Z, 0-9, @
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@".split("");

        chars.forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'key-btn';
            btn.innerText = char;

            btn.addEventListener('click', () => handleGuess(char, btn));

            gameKeyboard.appendChild(btn);
        });
    }

    function handleGuess(char, btn) {
        const lowerChar = char.toLowerCase();

        // Disable button
        btn.disabled = true;

        if (TARGET_PASSWORD.toLowerCase().includes(lowerChar)) {
            guessedLetters.add(lowerChar);
            btn.classList.add('correct');
            gameStatus.innerText = "Good guess! Keep going!";
            gameStatus.style.color = "#4cd137";
            updatePuzzleDisplay();
        } else {
            btn.classList.add('wrong');
            gameStatus.innerText = "Oops! Try again.";
            gameStatus.style.color = "#e84118";
        }
    }

    function gameWin() {
        gameStatus.innerText = "PASSWORD UNLOCKED! 🎉";
        gameStatus.style.color = "#00a8ff";

        // Confetti visual (optional, but let's just do actions)
        setTimeout(() => {
            gameOverlay.style.display = 'none';

            // Fill Password
            const passwordInput = document.getElementById('password-input');
            if (passwordInput) {
                passwordInput.value = TARGET_PASSWORD;

                // Simulate Login Click
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) {
                    loginBtn.click();
                }
            }
        }, 1500);
    }

});

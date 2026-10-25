(() => {
  // Elements
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const giftBox = document.getElementById('giftBox');
  const giftTapPrompt = document.getElementById('giftTapPrompt');
  const giftNextArea = document.getElementById('giftNextArea');
  const giftNextYesBtn = document.getElementById('giftNextYesBtn');
  const giftNextNoBtn = document.getElementById('giftNextNoBtn');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');
  const step5 = document.getElementById('step5');
  const step6 = document.getElementById('step6');
  const toMemoriesBtn = document.getElementById('toMemoriesBtn');
  const toVideoBtn = document.getElementById('toVideoBtn');
  const toWishBtn = document.getElementById('toWishBtn');
  const videoNextNoBtn = document.getElementById('videoNextNoBtn');
  const wishNextNoBtn = document.getElementById('wishNextNoBtn');
  const birthdayVideo = document.getElementById('birthdayVideo');
  const backToMemoriesBtn = document.getElementById('backToMemoriesBtn');
  const backToVideoBtn = document.getElementById('backToVideoBtn');
  const replayFromVideoBtn = document.getElementById('replayFromVideoBtn');
  const replayFromWishBtn = document.getElementById('replayFromWishBtn');
  const cakeNextNoBtn = document.getElementById('cakeNextNoBtn');
  const backToCakeBtn = document.getElementById('backToCakeBtn');
  const replaySurpriseBtn = document.getElementById('replaySurpriseBtn');
  const toggleCarouselBtn = document.getElementById('toggleCarouselBtn');
  const carouselPlayIcon = document.getElementById('carouselPlayIcon');
  const carouselPlayText = document.getElementById('carouselPlayText');
  const dualCarousel = document.getElementById('dualCarousel');
  const mainWrapper = document.querySelector('.main-wrapper');

  // Modal elements
  const memoryModal = document.getElementById('memoryModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalImg = document.getElementById('modalImg');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalHeartBtn = document.getElementById('modalHeartBtn');
  const modalHeartCount = document.getElementById('modalHeartCount');
  const modalHeartBurst = document.getElementById('modalHeartBurst');

  const toast = document.getElementById('toast');
  const particleCanvas = document.getElementById('particleCanvas');
  const flowerDropLayer = document.getElementById('flowerDropLayer');
  const audio = document.getElementById('birthdayMusic');
  const musicBtn = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');

  // Rich collection of unique words & reactions for the running button and floating badges
  const uniqueWords = [
    'Nu-uh! 🙈',
    'Nope! 😜',
    'Nu-uhhh! 🙅‍♀️',
    'No way! 💨',
    'Nuh-uh! Not today! 💃',
    'Too slow! 🏃‍♂️💨',
    'Can’t catch me! 💨',
    'Nu-uh, try again! 😂',
    'Nooooope! 🏃‍♀️💨',
    'Still No? 🙈',
    'Nu-uhhh Madhuri! 🎀',
    'Wrong button! 🚨',
    'Please say Yes! 🥺👉👈',
    'Nu-uh! Not happening! 🤭',
    'Only YES! 💕',
    'Nope nope nope! 🌪️',
    'Error 404: No not found 🚫',
    'Madhuri says YES! 💖',
    'Nuh-uh! Think again! 🤔',
    'Nu-uh! Can’t touch this! 🎶',
    'Mission Impossible! 🕶️',
    'Big NOPE! 🚫',
    'Nu-uh! Only YES allowed! 🥰',
    'Try YES cutie! ✨',
    'Nice attempt haha 😚',
    'Never in a million years! 🤣',
    'Access Denied: No ❌',
    'Look at me go! 🚀',
    'Surrender to YES! 🥰',
    'Keep chasing! 🏃‍♀️',
    'You really thought? 🙈',
    '100% YES only! 🌸',
    'No is on vacation! 🏖️',
    'Just click YES! 💖',
    'Nope! Over here! 😜',
    'Not today! 💃',
    'Don’t be shy, say Yes! 🎀',
    'Nu-uh! Try again! 🤭',
    'I believe in YES! 🪄'
  ];

  let wordIndex = 0;
  function getNextUniqueWord() {
    const word = uniqueWords[wordIndex % uniqueWords.length];
    wordIndex++;
    return word;
  }

  let roamInterval = null;
  let spawnedTags = [];
  let toastTimeout;

  // Web Audio Synthesizer for instant cute chime sounds
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Playful pop sound when button jumps or sticker spawns
  function playPopSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      const freq = 440 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 300, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {}
  }

  // Fanfare chime when "Yes" is clicked or Gift is opened
  function playFanfareSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.45);
      });
    } catch (e) {}
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // Get safe random position in viewport - mobile & desktop adaptive
  function getRandomViewportPos(elementWidth = 110, elementHeight = 44) {
    const isMobile = window.innerWidth <= 640;
    const pad = isMobile ? 12 : 24;
    const topLimit = isMobile ? 55 : 75;
    const botLimit = isMobile ? 40 : 55;
    
    const effW = Math.min(elementWidth, window.innerWidth - pad * 2);
    const effH = elementHeight;

    const minX = pad;
    const maxX = Math.max(minX, window.innerWidth - effW - pad);
    const minY = topLimit;
    const maxY = Math.max(minY, window.innerHeight - effH - botLimit);

    return {
      x: Math.floor(Math.random() * (maxX - minX)) + minX,
      y: Math.floor(Math.random() * (maxY - minY)) + minY
    };
  }

  // Spawn an infinite floating roaming "Nope!" tag on the page with unique words
  function spawnFloatingNopeTag() {
    const tag = document.createElement('div');
    const colorClasses = ['nope-tag-pink', 'nope-tag-yellow', 'nope-tag-purple', 'nope-tag-peach', 'nope-tag-mint'];
    const chosenColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    
    tag.className = `nope-floating-tag ${chosenColor}`;
    const word = getNextUniqueWord();
    tag.textContent = word;

    const pos = getRandomViewportPos(110, 40);
    tag.style.left = `${pos.x}px`;
    tag.style.top = `${pos.y}px`;

    // Interactive: hovering/clicking floating tag also makes it dodge
    function dodgeTag() {
      playPopSound();
      const newPos = getRandomViewportPos(110, 40);
      tag.style.left = `${newPos.x}px`;
      tag.style.top = `${newPos.y}px`;
      tag.style.transform = `scale(1.15) rotate(${(Math.random() - 0.5) * 20}deg)`;
      setTimeout(() => {
        tag.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    }

    tag.addEventListener('mouseenter', dodgeTag);
    tag.addEventListener('click', dodgeTag);
    tag.addEventListener('touchstart', dodgeTag, { passive: true });

    document.body.appendChild(tag);
    spawnedTags.push(tag);

    // Slowly drift every 3.2 seconds to keep it roaming
    const tagDriftTimer = setInterval(() => {
      if (!tag.parentElement) {
        clearInterval(tagDriftTimer);
        return;
      }
      const driftPos = getRandomViewportPos(110, 40);
      tag.style.left = `${driftPos.x}px`;
      tag.style.top = `${driftPos.y}px`;
    }, 3200 + Math.random() * 2000);
  }

  // Reusable Runaway Button setup with smooth dodging and infinite unique words
  function setupRunawayButton(buttonEl, customMsg) {
    if (!buttonEl || buttonEl._isRunawayInitialized) return;
    buttonEl._isRunawayInitialized = true;
    let isFixed = false;
    let lastMoveTime = 0;

    function moveBtn() {
      const now = Date.now();
      if (now - lastMoveTime < 60) return;
      lastMoveTime = now;

      playPopSound();

      const rect = buttonEl.getBoundingClientRect();
      const curX = rect.left;
      const curY = rect.top;

      if (!isFixed) {
        buttonEl.style.position = 'fixed';
        buttonEl.style.left = `${curX}px`;
        buttonEl.style.top = `${curY}px`;
        buttonEl.style.margin = '0';
        buttonEl.style.zIndex = '999';
        isFixed = true;
        void buttonEl.offsetWidth; // Force layout reflow
      }

      // Pick new random spot sufficiently far from current spot
      const btnW = buttonEl.offsetWidth || 120;
      const btnH = buttonEl.offsetHeight || 46;
      let pos, attempts = 0;
      do {
        pos = getRandomViewportPos(btnW, btnH);
        attempts++;
      } while (attempts < 20 && Math.hypot(pos.x - curX, pos.y - curY) < 140);

      buttonEl.style.left = `${pos.x}px`;
      buttonEl.style.top = `${pos.y}px`;
      buttonEl.style.transform = `rotate(${(Math.random() - 0.5) * 14}deg)`;

      // Update text with unique word
      const nextPhrase = getNextUniqueWord();
      const textSpan = buttonEl.querySelector('.btn-no-text');
      if (textSpan) {
        textSpan.textContent = nextPhrase;
      } else {
        buttonEl.textContent = nextPhrase;
      }

      // Spawn multiple roaming floating "Nu-uh!" & "Nope!" tags across the page
      spawnFloatingNopeTag();
      setTimeout(() => spawnFloatingNopeTag(), 80);
      if (Math.random() > 0.3) {
        setTimeout(() => spawnFloatingNopeTag(), 160);
      }

      // Start autonomous roaming if not already roaming
      if (!roamInterval) {
        roamInterval = setInterval(() => {
          const roamPos = getRandomViewportPos(buttonEl.offsetWidth || 120, buttonEl.offsetHeight || 46);
          buttonEl.style.left = `${roamPos.x}px`;
          buttonEl.style.top = `${roamPos.y}px`;
          buttonEl.style.transform = `rotate(${(Math.random() - 0.5) * 12}deg)`;
          
          const autoWord = getNextUniqueWord();
          const span = buttonEl.querySelector('.btn-no-text');
          if (span) span.textContent = autoWord;

          if (spawnedTags.length < 15) {
            spawnFloatingNopeTag();
          }
        }, 1500);
      }

      showToast(customMsg || 'Hehe, No keeps running! Say YES! 🥰💖');
    }

    buttonEl.addEventListener('mouseenter', moveBtn);
    buttonEl.addEventListener('mouseover', moveBtn);
    buttonEl.addEventListener('pointerenter', moveBtn);

    buttonEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveBtn();
    });

    buttonEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveBtn();
    });

    buttonEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveBtn();
    }, { passive: false });
  }

  // Setup Step 1 runaway No button
  setupRunawayButton(noBtn, 'Hehe, No keeps running! Say YES! 🥰💖');

  // Celebration Confetti generator
  function launchConfetti(count = 70) {
    const colors = ['#ff407d', '#ff85a2', '#ffd23f', '#70d6ff', '#e02868', '#ffffff', '#ffb3c6'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = `${-20 - Math.random() * 20}px`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${Math.floor(Math.random() * 8) + 8}px`;
      piece.style.height = `${Math.floor(Math.random() * 10) + 10}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      particleCanvas.appendChild(piece);

      setTimeout(() => piece.remove(), 4200);
    }
  }

  // Continuous Falling Flower Petals Animation
  let flowerInterval = null;

  function spawnFallingPetal() {
    if (!flowerDropLayer) return;
    const petal = document.createElement('div');
    petal.className = 'falling-petal';

    const petalItems = ['🌸', '🌺', '🌸', '🌷', '✨', '🌸', '💖'];
    petal.textContent = petalItems[Math.floor(Math.random() * petalItems.length)];

    const startX = Math.random() * 100; // 0 to 100vw
    const duration = 4.5 + Math.random() * 3.5; // 4.5s to 8s
    const size = 16 + Math.random() * 14; // 16px to 30px
    const delay = Math.random() * 0.4;

    petal.style.left = `${startX}vw`;
    petal.style.fontSize = `${size}px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    flowerDropLayer.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, (duration + 1) * 1000);
  }

  function startFlowerDrop() {
    if (flowerInterval) return;
    // Initial burst of flower petals
    for (let i = 0; i < 18; i++) {
      setTimeout(() => spawnFallingPetal(), i * 140);
    }
    // Continuous gentle flower drop
    flowerInterval = setInterval(() => {
      spawnFallingPetal();
    }, 280);
  }

  // Interactive Gift Box Unwrapping: ONLY by tapping the gift box!
  let giftOpened = false;

  function openGift() {
    if (giftOpened) return;
    giftOpened = true;

    if (giftBox) {
      giftBox.classList.add('opened');
    }

    // Hide the initial "TAP TO OPEN" prompt
    if (giftTapPrompt) {
      giftTapPrompt.style.display = 'none';
    }

    // Reveal the "Go to next surprise? Yes / No" options AFTER open!
    if (giftNextArea) {
      giftNextArea.style.display = 'flex';
      // Arm the Step 2 "No" button with runaway animation
      setupRunawayButton(giftNextNoBtn, 'Hehe, you have to see what\'s next! Say YES! 🥰💖');
    }

    playFanfareSound();
    launchConfetti(85);

    // Burst of extra petals from opening
    for (let i = 0; i < 28; i++) {
      setTimeout(() => spawnFallingPetal(), i * 45);
    }

    showToast('Happy Birthday, Madhuri! ♡ Enjoy your surprise! 🌸🎁✨');
  }

  // Tap on Gift Box to open!
  if (giftBox) {
    giftBox.addEventListener('click', openGift);
    giftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGift();
      }
    });
  }

  if (giftTapPrompt) {
    giftTapPrompt.addEventListener('click', openGift);
  }

  // Interactive Cake and Candle Blowing with Real Microphone Blow Detection!
  const cakeInteractive = document.getElementById('cakeInteractive');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const blowBtnIcon = document.getElementById('blowBtnIcon');
  const blowBtnText = document.getElementById('blowBtnText');
  const windGustLayer = document.getElementById('windGustLayer');
  const cakeWishDesc = document.getElementById('cakeWishDesc');
  let candlesBlown = false;
  let isBlowing = false;

  // Microphone Blow Detection: Blow physically onto your device/mic!
  let micStream = null;
  let micAudioContext = null;
  let micAnalyser = null;
  let micListening = false;
  let micAnimId = null;
  let blowHoldFrames = 0;

  async function initMicBlowDetection() {
    if (micListening || candlesBlown) return;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }

      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      micAudioContext = new AudioCtx();
      if (micAudioContext.state === 'suspended') {
        await micAudioContext.resume();
      }

      const source = micAudioContext.createMediaStreamSource(micStream);
      micAnalyser = micAudioContext.createAnalyser();
      micAnalyser.fftSize = 256;
      micAnalyser.smoothingTimeConstant = 0.2;
      source.connect(micAnalyser);

      micListening = true;
      blowHoldFrames = 0;

      if (blowCandleBtn) {
        blowCandleBtn.classList.add('listening');
      }

      showToast('Blow onto your microphone or speaker to blow out the candles! 🌬️🎂');
      checkMicInput();
    } catch (e) {
      console.log('Mic blow detection not started (manual tap is active):', e);
    }
  }

  function checkMicInput() {
    if (!micListening || candlesBlown || !micAnalyser) return;

    const bufferLength = micAnalyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);
    micAnalyser.getByteTimeDomainData(timeData);
    micAnalyser.getByteFrequencyData(freqData);

    // RMS volume calculation
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const val = (timeData[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / bufferLength);

    // Low-frequency breath turbulence energy (bins 1 to 14)
    let lowEnergy = 0;
    const lowCount = Math.min(14, bufferLength);
    for (let i = 1; i < lowCount; i++) {
      lowEnergy += freqData[i];
    }
    const avgLow = lowEnergy / (lowCount - 1);

    // Real breath blow detection: low rumble noise + volume spike
    const isBlowDetected = (rms > 0.08 && avgLow > 32) || (rms > 0.16);

    if (isBlowDetected) {
      blowHoldFrames++;
      // If sustained for 2-3 frames (~60-90ms), trigger real blow!
      if (blowHoldFrames >= 3) {
        stopMicBlowDetection();
        blowCandles();
        return;
      }
    } else {
      if (blowHoldFrames > 0) blowHoldFrames--;
    }

    micAnimId = requestAnimationFrame(checkMicInput);
  }

  function stopMicBlowDetection() {
    micListening = false;
    if (micAnimId) {
      cancelAnimationFrame(micAnimId);
      micAnimId = null;
    }
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }
    if (micAudioContext && micAudioContext.state !== 'closed') {
      try { micAudioContext.close(); } catch(e) {}
      micAudioContext = null;
    }
    if (blowCandleBtn) {
      blowCandleBtn.classList.remove('listening');
    }
  }

  // Sound of sustained realistic blowing breath across candles
  function playBlowSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const duration = 1.5;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.35);
      filter.frequency.linearRampToValueAtTime(750, ctx.currentTime + 1.0);
      filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.25);
      gain.gain.linearRampToValueAtTime(0.30, ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  function blowCandles() {
    if (candlesBlown || isBlowing) return;
    isBlowing = true;
    stopMicBlowDetection();

    // 1. Play sustained blowing sound
    playBlowSound();

    // 2. Activate wind gust animation overlay across cake
    if (windGustLayer) {
      windGustLayer.classList.add('active');
    }

    // 3. Update blow button to show blowing state
    if (blowCandleBtn) {
      blowCandleBtn.classList.add('blowing');
    }
    if (blowBtnIcon) {
      blowBtnIcon.textContent = '🌬️';
    }
    if (blowBtnText) {
      blowBtnText.textContent = 'Blowing the candles... 💨';
    }

    // 4. Bend and shake candle flames dynamically with the wind gust
    const flames = document.querySelectorAll('.candle-flame');
    flames.forEach(flame => {
      flame.classList.add('blowing');
    });

    // 5. After ~1.2s of actual blowing, flames extinguish sequentially with smoke
    flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.remove('blowing');
        flame.classList.add('out');
      }, 1200 + index * 60);
    });

    // 6. After wind completes (~1.5s), finish celebration!
    setTimeout(() => {
      if (windGustLayer) {
        windGustLayer.classList.remove('active');
      }

      if (blowCandleBtn) {
        blowCandleBtn.classList.remove('blowing');
        blowCandleBtn.classList.add('blown');
      }
      if (blowBtnIcon) {
        blowBtnIcon.textContent = '✨';
      }
      if (blowBtnText) {
        blowBtnText.textContent = '25th Birthday Wish Made! ♡';
      }
      const blowCalloutPill = document.getElementById('blowCalloutPill');
      if (blowCalloutPill) {
        blowCalloutPill.innerHTML = '<span class="callout-sparkle">🎂</span><span class="callout-msg">CANDLES BLOWN OUT!</span><span class="callout-sparkle">✨</span>';
      }

      candlesBlown = true;
      isBlowing = false;

      // Celebrate with fanfare, confetti, and flower petals
      playFanfareSound();
      launchConfetti(110);
      for (let i = 0; i < 35; i++) {
        setTimeout(() => spawnFallingPetal(), i * 35);
      }

      if (cakeWishDesc) {
        cakeWishDesc.innerHTML = '✨ <strong>Your wish has been sent to the stars!</strong> May your 25th year be blessed with boundless joy, magical moments, and infinite happiness! 🎂💖';
      }

      showToast('25th Birthday Wish Made! Happy Birthday Madhuri! 🎂✨💖');
    }, 1550);
  }

  // Trigger blowing by clicking the button or tapping the cake box
  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', () => {
      if (!micListening && !candlesBlown && !isBlowing) {
        // Try starting mic if not active, or blow immediately
        initMicBlowDetection().catch(() => {});
      }
      blowCandles();
    });
  }

  if (cakeInteractive) {
    cakeInteractive.addEventListener('click', blowCandles);
    cakeInteractive.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        blowCandles();
      }
    });
  }

  // When "Yes! Next →" is clicked on Step 2 (after gift is opened)
  function proceedToStep3() {
    playFanfareSound();
    launchConfetti(90);

    // Stop roaming
    if (roamInterval) {
      clearInterval(roamInterval);
      roamInterval = null;
    }

    // Hide Step 2 runaway No button
    if (giftNextNoBtn) {
      giftNextNoBtn.style.display = 'none';
    }

    // Clean up spawned floating tags
    spawnedTags.forEach(tag => {
      tag.style.transform = 'scale(0) rotate(20deg)';
      tag.style.opacity = '0';
      setTimeout(() => tag.remove(), 350);
    });
    spawnedTags = [];

    // Switch to Step 3 (The 25th Birthday Cake Scene)
    if (step2 && step3) {
      step2.classList.remove('active');
      step3.classList.add('active');
    }

    // Arm Step 3 runaway No button
    if (cakeNextNoBtn) {
      setupRunawayButton(cakeNextNoBtn, 'Hehe, you can\'t say no to memories! Say YES! 🥰📸');
    }

    showToast('Make a wish & blow the candles! 🎂🌬️✨');
    initMicBlowDetection().catch(() => {});
  }

  // If step 3 is already active
  if (step3 && step3.classList.contains('active')) {
    initMicBlowDetection().catch(() => {});
    if (cakeNextNoBtn) {
      setupRunawayButton(cakeNextNoBtn, 'Hehe, you can\'t say no to memories! Say YES! 🥰📸');
    }
  }

  if (giftNextYesBtn) {
    giftNextYesBtn.addEventListener('click', proceedToStep3);
  }

  // ===================================================
  // STEP 4: Transition to Memories Carousel
  // ===================================================
  function proceedToStep4() {
    playFanfareSound();
    launchConfetti(100);

    // Stop runaway timer / roaming
    if (roamInterval) {
      clearInterval(roamInterval);
      roamInterval = null;
    }

    // Hide Step 3 No button
    if (cakeNextNoBtn) {
      cakeNextNoBtn.style.display = 'none';
    }

    // Clean up spawned tags
    spawnedTags.forEach(tag => {
      tag.style.transform = 'scale(0) rotate(20deg)';
      tag.style.opacity = '0';
      setTimeout(() => tag.remove(), 350);
    });
    spawnedTags = [];

    // Switch to Step 4 (Memories)
    if (step3 && step4) {
      step3.classList.remove('active');
      step4.classList.add('active');
    }
    if (mainWrapper) {
      mainWrapper.classList.remove('video-mode');
      mainWrapper.classList.add('memories-mode');
    }

    // Arm Step 4 runaway No button for video step
    if (videoNextNoBtn) {
      setupRunawayButton(videoNextNoBtn, 'Aww, you can\'t skip the video surprise! Say YES! 🎥🥰');
    }

    // Celebration burst of flower petals
    for (let i = 0; i < 24; i++) {
      setTimeout(() => spawnFallingPetal(), i * 50);
    }

    showToast('Cherished memories of Madhuri! ♡ 🌸📸');
  }

  if (toMemoriesBtn) {
    toMemoriesBtn.addEventListener('click', proceedToStep4);
  }

  // Back to Cake Scene
  function backToCake() {
    if (step4 && step3) {
      step4.classList.remove('active');
      step3.classList.add('active');
    }
    if (mainWrapper) {
      mainWrapper.classList.remove('memories-mode');
    }
    showToast('Back to birthday cake! 🎂✨');
  }

  if (backToCakeBtn) {
    backToCakeBtn.addEventListener('click', backToCake);
  }

  // STEP 5: Transition to Video Tribute
  function proceedToStep5() {
    if (step4 && step5) {
      step4.classList.remove('active');
      step5.classList.add('active');
    }
    if (mainWrapper) {
      mainWrapper.classList.remove('memories-mode');
      mainWrapper.classList.add('video-mode');
    }

    // Scroll smoothly to top of card
    window.scrollTo({ top: 0, behavior: 'smooth' });

    launchConfetti(90);
    for (let i = 0; i < 20; i++) {
      setTimeout(() => spawnFallingPetal(), i * 60);
    }

    // Arm Step 5 runaway No button for final wish
    if (wishNextNoBtn) {
      setupRunawayButton(wishNextNoBtn, 'Hehe, you have to read the final wish! Say YES! 💌🥰');
    }

    showToast('A heartfelt video surprise for Madhuri! 🎬💖🍿');
  }

  if (toVideoBtn) {
    toVideoBtn.addEventListener('click', proceedToStep5);
  }

  // Back from Video to Memories
  function backToMemories() {
    if (step5 && step4) {
      step5.classList.remove('active');
      step4.classList.add('active');
    }
    if (birthdayVideo) {
      birthdayVideo.pause();
    }
    if (mainWrapper) {
      mainWrapper.classList.remove('video-mode');
      mainWrapper.classList.add('memories-mode');
    }
    showToast('Back to treasured memories! 📸✨');
  }

  if (backToMemoriesBtn) {
    backToMemoriesBtn.addEventListener('click', backToMemories);
  }

  // STEP 6: Transition to Final Birthday Wish & Thank You
  function proceedToStep6() {
    if (step5 && step6) {
      step5.classList.remove('active');
      step6.classList.add('active');
    }
    if (birthdayVideo) {
      birthdayVideo.pause();
    }
    if (mainWrapper) {
      mainWrapper.classList.remove('video-mode');
      mainWrapper.classList.add('wish-mode');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    launchConfetti(120);
    for (let i = 0; i < 26; i++) {
      setTimeout(() => spawnFallingPetal(), i * 45);
    }

    showToast('From Subhajit, with all my heart ♡ 🌸💌');
  }

  if (toWishBtn) {
    toWishBtn.addEventListener('click', proceedToStep6);
  }

  // Back from Wish to Video
  function backToVideo() {
    if (step6 && step5) {
      step6.classList.remove('active');
      step5.classList.add('active');
    }
    if (mainWrapper) {
      mainWrapper.classList.remove('wish-mode');
      mainWrapper.classList.add('video-mode');
    }
    showToast('Back to birthday video! 🎬✨');
  }

  if (backToVideoBtn) {
    backToVideoBtn.addEventListener('click', backToVideo);
  }

  if (replayFromWishBtn) {
    replayFromWishBtn.addEventListener('click', replaySurprise);
  }

  // Video Event Handlers
  if (birthdayVideo) {
    birthdayVideo.addEventListener('play', () => {
      launchConfetti(45);
    });
    birthdayVideo.addEventListener('ended', () => {
      launchConfetti(120);
      showToast('Happy 25th Birthday Madhuri! Forever loved! 💖🎉');
    });
  }

  if (replayFromVideoBtn) {
    replayFromVideoBtn.addEventListener('click', replaySurprise);
  }

  // Replay from beginning (Step 1)
  function replaySurprise() {
    if (step6) step6.classList.remove('active');
    if (step5) step5.classList.remove('active');
    if (step4) step4.classList.remove('active');
    if (step3) step3.classList.remove('active');
    if (step2) step2.classList.remove('active');
    if (step1) step1.classList.add('active');
    if (mainWrapper) {
      mainWrapper.classList.remove('memories-mode', 'video-mode', 'wish-mode');
    }

    if (birthdayVideo) {
      birthdayVideo.pause();
      birthdayVideo.currentTime = 0;
    }

    // Reset Step 1 No button
    if (noBtn) {
      noBtn.style.position = '';
      noBtn.style.left = '';
      noBtn.style.top = '';
      noBtn.style.display = 'inline-flex';
      noBtn.style.transform = '';
      const span = noBtn.querySelector('.btn-no-text');
      if (span) span.textContent = 'No 🙈';
    }

    // Reset Step 4 No button
    if (videoNextNoBtn) {
      videoNextNoBtn.style.position = '';
      videoNextNoBtn.style.left = '';
      videoNextNoBtn.style.top = '';
      videoNextNoBtn.style.display = 'inline-flex';
      videoNextNoBtn.style.transform = '';
    }

    // Reset Step 5 No button
    if (wishNextNoBtn) {
      wishNextNoBtn.style.position = '';
      wishNextNoBtn.style.left = '';
      wishNextNoBtn.style.top = '';
      wishNextNoBtn.style.display = 'inline-flex';
      wishNextNoBtn.style.transform = '';
    }

    // Reset Gift box
    giftOpened = false;
    if (giftBox) giftBox.classList.remove('opened');
    if (giftTapPrompt) giftTapPrompt.style.display = 'flex';
    if (giftNextArea) giftNextArea.style.display = 'none';

    // Reset Step 3
    candlesBlown = false;
    isBlowing = false;
    const flames = document.querySelectorAll('.candle-flame');
    flames.forEach(flame => {
      flame.classList.remove('out', 'blowing');
    });
    if (blowCandleBtn) {
      blowCandleBtn.classList.remove('blown', 'blowing');
    }
    if (blowBtnIcon) blowBtnIcon.textContent = '🌬️';
    if (blowBtnText) blowBtnText.textContent = 'Make a Wish & Blow Candles! ✨';
    const blowCalloutPill = document.getElementById('blowCalloutPill');
    if (blowCalloutPill) {
      blowCalloutPill.innerHTML = '<span class="callout-arrow-bounce">👇</span><span class="callout-msg">TAP BUTTON TO BLOW</span><span class="callout-sparkle">✨</span>';
    }
    if (cakeWishDesc) {
      cakeWishDesc.innerHTML = 'May your 25th year be blessed with boundless laughter, sparkling moments, and endless happiness! ✨';
    }
    if (cakeNextNoBtn) {
      cakeNextNoBtn.style.position = '';
      cakeNextNoBtn.style.left = '';
      cakeNextNoBtn.style.top = '';
      cakeNextNoBtn.style.display = 'inline-flex';
      cakeNextNoBtn.style.transform = '';
    }

    playFanfareSound();
    launchConfetti(80);
    showToast('Surprise restarted! Heyy Cutiepie Madhuri! 🎀✨');
  }

  if (replaySurpriseBtn) {
    replaySurpriseBtn.addEventListener('click', replaySurprise);
  }

  // Carousel Pause / Play Slides Toggle
  let isCarouselPaused = false;
  function toggleCarouselSlides() {
    if (!dualCarousel) return;
    isCarouselPaused = !isCarouselPaused;
    if (isCarouselPaused) {
      dualCarousel.classList.add('paused');
      if (carouselPlayIcon) carouselPlayIcon.textContent = '▶️';
      if (carouselPlayText) carouselPlayText.textContent = 'Play Slides';
      showToast('Slides paused. Enjoy the photos! 📸');
    } else {
      dualCarousel.classList.remove('paused');
      if (carouselPlayIcon) carouselPlayIcon.textContent = '⏸️';
      if (carouselPlayText) carouselPlayText.textContent = 'Pause Slides';
      showToast('Slides rolling again! ✨');
    }
  }

  if (toggleCarouselBtn) {
    toggleCarouselBtn.addEventListener('click', toggleCarouselSlides);
  }

  // ===================================================
  // Interactive Memory Lightbox Modal
  // ===================================================
  let currentHeartLikes = 1;

  function openMemoryModal(card) {
    if (!memoryModal) return;
    const imgEl = card.querySelector('.memory-img');
    const title = card.getAttribute('data-title') || 'Special Memory';
    const caption = card.getAttribute('data-caption') || '';
    const tag = card.getAttribute('data-tag') || 'Sweet Memory';
    const imgSrc = imgEl ? imgEl.src : 'memory-1.jpg';

    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = caption;
    if (modalTag) modalTag.textContent = tag;

    currentHeartLikes = Math.floor(Math.random() * 5) + 1;
    if (modalHeartCount) modalHeartCount.textContent = currentHeartLikes;

    memoryModal.classList.add('active');
    playPopSound();
  }

  function closeMemoryModal() {
    if (!memoryModal) return;
    memoryModal.classList.remove('active');
  }

  // Attach click to all memory cards
  const allCards = document.querySelectorAll('.memory-card.polaroid');
  allCards.forEach(card => {
    card.addEventListener('click', () => openMemoryModal(card));
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeMemoryModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeMemoryModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMemoryModal();
  });

  // Modal Heart "Send Love" Button
  if (modalHeartBtn) {
    modalHeartBtn.addEventListener('click', () => {
      currentHeartLikes++;
      if (modalHeartCount) modalHeartCount.textContent = currentHeartLikes;
      playPopSound();

      // Spawn burst of floating heart particles
      for (let i = 0; i < 7; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-modal-heart';
        const heartIcons = ['💖', '💕', '🌸', '✨', '💗', '🥰'];
        heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        heart.style.left = `${50 + (Math.random() - 0.5) * 35}%`;
        heart.style.top = `${60 + (Math.random() - 0.5) * 25}%`;
        heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 110}px`);
        
        if (modalHeartBurst) {
          modalHeartBurst.appendChild(heart);
          setTimeout(() => heart.remove(), 1100);
        }
      }

      showToast('Sent with lots of love to Madhuri! 💕✨');
    });
  }

  // Transition to Step 2 when "Yes" is clicked on Step 1
  function proceedToNextStep() {
    playFanfareSound();
    launchConfetti(90);

    // Stop Step 1 roaming No button
    if (roamInterval) {
      clearInterval(roamInterval);
      roamInterval = null;
    }

    // Hide Step 1 No button and clean up spawned tags
    if (noBtn) {
      noBtn.style.display = 'none';
    }

    spawnedTags.forEach(tag => {
      tag.style.transform = 'scale(0) rotate(20deg)';
      tag.style.opacity = '0';
      setTimeout(() => tag.remove(), 350);
    });
    spawnedTags = [];

    // Switch from Window Card (Step 1) to Gift Box (Step 2)
    if (step1 && step2) {
      step1.classList.remove('active');
      step2.classList.add('active');
    }

    // Start continuous falling flower petals animation
    startFlowerDrop();

    // Ensure music is unmuted and playing
    if (audio) {
      audio.muted = false;
      audio.volume = 1.0;
      audio.play().then(() => {
        if (musicBtn) musicBtn.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '🎶';
      }).catch(() => {});
    }

    showToast('A special gift for Madhuri! ♡ Tap the box to open! 🎁');
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', proceedToNextStep);
  }

  // =========================================================================
  // Bulletproof Audio Engine (Infinite Loop happybirthday.mp3 + Autoplay Force)
  // =========================================================================
  if (audio) {
    audio.loop = true;
    audio.preload = 'auto';

    const setMusicPlayingUI = () => {
      if (musicBtn) musicBtn.classList.add('playing');
      if (musicIcon) musicIcon.textContent = '🎶';
    };

    const setMusicPausedUI = () => {
      if (musicBtn) musicBtn.classList.remove('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
    };

    // Core play routine: handles unmuting and playing safely
    const forcePlayMusic = () => {
      try {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch (e) {}

      audio.muted = false;
      audio.volume = 1.0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        return playPromise.then(() => {
          setMusicPlayingUI();
          return true;
        }).catch(() => {
          // If unmuted playback is blocked by browser autoplay policy before user gesture:
          // Start playing muted so audio stream starts decoding/buffering immediately
          audio.muted = true;
          return audio.play().then(() => {
            return false;
          }).catch(() => false);
        });
      }
      return Promise.resolve(false);
    };

    // 1. Try starting immediately upon opening the page without any click
    forcePlayMusic();

    // 2. Try starting on all lifecycle and visibility events
    ['DOMContentLoaded', 'load', 'pageshow', 'focus'].forEach(evt => {
      window.addEventListener(evt, () => {
        if (audio.paused || audio.muted) {
          forcePlayMusic();
        }
      }, { passive: true });
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && (audio.paused || audio.muted)) {
        forcePlayMusic();
      }
    });

    // 3. User interaction unlock:
    // When anyone clicks the link/website, touches screen, moves mouse, presses key, or scrolls:
    // Capturing listeners on both window & document ensure 100% interception before any child stops propagation
    const interactionEvents = [
      'pointerdown',
      'mousedown',
      'touchstart',
      'touchend',
      'click',
      'keydown',
      'wheel',
      'scroll'
    ];

    const unlockOnInteraction = () => {
      forcePlayMusic().then((isPlayingUnmuted) => {
        if (isPlayingUnmuted || (!audio.paused && !audio.muted)) {
          // Once audio is unmuted and playing, remove capture listeners
          interactionEvents.forEach(evt => {
            window.removeEventListener(evt, unlockOnInteraction, true);
            document.removeEventListener(evt, unlockOnInteraction, true);
          });
        }
      });
    };

    interactionEvents.forEach(evt => {
      window.addEventListener(evt, unlockOnInteraction, true);
      document.addEventListener(evt, unlockOnInteraction, true);
    });

    // Also attempt gentle unmute on cursor movement if audio was started muted
    const tryUnmuteOnMove = () => {
      if (audio.muted) {
        audio.muted = false;
        audio.volume = 1.0;
        audio.play().then(() => {
          setMusicPlayingUI();
          window.removeEventListener('pointermove', tryUnmuteOnMove);
          window.removeEventListener('mousemove', tryUnmuteOnMove);
        }).catch(() => {
          audio.muted = true; // Revert if still blocked
        });
      }
    };
    window.addEventListener('pointermove', tryUnmuteOnMove, { passive: true });
    window.addEventListener('mousemove', tryUnmuteOnMove, { passive: true });

    // 4. Infinite seamless loop enforcement
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    audio.addEventListener('pause', () => {
      if (audio.paused) {
        setMusicPausedUI();
      }
    });

    audio.addEventListener('play', () => {
      if (!audio.muted) {
        setMusicPlayingUI();
      }
    });
  }

  // Music toggle button (icon only)
  if (musicBtn && audio) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused || audio.muted) {
        audio.muted = false;
        audio.volume = 1.0;
        audio.play().then(() => {
          if (musicBtn) musicBtn.classList.add('playing');
          if (musicIcon) musicIcon.textContent = '🎶';
          showToast('Playing Birthday Song 🎶♡');
        }).catch(() => {
          showToast('Could not play happybirthday.mp3 🎵');
        });
      } else {
        audio.pause();
        if (musicBtn) musicBtn.classList.remove('playing');
        if (musicIcon) musicIcon.textContent = '🎵';
        showToast('Music paused 🔇');
      }
    });
  }
})();

// ============================================================
// GLOBAL VARIABLES & GAME STATES
// ============================================================
const STATE_START = "start";
const STATE_PLAY = "play";
const STATE_WIN = "win";
const STATE_OVER = "over";

let gameState = STATE_START;

// Level Data & Progression
let currentLevel = 1;
let score = 0;
let targetScore = 3; // Default level 1 target
let lives = 3;

// Card Game Parameters
let currentCardValue = 0;
let nextCardValue = 0;
let cardFeedbackText = "Guess if the next card is Higher or Lower!";
let feedbackColor = [255, 255, 255];

// ------------------------------------------------------------
// SYSTEM DEBUG PANEL VARIABLE
// ------------------------------------------------------------
let showDebug = false; // Toggled via key 'D'

// ============================================================
// preload()
// ============================================================
function preload() {
  // Empty to prevent any missing asset loading crashes!
}

// ============================================================
// setup()
// ============================================================
function setup() {
  createCanvas(800, 600);
  resetGameSession();
}

// ============================================================
// draw() - Screen Router & Debug Overlay Renderer
// ============================================================
function draw() {
  background(28, 28, 40); // Dark sleek background

  // Game Screen Routing
  if (gameState === STATE_START) {
    drawStartScreen();
  } else if (gameState === STATE_PLAY) {
    drawPlayScreen();
  } else if (gameState === STATE_WIN) {
    drawWinScreen();
  } else if (gameState === STATE_OVER) {
    drawGameOverScreen();
  }

  // Draw the debug panel on top of everything if enabled
  if (showDebug) {
    drawDebugPanel();
  }
}

// ============================================================
// STATE RENDER FUNCTIONS
// ============================================================

function drawStartScreen() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(36);
  textStyle(BOLD);
  text("CARD GAME: HIGHER OR LOWER", width / 2, height / 2 - 80);

  textSize(16);
  textStyle(NORMAL);
  fill(180);
  text(`Select Level 1, 2, or 3 to begin testing!`, width / 2, height / 2 - 20);
  text(`Press 'D' to open the Debug Overlay.`, width / 2, height / 2 + 10);

  // Interactive Play Button
  fill(76, 175, 80);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 80, 200, 50, 8);

  fill(255);
  textSize(18);
  text("PLAY GAME", width / 2, height / 2 + 80);
}

function drawPlayScreen() {
  // HUD
  textAlign(LEFT, TOP);
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text(`LEVEL: ${currentLevel}`, 30, 30);
  text(`SCORE: ${score} / ${targetScore}`, 30, 55);

  // Lives Display
  let heartString = "";
  for (let i = 0; i < lives; i++) {
    heartString += "❤️ ";
  }
  text(`LIVES: ${heartString}`, 30, 80);

  // Drawing Card Box
  rectMode(CENTER);
  fill(38, 50, 56);
  stroke(255, 255, 255, 50);
  strokeWeight(3);
  rect(width / 2, height / 2 - 40, 180, 260, 12);
  noStroke();

  // Draw Card Value
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(72);
  textStyle(BOLD);
  text(currentCardValue, width / 2, height / 2 - 40);

  // Card Name Label
  textSize(14);
  textStyle(NORMAL);
  fill(150);
  text("CURRENT VALUE", width / 2, height / 2 + 50);

  // Feedback Text
  textSize(16);
  fill(feedbackColor[0], feedbackColor[1], feedbackColor[2]);
  text(cardFeedbackText, width / 2, height / 2 + 120);

  // Visual Interactive Buttons
  drawPlayButtons();
}

function drawPlayButtons() {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);

  // HIGHER Button (Green)
  fill(76, 175, 80);
  rect(width / 2 - 100, height / 2 + 200, 140, 50, 6);
  fill(255);
  text("⬆ HIGHER", width / 2 - 100, height / 2 + 200);

  // LOWER Button (Red)
  fill(244, 67, 54);
  rect(width / 2 + 100, height / 2 + 200, 140, 50, 6);
  fill(255);
  text("⬇ LOWER", width / 2 + 100, height / 2 + 200);
}

function drawWinScreen() {
  textAlign(CENTER, CENTER);
  fill(139, 195, 74);
  textSize(48);
  textStyle(BOLD);
  text("🎉 YOU WIN!", width / 2, height / 2 - 50);

  fill(255);
  textSize(18);
  textStyle(NORMAL);
  text(
    `Outstanding job! You passed Level ${currentLevel}.`,
    width / 2,
    height / 2 + 10,
  );
  text(
    "Press [S] to restart or [1, 2, 3] to jump levels.",
    width / 2,
    height / 2 + 40,
  );
}

function drawGameOverScreen() {
  textAlign(CENTER, CENTER);
  fill(244, 67, 54);
  textSize(48);
  textStyle(BOLD);
  text("💀 GAME OVER", width / 2, height / 2 - 50);

  fill(255);
  textSize(18);
  textStyle(NORMAL);
  text(
    "You ran out of lives. Better luck next time!",
    width / 2,
    height / 2 + 10,
  );
  text("Press [S] to go back to the Start Screen.", width / 2, height / 2 + 40);
}

// ============================================================
// GAME LOGIC & UTILITIES
// ============================================================

function resetGameSession() {
  score = 0;
  lives = 3;
  currentCardValue = floor(random(1, 11)); // Values 1 to 10
  nextCardValue = floor(random(1, 11));
  cardFeedbackText = "Is the next card Higher or Lower?";
  feedbackColor = [255, 255, 255];
}

function makeGuess(guess) {
  nextCardValue = floor(random(1, 11));

  let correct = false;
  if (guess === "higher" && nextCardValue >= currentCardValue) {
    correct = true;
  } else if (guess === "lower" && nextCardValue <= currentCardValue) {
    correct = true;
  }

  if (correct) {
    score++;
    feedbackColor = [139, 195, 74];
    cardFeedbackText = `Correct! It was ${nextCardValue}.`;
  } else {
    lives--;
    feedbackColor = [244, 67, 54];
    cardFeedbackText = `Wrong! It was ${nextCardValue}.`;
  }

  currentCardValue = nextCardValue;

  if (score >= targetScore) {
    gameState = STATE_WIN;
  } else if (lives <= 0) {
    gameState = STATE_OVER;
  }
}

function loadLevel(levelNum) {
  currentLevel = levelNum;
  resetGameSession();

  // Scales parameters mimicking dynamic JSON thresholds
  if (levelNum === 1) {
    targetScore = 3;
  } else if (levelNum === 2) {
    targetScore = 5;
  } else if (levelNum === 3) {
    targetScore = 8;
  }

  console.log(`Level ${levelNum} Loaded. Target Score: ${targetScore}`);
}

// ============================================================
// INPUT EVENT HANDLERS
// ============================================================

function mousePressed() {
  if (gameState === STATE_START) {
    // Check main play button bounds
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 55 &&
      mouseY < height / 2 + 105
    ) {
      loadLevel(1);
      gameState = STATE_PLAY;
    }
  } else if (gameState === STATE_PLAY) {
    // Check Higher Button bounds
    if (
      mouseX > width / 2 - 170 &&
      mouseX < width / 2 - 30 &&
      mouseY > height / 2 + 175 &&
      mouseY < height / 2 + 225
    ) {
      makeGuess("higher");
    }
    // Check Lower Button bounds
    if (
      mouseX > width / 2 + 30 &&
      mouseX < width / 2 + 170 &&
      mouseY > height / 2 + 175 &&
      mouseY < height / 2 + 225
    ) {
      makeGuess("lower");
    }
  }
}

function keyPressed() {
  // 1. Toggle Debug Panel Visibility (D Key)
  if (key === "d" || key === "D") {
    showDebug = !showDebug;
  }

  // 2. State-Jump Shortcuts (S, W, O Keys)
  if (key === "s" || key === "S") {
    gameState = STATE_START;
  }
  if (key === "w" || key === "W") {
    gameState = STATE_WIN;
  }
  if (key === "o" || key === "O") {
    gameState = STATE_OVER;
  }

  // 3. Level-Jump Shortcuts (1, 2, 3 Keys)
  if (key === "1") {
    loadLevel(1);
    gameState = STATE_PLAY;
  }
  if (key === "2") {
    loadLevel(2);
    gameState = STATE_PLAY;
  }
  if (key === "3") {
    loadLevel(3);
    gameState = STATE_PLAY;
  }
}

// ============================================================
// DRAW DEBUG PANEL - very beaut pink
// ============================================================
function drawDebugPanel() {
  push();

  // Semi-transparent deep-plum/pink background overlay
  fill(30, 20, 28, 240);
  stroke(255, 105, 180); // Vibrant Hot Pink Border
  strokeWeight(2);
  rectMode(CORNER);
  rect(15, 15, 270, 235, 8);

  // Panel Title
  noStroke();
  fill(255, 105, 180); // Hot Pink Title
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("🌸 SYSTEM DEBUG ACTIVE", 25, 25);

  // Soft pink-tinted dividing line
  stroke(80, 40, 60);
  strokeWeight(1);
  line(20, 45, 280, 45);
  noStroke();

  // Diagnostics Info
  fill(240, 220, 230); // Soft lavender-pink text
  textSize(11);
  textStyle(NORMAL);
  text(`State: ${gameState.toUpperCase()}`, 25, 55);
  text(`Current Level: ${currentLevel}`, 25, 70);
  text(`Score: ${score} / ${targetScore}`, 25, 85);
  text(`Lives: ${lives}`, 25, 100);

  // Soft pink-tinted dividing linee
  stroke(80, 40, 60);
  strokeWeight(1);
  line(20, 115, 280, 115);
  noStroke();

  // Keyboard binds directory
  fill(255, 182, 193); // Light Pastel Pink
  text("DEBUG CONTROL BINDS:", 25, 125);

  fill(190, 170, 180);
  text("[D] Toggle This Panel", 25, 145);
  text("[1, 2, 3] Jump directly to Level", 25, 160);
  text("[S] Force Start Screen", 25, 175);
  text("[W] Force Win Screen", 25, 190);
  text("[O] Force Game Over Screen", 25, 205);

  pop();
}

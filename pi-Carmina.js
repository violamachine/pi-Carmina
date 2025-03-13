let piDigits = "3."; // Start with "3."
let cursorVisible = true;
let timeSinceLastDigit = 0;
let timeSinceCursorBlink = 0;
let blinkInterval = 500; // Cursor blinks every 500ms
let digitInterval = 5000; // Add one digit every five seconds
let maxLines = 5; // Number of lines before scrolling
let digitsPerLine = 50;
let lineHeight = 30;
let lyricIndex = 0;

// Function to compute the nth digit of Pi using the BBP formula
function computePiDigit(n) {
    let pi = 0;
    for (let k = 0; k <= n; k++) {
        pi += (1 / Math.pow(16, k)) * (
            (4 / (8 * k + 1)) -
            (2 / (8 * k + 4)) -
            (1 / (8 * k + 5)) -
            (1 / (8 * k + 6))
        );
    }
    return pi.toString().slice(n + 2, n + 3); // Slice correctly (skip "3.")
}

// Function to get the next digit of Pi
function getNextPiDigit() {
    let nextDigitIndex = piDigits.length - 2; // -2 because "3." is already there
    return computePiDigit(nextDigitIndex) || ""; 
}

// Lyrics for Carmina Burana
let lyrics = [
  ["O Fortuna, velut luna", "O Fortune, like the moon"],
  ["statu variabilis", "you are always changing"],
  ["semper crescis aut decrescis", "forever waxing and waning"],
  ["vita detestabilis", "detestable life"]
];

function setup() {
  createCanvas(1280, 720);
  textFont("Courier New");
  textSize(28);
  frameRate(30);
}

function draw() {
  background(0);
  
  // Time tracking
  let currentTime = millis();
  
  // Add Pi digit at set interval
  if (currentTime - timeSinceLastDigit > digitInterval) {
    let nextDigit = getNextPiDigit();
    if (nextDigit) piDigits += nextDigit;
    timeSinceLastDigit = currentTime;
  }
  
  // Cursor blinking
  if (currentTime - timeSinceCursorBlink > blinkInterval) {
    cursorVisible = !cursorVisible;
    timeSinceCursorBlink = currentTime;
  }
  
  // Display π symbol in upper left
  fill(255);
  textSize(50);
  text("π", 20, 50);
  
  // Display lyrics (manually controlled)
  textSize(40);
  textAlign(CENTER);
  let currentLyric = lyrics[lyricIndex];
  text(currentLyric[0], width / 2, height / 3); // Latin
  text("\n\n\n" + currentLyric[1], width / 2, height / 2); // English (extra space added)
  
  // Display scrolling Pi digits in neon green
  textSize(28);
  fill(0, 255, 0);
  textAlign(LEFT);
  
  let lines = [];
  for (let i = 0; i < piDigits.length; i += digitsPerLine) {
    lines.push(piDigits.substring(i, i + digitsPerLine));
  }
  
  if (lines.length > maxLines) {
    lines.shift(); // Scroll up if exceeding max lines
  }
  
  let lastLineIndex = lines.length - 1;
  let lastLine = lines[lastLineIndex] || "";
  let cursorX = 20 + textWidth(lastLine); // Cursor at end of last line
  let cursorY = height - (maxLines - lastLineIndex) * lineHeight; // Align cursor with last line
  
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], 20, height - (maxLines - i) * lineHeight);
  }
  
  // Display blinking cursor at the end of last line
  if (cursorVisible) {
    text("█", cursorX, cursorY);
  }
}

// Function to manually control lyrics
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    lyricIndex = min(lyricIndex + 1, lyrics.length - 1); // Advance forward
  } else if (keyCode === LEFT_ARROW) {
    lyricIndex = max(lyricIndex - 1, 0); // Go back
  }
}

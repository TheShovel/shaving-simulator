const shavingSound = new Audio("shaving.mp3");
const touchSound = new Audio("touch.mp3");
const releaseSound = new Audio("release.mp3");
const music = new Audio("Bass Meant Jazz.mp3");
music.loop = true;

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes sway {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
  100% { transform: rotate(-5deg); }
}
`;
document.head.appendChild(styleSheet);

function updateHighScore() {
  highScoreDisplay.style.opacity = 1;
  const totalSeconds = localStorage.shavingHighScore;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  highScoreDisplay.textContent = `Best Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
let hairCount = 0;
let completed = false;
let shaves;
if (localStorage.shavingToatalShaves > 0) {
  shaves = localStorage.shavingToatalShaves;
} else {
  shaves = 0;
}
let skinToneIndex = 0;
const skinTones = ["#E0AB8B", "#743D2B", "#B06C49", "#E4BFBC", "#C68863"];
const completeText = [
  "You did it!",
  "Wow, amazing!",
  "So clean!",
  "Incredible!",
  "Outstanding!",
  "Good job!",
];

let canShave = false;
let timerInterval = null;
let startTime;
let elapsedTime = 0;

const body = document.body;

body.style.cssText = `
  background: black;
  user-select: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height:100vh;
  `;

const background = document.createElement("div");
background.style.cssText = `
  overflow: hidden;
  position: absolute;
  width: 500px;
  height: 500px;
  background: white;
`;

body.appendChild(background);

const shavingTool = document.createElement("div");
shavingTool.style.cssText = `
  user-select: none;
  position: absolute;
  width: 80px;
  height: 180px;
  background: blue;
  top: 200%;
`;
const leg = document.createElement("div");
leg.style.cssText = `
  position: absolute;
  width: 200px;
  height: 100%;
  bottom: 0px;
  left: -45%;
  transition: all 2s ease;
`;
const line1 = document.createElement("div");
line1.style.cssText = `
  background: black;
  position: absolute;
  width: 50px;
  height: 120%;
  transition: all 2s ease;
  background: url("assets/line.PNG");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  bottom: -17px;
  left: -25px;
`;
const line2 = document.createElement("div");
line2.style.cssText = `
  background: black;
  position: absolute;
  width: 50px;
  height: 120%;
  transition: all 2s ease;
  background: url("assets/line.PNG");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  bottom: -17px;
  right: -25px;
`;

const hairShadow = document.createElement("div");
hairShadow.style.cssText = `
  filter: blur(25px);
  background: black;
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 2s ease;
  background: black;
  opacity: 0.3;

`;

background.appendChild(leg);
leg.appendChild(hairShadow);
leg.appendChild(line1);
leg.appendChild(line2);
background.appendChild(shavingTool);
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  opacity: 0;
  position: absolute;
  align-content: center;
  width: 0%;
  height: 20px;
  background: black;
  color: white;
  font-family: monospace;
  font-size: 13px;
  transition: all 1s ease;
  text-align: center;
  user-select: none;
  white-space: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;

`;
progressBar.textContent = "Progress 0%";
background.appendChild(progressBar);

const shaveCount = document.createElement("div");
shaveCount.style.cssText = `
  opacity: 0;
  right: 0px;
  position: absolute;
  color: white;
  font-family: monospace;
  font-size: 13px;
  transition: all 1s ease;
  text-align: center;
  user-select: none;
  white-space: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;

`;
shaveCount.textContent = "Shaves: 0";
background.appendChild(shaveCount);

const timerDisplay = document.createElement("div");
timerDisplay.style.cssText = `
  opacity: 0;
  top: 20px;
  position: absolute;
  color: white;
  font-family: monospace;
  font-size: 13px;
  transition: all 1s ease;
  text-align: center;
  user-select: none;
  white-space: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`;
timerDisplay.textContent = "Time: 00:00";
background.appendChild(timerDisplay);

const highScoreDisplay = document.createElement("div");
highScoreDisplay.style.cssText = `
  opacity: 0;
  top: 40px;
  position: absolute;
  color: white;
  font-family: monospace;
  font-size: 13px;
  transition: all 1s ease;
  text-align: center;
  user-select: none;
  white-space: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`;
if (localStorage.shavingToatalShaves > 0) shaveCount.style.opacity = 1;
if (localStorage.shavingHighScore > 0) {
  updateHighScore();
} else {
  highScoreDisplay.textContent = "Best Time: 00:00";
}
background.appendChild(highScoreDisplay);

const congratsDisplay = document.createElement("div");
congratsDisplay.style.cssText = `
  pointer-events: none;
  align-content: center;
  opacity: 0;
  width: 100%;
  height: 50px;
  top: 50%;
  background: black;
  position: absolute;
  color: white;
  font-family: monospace;
  font-size: 13px;
  transition: all 1s ease;
  text-align: center;
  user-select: none;
  white-space: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`;
congratsDisplay.textContent = "Congratulations!";
background.appendChild(congratsDisplay);
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
async function showCongrats() {
  congratsDisplay.textContent =
    completeText[randomInt(0, completeText.length - 1)];
  congratsDisplay.style.opacity = 1;
  await delay(2000);
  congratsDisplay.style.opacity = 0;
}

let shavingStatus = false;
shavingTool.onmousedown = async () => {
  if (!canShave) {
    return;
  }
  shavingSound.volume = 1;
  touchSound.play();
  if (timerInterval === null) {
    timerDisplay.style.opacity = 1;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
  }
  shavingStatus = true;
  shavingTool.style.cursor = "grabbing";
  shavingTool.style.transition = "all 0.25s ease";
  await delay(1);
  shavingTool.style.scale = "0.8";
};
shavingTool.onmouseup = async () => {
  shavingSound.volume = 0;
  releaseSound.play();
  shavingTool.style.cursor = "";
  shavingStatus = false;
  shavingTool.style.scale = "1";
  shavingTool.style.transition = "";
};
shavingTool.onmouseleave = async () => {
  shavingSound.volume = 0;
  releaseSound.play();
  shavingTool.style.cursor = "";
  shavingStatus = false;
  shavingTool.style.scale = "1";
  shavingTool.style.transition = "";
};

function checkCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

background.addEventListener("mousemove", async (event) => {
  const backgroundRect = background.getBoundingClientRect();
  const currentZoom = parseFloat(background.style.zoom) / 100 || 1;
  const mouseX = (event.clientX - backgroundRect.left) / currentZoom;
  const mouseY = (event.clientY - backgroundRect.top) / currentZoom;

  const toolOffsetX = shavingTool.offsetWidth / 2;
  const toolOffsetY = shavingTool.offsetHeight / 2;
  if (!shavingStatus) shavingTool.style.left = `${mouseX - toolOffsetX}px`;
  shavingTool.style.top = `${mouseY - 25}px`;

  if (shavingStatus) {
    const shavingToolRect = shavingTool.getBoundingClientRect();

    const tipHeight = shavingTool.offsetHeight * 0.2;
    const adjustedShavingToolRect = {
      left: shavingToolRect.left - backgroundRect.left,
      top: shavingToolRect.top - backgroundRect.top,
      right: shavingToolRect.right - backgroundRect.left,
      bottom: shavingToolRect.top + tipHeight - backgroundRect.top,
      width: shavingToolRect.width,
      height: tipHeight,
    };

    const hairs = Array.from(leg.children);

    for (const hair of hairs) {
      console.log(hair.style.animation);
      if (hair.style.animation === "3s ease-in-out infinite alternate sway") {
        const hairRect = hair.getBoundingClientRect();

        const adjustedHairRect = {
          left: hairRect.left - backgroundRect.left,
          top: hairRect.top - backgroundRect.top,
          right: hairRect.right - backgroundRect.left,
          bottom: hairRect.bottom - backgroundRect.top,
          width: hairRect.width,
          height: hairRect.height,
        };

        if (
          checkCollision(adjustedShavingToolRect, adjustedHairRect) &&
          randomInt(0, hairCount / 10) == 0
        ) {
          shavingSound.play();
          hairCount--;
          hairShadow.style.opacity = hairCount * 0.001;
          hair.style.animation = "none";
          await delay(10);
          hair.style.opacity = 0;
          hair.style.transform = `rotate(${randomInt(-100, 100)}deg) translateX(${randomInt(-100, 100)}px)`;
          progressBar.style.opacity = 1;
          progressBar.textContent = `Progress ${Math.floor((300 - hairCount) / 3)}%`;
          progressBar.style.width = `${Math.floor((300 - hairCount) / 3)}%`;
          await delay(1000);
          leg.removeChild(hair);
          if (hairCount <= 0) {
            await delay(randomInt(10, 100));
            if (!completed) {
              completed = true;
              showCongrats();
              music.play();
              shaves++;
              shaveCount.style.opacity = 1;
              stopTimer();
              leg.style.left = "110%";
              await delay(2000);
              progressBar.textContent = "Progress 0%";
              progressBar.style.width = "0%";
              leg.style.transition = "";
              await delay(10);
              leg.style.left = "-45%";
              await delay(10);
              leg.style.transition = "all 2s ease";
              introAnimation();
            }
          }
        }
      }
    }
  }
});

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.textContent = `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
  const totalSeconds = Math.floor(elapsedTime / 1000);
  canShave = false;
  if (
    totalSeconds < localStorage.shavingHighScore ||
    localStorage.shavingHighScore == undefined
  ) {
    console.log("new best time");
    localStorage.setItem("shavingHighScore", totalSeconds);
    updateHighScore();
  }
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = null;
  timerDisplay.textContent = `Time: 00:00`;
  elapsedTime = 0;
  shavingStatus = false;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
async function fixzoom() {
  if (window.innerWidth > window.innerHeight) {
    background.style.zoom = (250 * window.innerWidth) / 2507 + "%";
  } else {
    background.style.zoom = (500 * window.innerWidth) / 2507 + "%";
  }
  await delay(100);
  fixzoom();
}
fixzoom();

async function createLegHair() {
  for (let i = 0; i < 300; i++) {
    const hair = document.createElement("div");
    hair.style.cssText = `
      transform-origin: 50% 100% 0;
      animation: sway 3s ease-in-out infinite alternate;
      transition: all 1s linear;
      position: absolute;
      width: 10px;
      rotate: ${randomInt(-25, 25)}deg;
      height: ${randomInt(20, 40)}px;
      background: black;
      left: ${randomInt(5, 95)}%;
      bottom: ${randomInt(1, 90)}%;
      background: url("assets/hair.PNG");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    `;
    hairCount++;
    leg.appendChild(hair);
  }
}

async function introAnimation() {
  leg.style.background = skinTones[skinToneIndex];
  skinToneIndex++;
  skinToneIndex %= skinTones.length;
  shaveCount.textContent = `Shaves: ${shaves}`;
  localStorage.setItem("shavingToatalShaves", shaves);
  completed = false;
  hairShadow.style.opacity = 0.3;
  createLegHair();
  await delay(1000);
  leg.style.left = "30%";
  await delay(2000);
  canShave = true;
}
introAnimation();

const body = document.body;

body.style.cssText = `
  background: white;
  user-select: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height:100vh;
  `;

const background = document.createElement("div");
background.style.cssText = `
  position: absolute;
  width: 500px;
  height: 500px;
  background: black;
`;

body.appendChild(background);

const shavingTool = document.createElement("div");
shavingTool.style.cssText = `
  position: absolute;
  width: 50px;
  height: 50px;
  background: blue;
`;

background.appendChild(shavingTool);

background.addEventListener("mousemove", (event) => {
  const backgroundRect = background.getBoundingClientRect();
  const toolSize = 50;
  const currentZoom = parseFloat(background.style.zoom) / 100 || 1;
  const mouseX = (event.clientX - backgroundRect.left) / currentZoom;
  const mouseY = (event.clientY - backgroundRect.top) / currentZoom;
  shavingTool.style.left = `${mouseX - toolSize / 2}px`;
  shavingTool.style.top = `${mouseY - toolSize / 2}px`;
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
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

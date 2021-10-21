const body = document.querySelector("body");
const H = 34;
const W = 20;
const wallColor = "rgb(22,41,63)";

const blockArray = [
  [
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ],
  [
    [1, 1],
    [1, 2],
    [2, 1],
    [3, 1],
  ],
  [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
  ],
  [[]],
];

function getLoc(x, y) {
  let loc = document.getElementById(String(x) + " " + String(y));
  return loc;
}

//게임판 그리기
function drawField() {
  let field = document.createElement("table");
  field.id = "gameTable";
  for (let i = 0; i < H; i++) {
    let row = document.createElement("tr");
    field.appendChild(row);
    for (let j = 0; j < W; j++) {
      let col = document.createElement("td");
      col.id = String(i) + " " + String(j);
      row.appendChild(col);
    }
  }
  body.appendChild(field);
}

//게임판 경계선 그리기
function setWall() {
  for (let i = 0; i < H; i++) {
    getLoc(i, 0).style.background = wallColor;
    getLoc(i, W - 1).style.background = wallColor;
  }
  for (let i = 0; i < W; i++) {
    getLoc(0, i).style.background = wallColor;
    getLoc(H - 1, i).style.background = wallColor;
  }
}

function createBlock() {}

function init() {
  drawField();
  setWall();
}

init();

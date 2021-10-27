const body = document.querySelector("body");
const H = 34;
const W = 20;
const wallColor = "rgb(22,41,63)";

//블록 배열
const blockArray = [
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ], //0블록
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ], //I블록
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
  ], //L블록
  [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ], //J블록
  [
    [0, 0],
    [1, 1],
    [0, 1],
    [0, 2],
  ], //T블록
  [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
  ], //S블록
  [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ], //Z블록
];

//좌표 가져오기
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

//블록 생성하기
function createBlock() {
  shapeNum = parseInt(Math.random() * blockArray.length);
}

function init() {
  drawField();
  setWall();
  createBlock();
}

init();

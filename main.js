const body = document.querySelector("body");
const H = 34;
const W = 20;
const wallColor = "rgb(22,41,63)";
let existField;
let shapeColor;
let nextShape, nextColorIndex;
let currentShape, currentColorIndex;
let createPoint = [1, parseInt(w / 2) - 2];

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

//블록 색상
var shapeColorArray = [
  "rgb(199,82,82)",
  "rgb(233,174,43)",
  "rgb(105,155,55)",
  "rgb(53,135,145)",
  "rgb(49,95,151)",
  "rgb(102,86,167)",
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

//필드 초기화
function initExistField() {
  existField = new Array(H);
  for (let i = 0; i < H; i++) {
    existField[i] = new Array(W);
  }
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      existField[i][j] = false;
    }
  }
}

//게임판 경계선 그리기
function setWall() {
  for (let i = 0; i < H; i++) {
    drawBlock(i, 0);
    drawBlock(i, W - 1);
  }
  for (let i = 0; i < W; i++) {
    drawBlock(0, i);
    drawBlock(H - 1, i);
  }
}

//랜덤 블록 뽑기
function chooseNextShape() {
  nextShape = parseInt(Math.random() * blockArray.length);
}
//랜덤 블록 색상
function chooseNextColor() {
  if (++nextColorIndex == shapeColorArray.length) nextColorIndex = 0;
}

//블록 색입히기
function drawBlock(x, y) {
  getLoc(x, y).style.background = wallColor;
}

//블록 생성하기
function createShape() {
  currentShape = nextShape;
  currentColorIndex = nextColorIndex;
  shapeColor = shapeColorArray[currentColorIndex];
  let shape = blockArray[currentShape];
  chooseNextShape();
  chooseNextColor();
}

function moveBlock(newBlock) {}

function init() {
  drawField();
  setWall();
  setInterval(drawInitBlock(), 1000);
}

init();

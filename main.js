const body = document.querySelector("body");
const H = 34;
const W = 20;
const tileColor = "rgb(9,17,26)";
const wallColor = "rgb(22,41,63)";
let existField;
let shapeColor;
let shapePoint;
let shapeCell;
let score;
let level;
let levelStack = 0;
let nextShape, nextColorIndex;
let currentShape, currentColorIndex;
let movingThread, movingSpeed;
let initSpeed = 500;
let deltaSpeed = 40;
let fastSpeed = 25;
let fastMode = false;
let createPoint = [1, parseInt(W / 2) - 2];
let isPaused = false;

//블록 배열
const shapeArray = [
  //z블록
  [
    [2, 2],
    [1, 2],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1],
    [1, 0],
    [0, 2],
    [0, 1],
  ],
  [
    [2, 1],
    [1, 1],
    [1, 2],
    [0, 2],
  ],
  [
    [1, 2],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
  //O 블록
  [
    [1, 2],
    [1, 1],
    [0, 2],
    [0, 1],
  ],
  //T블록
  [
    [2, 0],
    [1, 1],
    [1, 0],
    [0, 0],
  ],
  [
    [1, 1],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
  [
    [2, 2],
    [1, 2],
    [1, 1],
    [0, 2],
  ],
  [
    [1, 2],
    [1, 1],
    [1, 0],
    [0, 1],
  ],
  //I블록
  [
    [3, 1],
    [2, 1],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 3],
    [1, 2],
    [1, 1],
    [1, 0],
  ],
  //L블록
  [
    [2, 2],
    [2, 1],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 0],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
  [
    [2, 2],
    [1, 2],
    [0, 2],
    [0, 1],
  ],
  [
    [1, 2],
    [1, 1],
    [1, 0],
    [0, 2],
  ],
  //J블록
  [
    [2, 2],
    [2, 1],
    [1, 2],
    [0, 2],
  ],
  [
    [2, 2],
    [2, 1],
    [2, 0],
    [1, 0],
  ],
  [
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 2],
    [0, 2],
    [0, 1],
    [0, 0],
  ],
];
//회전 시 바뀌는 블록 인덱스
const shapeRotateMap = [
  1, 0, 3, 2, 4, 6, 7, 8, 5, 10, 9, 12, 13, 14, 11, 16, 17, 18, 15,
];
//블록 색상
const shapeColorArray = [
  "rgb(199,82,82)",
  "rgb(233,174,43)",
  "rgb(105,155,55)",
  "rgb(53,135,145)",
  "rgb(49,95,151)",
  "rgb(102,86,167)",
];

init();

function init() {
  drawField();
  initExistField();
  setWall();
  shapePoint = [1, 1];
  shapeCell = [];
  score = 0;
  level = 1;
  nextColorIndex = -1;
  movingSpeed = initSpeed;
  chooseNextShape();
  chooseNextColor();
  createShape();
}

document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e) {
  switch (e.keyCode) {
    case 37:
      setTimeout("moveLR(-1)", 0);
      break;
    case 39:
      setTimeout("moveLR(1)", 0);
      break;
    case 32:
      setTimeout("rotateShape()", 0);
      break;
    case 40:
      moveFast();
      break;
    case 80:
      pause();
      break;
  }
}

document.onkeyup = keyUpEventHandler;
function keyUpEventHandler(e) {
  if (e.keyCode == 40) moveSlow();
}

//블록 좌표 가져오기
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
    drawBlock(i, 0, wallColor);
    drawBlock(i, W - 1, wallColor);
    existField[i][0] = true;
    existField[i][W - 1] = true;
  }
  for (let i = 0; i < W; i++) {
    drawBlock(0, i, wallColor);
    drawBlock(H - 1, i, wallColor);
    existField[0][i] = true;
    existField[H - 1][i] = true;
  }
}

//랜덤 블록 뽑기
function chooseNextShape() {
  nextShape = parseInt(Math.random() * shapeArray.length);
}
//랜덤 블록 색상
function chooseNextColor() {
  if (++nextColorIndex == shapeColorArray.length) nextColorIndex = 0;
}

//블록 색입히기
function drawBlock(x, y, color) {
  getLoc(x, y).style.background = color;
}

function rotateShape() {
  if (!canRotate()) return;
  removeShape();
  shapeCell = [];
  currentShape = shapeRotateMap[currentShape];
  let rotateShape = shapeArray[currentShape];
  for (let i = 0; i < 4; i++) {
    let sy = shapePoint[0] + rotateShape[i][0];
    let sx = shapePoint[1] + rotateShape[i][1];
    shapeCell.push([sy, sx]);
  }
  showShape();
}

function canRotate() {
  let tempShape = shapeArray[shapeRotateMap[currentShape]];
  for (let i = 0; i < 4; i++) {
    let ty = shapePoint[0] + tempShape[i][0];
    let tx = shapePoint[1] + tempShape[i][1];
    if (!isValidPoint(ty, tx)) return false;
  }
  return true;
}

function showShape() {
  for (let i = 0; i < shapeCell.length; i++) {
    drawBlock(shapeCell[i][0], shapeCell[i][1], shapeColor);
  }
}

//블록 생성하기
function createShape() {
  shapePoint[0] = createPoint[0];
  shapePoint[1] = createPoint[1];
  currentShape = nextShape;
  currentColorIndex = nextColorIndex;
  shapeColor = shapeColorArray[currentColorIndex];
  let shape = shapeArray[currentShape];
  chooseNextShape();
  chooseNextColor();
  displayNextShape();
  for (let i = 0; i < shape.length; i++) {
    let sy = shapePoint[0] + shape[i][0];
    let sx = shapePoint[1] + shape[i][1];
    if (!isValidPoint(sy, sx)) gameOver();
    drawBlock(parseInt(sy), parseInt(sx), shapeColor);
    shapeCell.push([sy, sx]);
  }
  levelStack++;
  leveling();
  movingThread = setTimeout("moveDown()", movingSpeed);
}
//다음 블록 모양 출력
function displayNextShape() {
  initNextTable();
  let shape = shapeArray[nextShape];
  let color = shapeColorArray[nextColorIndex];
  for (let i = 0; i < 4; i++) {
    let x = shape[i][0];
    let y = shape[i][1];
    document.getElementById(String(y) + String(x)).style.background = color;
  }
}

//다음 블록 모양 보여주는 테이블 초기화
function initNextTable() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      document.getElementById(String(i) + String(j)).style.background =
        "rgb(14,31,49)";
    }
  }
}

function moveDown() {
  if (!canMove(1, 0)) {
    commitExist();
    checkLine();
    shapeCell = [];
    createShape();
    return;
  }
  removeShape();
  for (let i = 0; i < shapeCell.length; i++) shapeCell[i][0]++;
  shapePoint[0]++;
  showShape();
  movingThread = setTimeout("moveDown()", movingSpeed);
}

//존재여부 체크
function commitExist() {
  for (let i = 0; i < shapeCell.length; i++) {
    let y = shapeCell[i][0];
    let x = shapeCell[i][1];
    existField[y][x] = true;
  }
}

function checkLine() {
  let plusScore = level * 100;
  let combo = 0;
  let finalScore = 0;
  for (let i = H - 2; i > 1; i--) {
    if (isFull(i)) {
      removeLine(i);
      i++;
      finalScore += updateScore(plusScore, ++combo);
    }
    if (combo > 0) displayCombo(combo, finalScore);
  }
}

//이동 가능 여부
function canMove(dy, dx) {
  for (let i = 0; i < shapeCell.length; i++) {
    let ny = shapeCell[i][0] + dy;
    let nx = shapeCell[i][1] + dx;
    if (!isValidPoint(ny, nx)) return false;
  }
  return true;
}

//오른쪽,왼쪽 움직이기
function moveLR(delta) {
  if (!canMove(0, delta) || isPaused) return;
  removeShape();
  for (let i = 0; i < shapeCell.length; i++) {
    shapeCell[i][1] += delta;
    showShape();
  }
}

function removeShape() {
  for (let i = 0; i < shapeCell.length; i++) {
    drawBlock(shapeCell[i][0], shapeCell[i][1], tileColor);
  }
}

function moveFast() {
  if (fastMode) return;
  clearTimeout(movingThread);
  movingSpeed = fastSpeed;
  movingThread = setTimeout("moveDown()", movingSpeed);
  fastMode = true;
}

function moveSlow() {
  if (!fastMode) return;
  clearTimeout(movingThread);
  movingSpeed = initSpeed - level * deltaSpeed;
  movingThread = setTimeout("moveDown()", movingSpeed);
  fastMode = false;
}

function isFull(lineIndex) {
  for (let i = 1; i < W - 1; i++) {
    if (!existField[lineIndex][i]) return false;
  }
  return true;
}

//완성된 줄 지우기
function removeLine(lineIndex) {
  for (let i = lineIndex - 1; i >= 1; i--) {
    for (let j = 1; j < W - 1; j++) {
      getLoc(i + 1, j).style.background = getLoc(i, j).style.background;
      existField[i + 1][j] = existField[i][j];
    }
  }
}

//존재할 수 있는 곳인지 확인
function isValidPoint(x, y) {
  return !(y <= 0 || y > H - 1 || x <= 0 || x > W - 1 || existField[x][y]);
}

//레벨 관리
function leveling() {
  if (level == 10) return;
  if (levelStack === level * 10) {
    level++;
    levelStack = 0;
    if (!fastMode) {
      movingSpeed = initSpeed - level * deltaSpeed;
    }
  }
  document.getElementById("level").innerHTML = level;
}

function displayCombo(combo, finalScore) {
  let comboStr = combo + " COMBO +" + finalScore;
  document.getElementById("comboField").innerHTML = comboStr;
  setTimeout(function () {
    document.getElementById("comboField").innerHTML = "";
  });
}

function updateScore(plusScore, combo) {
  let comboScore = plusScore * combo;
  score += comboScore;
  document.getElementById("score").innerHTML = score;
  return comboScore;
}

//종료
function gameOver() {
  clearTimeout(movingThread);
  initExistField();
  alert("[Game Over]\nLevel: " + level + "\nScore: " + score);
  document.getElementById("gameField").style.visibility = "hidden";
  document.getElementById("gameover").style.visibility = "visible";
}

function pause() {
  if (isPaused) {
    movingThread = setTimeout("moveDown()", movingSpeed);
    document.getElementById("pause").style.visibility = "hidden";
    document.getElementById("gameField").style.visibility = "visible";
    isPaused = false;
  } else {
    clearTimeout(movingThread);
    document.getElementById("gameField").style.visibility = "hidden";
    document.getElementById("pause").style.visibility = "visible";
    isPaused = true;
  }
}

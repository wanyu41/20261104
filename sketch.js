let stopImage; // 儲存角色待機精靈圖。
let walkImage; // 儲存角色行走精靈圖。
let characterX; // 儲存角色中心的水平位置。
let characterY; // 儲存角色中心的垂直位置。
let facing = 1; // 設定角色朝向，1 為右，-1 為左。
let isWalking = false; // 記錄角色目前是否正在行走。
let currentFrame = 0; // 記錄目前播放的精靈圖格數。
let lastFrameTime = 0; // 記錄上次切換動畫影格的時間。
const stopFrameCount = 5; // 設定待機動畫的影格數。
const walkFrameCount = 8; // 設定行走動畫的影格數。
const frameDuration = 100; // 設定每個動畫影格停留的毫秒數。
const moveSpeed = 240; // 設定角色每秒移動的像素數。

function preload() { // 在畫布建立前載入角色圖片。
  stopImage = loadImage("1/stop/stop.png"); // 載入五格的待機精靈圖。
  walkImage = loadImage("1/walk/walk.png"); // 載入八格的行走精靈圖。
} // 結束圖片載入函式。

function setup() { // 初始化畫布與角色位置。
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布。
  characterX = width / 2; // 將角色水平位置設在畫布中央。
  characterY = height / 2; // 將角色垂直位置設在畫布中央。
  imageMode(CORNER); // 使用圖片左上角作為繪圖座標基準。
  frameRate(60); // 將畫面更新頻率設為每秒六十格。
} // 結束初始化函式。

function draw() { // 每一畫格更新角色動畫與位置。
  background("#edf6f9"); // 使用指定的淺藍色清除畫布。
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查目前是否按住左方向鍵。
  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查目前是否按住右方向鍵。
  const nextIsWalking = movingLeft || movingRight; // 判斷角色是否需要播放行走動畫。

  if (nextIsWalking !== isWalking) { // 只在待機與行走狀態改變時重設動畫。
    isWalking = nextIsWalking; // 更新角色目前的動畫狀態。
    currentFrame = 0; // 從新動畫的第一格開始播放。
    lastFrameTime = millis(); // 記錄新動畫的起始時間。
  } // 結束動畫狀態切換判斷。

  if (movingLeft && !movingRight) { // 僅在左鍵單獨生效時向左行走。
    facing = -1; // 將角色朝向設定為左方。
    characterX -= moveSpeed * deltaTime / 1000; // 依經過時間向左移動角色。
  } else if (movingRight && !movingLeft) { // 僅在右鍵單獨生效時向右行走。
    facing = 1; // 將角色朝向設定為右方。
    characterX += moveSpeed * deltaTime / 1000; // 依經過時間向右移動角色。
  } // 結束左右移動判斷。

  const activeImage = isWalking ? walkImage : stopImage; // 選擇目前狀態使用的精靈圖。
  const activeFrameCount = isWalking ? walkFrameCount : stopFrameCount; // 選擇目前精靈圖的影格數。
  const frameWidth = activeImage.width / activeFrameCount; // 依精靈圖寬度計算單格寬度。
  const frameHeight = activeImage.height; // 以精靈圖高度作為單格高度。

  if (millis() - lastFrameTime >= frameDuration) { // 到達影格時間時切換動畫影格。
    currentFrame = (currentFrame + 1) % activeFrameCount; // 前進一格並在最後一格後循環。
    lastFrameTime = millis(); // 記錄本次影格切換的時間。
  } // 結束動畫影格更新判斷。

  characterX = constrain(characterX, frameWidth / 2, width - frameWidth / 2); // 限制角色不超出畫布左右邊界。
  push(); // 儲存目前繪圖設定以便稍後還原。
  translate(characterX, characterY); // 將繪圖原點移至角色中心位置。
  scale(facing, 1); // 依角色朝向翻轉圖片。
  image( // 繪製目前動畫影格。
    activeImage, // 指定目前狀態使用的精靈圖。
    -frameWidth / 2, // 將圖片左側對齊角色中心。
    -frameHeight / 2, // 將圖片上側對齊角色中心。
    frameWidth, // 設定繪製影格的寬度。
    frameHeight, // 設定繪製影格的高度。
    currentFrame * frameWidth, // 指定精靈圖中目前影格的起始水平位置。
    0, // 指定精靈圖中影格的起始垂直位置。
    frameWidth, // 指定從精靈圖擷取的影格寬度。
    frameHeight // 指定從精靈圖擷取的影格高度。
  ); // 結束目前影格繪製。
  pop(); // 還原繪圖設定以免影響後續畫面。
} // 結束畫面更新函式。

function windowResized() { // 視窗尺寸改變時重新調整畫布。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗。
  characterY = height / 2; // 將角色垂直位置維持在畫布中央。
  characterX = constrain(characterX, 0, width); // 將角色水平位置限制在新畫布範圍內。
} // 結束視窗尺寸調整函式。

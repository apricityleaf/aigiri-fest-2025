const roundText = document.getElementById("roundText");
const countText = document.getElementById("countText");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

let currentRound = 1;

//非同期処理を用いるとタイマー処理できそう
async function playRound(roundNum) {
  startBtn.style.display = "none";
  resetBtn.style.display = "none";
  roundText.textContent = `${roundNum}回戦`;

  for (let n = 3; n > 0; n--) {
    countText.textContent = n;
    await wait(1000);
  }
  countText.textContent = "スタート！";
  await wait(1000);

  for (let s = 500; s >= 0; s--) {
    countText.textContent = (s / 10).toFixed(1);
    await wait(100);
  }
  countText.textContent = "終了!";
  await wait(2000);

  currentRound++;
  if (currentRound <= 2) {
    roundText.textContent = `${currentRound}回戦`;
    countText.textContent = "";
    startBtn.textContent = "スタート";
    startBtn.style.display = "inline-block";
  } else {
    roundText.textContent = "お疲れさまでした！";
    countText.textContent = "";
    resetBtn.style.display = "inline-block";
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

startBtn.addEventListener("click", () => {
  playRound(currentRound);
});

resetBtn.addEventListener("click", () => {
  currentRound = 1;
  roundText.textContent = "1回戦";
  countText.textContent = "";
  startBtn.textContent = "スタート";
  startBtn.style.display = "inline-block";
  resetBtn.style.display = "none";
});

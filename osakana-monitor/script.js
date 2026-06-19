const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("video");

const fishImgs = [
  "body0.png",
  "body1.png",
  "body2.png",
  "body3.png",
  "body4.png",
];

const eyeImgs = {
  open: "eye0.png",
  half: "eye1.png",
  closed: "eye2.png",
};

const loadedImages = {};
const loadAllImages = async () => {
  const promises = [];
  // スプレッド構文が分からない場合はここは変更しないことをおすすめします
  // とりわけ、藍桐祭本番まで残り10日間を切ってからは。
  for (const src of [...fishImgs, ...Object.values(eyeImgs)]) {
    promises.push(
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedImages[src] = img;
          resolve();
        };
      })
    );
  }
  await Promise.all(promises);
};

const getFishRatio = (landmarks) => {
  const top = landmarks[13];
  const bottom = landmarks[14];
  return Math.abs(top.y - bottom.y);
};

const getEyeRatio = (landmarks) => {
  const top = landmarks[159];
  const bottom = landmarks[145];
  return Math.abs(top.y - bottom.y);
};

let fishRatio = 0;
let eyeRatio = 0;

const faceMesh = new FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults((results) => {
  if (results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    fishRatio = getFishRatio(landmarks);
    eyeRatio = getEyeRatio(landmarks);
  }
});

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const fishIndex = Math.min(4, Math.floor(fishRatio * 50));
  let eyeState = "open";
  if (eyeRatio < 0.01) eyeState = "closed";
  else if (eyeRatio < 0.025) eyeState = "half";

  const fishImg =
    loadedImages[fishImgs[fishIndex]] || loadedImages[fishImgs[0]];
  const eyeImg = loadedImages[eyeImgs[eyeState]];

  ctx.drawImage(fishImg, 80, 100, 480, 270);

  ctx.drawImage(eyeImg, 140, 190, 60, 60);

  requestAnimationFrame(draw);
};

const setup = async () => {
  await loadAllImages();
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;
  const camera = new Camera(video, {
    onFrame: async () => await faceMesh.send({ image: video }),
    width: 640,
    height: 480,
  });
  camera.start();
  draw();
};

setup();

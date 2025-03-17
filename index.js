function manualCameraLoop() {
  if (!cameraActive) return;
  hands.send({ image: video_element }).catch(err => console.error("Ошибка в manual loop:", err));
  requestAnimationFrame(manualCameraLoop);
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { frameRate: { ideal: 30, max: 30 } } })
    .then((stream) => {
      video_element.srcObject = stream;
      cameraActive = true;
      status.innerText = "Ожидание руки";
      status.style.color = "orange";
      
      turn_on_camera.disabled = true;
      turn_off_camera.disabled = false;

      // Запускаем вручную вместо camera.start()
      requestAnimationFrame(manualCameraLoop);

      pipVideo = document.createElement("video");
      pipVideo.style.display = "none";
      pipVideo.srcObject = canvas_element.captureStream(30);
      document.body.appendChild(pipVideo);

      pipVideo.addEventListener("loadedmetadata", () => {
        pipButton.disabled = false;
      });
      pipVideo.play().catch(err => console.error("Ошибка pipVideo:", err));
    })
    .catch((err) => console.error("Ошибка доступа к камере:", err));
}
document.addEventListener("DOMContentLoaded", function () {
  const newTicketBtn = document.getElementById("newTicketBtn");
  const checkTicketBtn = document.getElementById("checkTicketBtn");
  const scratchImage = document.getElementById("scratchImage");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const metricsNum = document.getElementById("metricsNum");

  const popupModal = document.getElementById("popupModal");
  const popupTitle = document.getElementById("popupTitle");
  const popupMessage = document.getElementById("popupMessage");
  const closePopupBtn = document.getElementById("closePopupBtn");

  closePopupBtn.addEventListener("click", resetGame);

  newTicketBtn.addEventListener("click", function () {
    // Show loading indicator
    loadingIndicator.style.display = "flex";

    setTimeout(() => {
      // Hide loading indicator after 3 seconds
      loadingIndicator.style.display = "none";

      // Hide "New Ticket" button, show "Check Ticket" button
      newTicketBtn.style.display = "none";
      checkTicketBtn.style.display = "block";

      // Change scratch image
      scratchImage.src = "./assets/img/bg.png";

      // Generate random ticket number
      const randomNum = Math.floor(Math.random() * 1000000000000000);
      metricsNum.textContent = randomNum;

      // Create scratchable canvas
      const canvas = document.createElement("canvas");
      canvas.id = "scratchCanvas";
      canvas.width = scratchImage.offsetWidth;
      canvas.height = scratchImage.offsetHeight;
      canvas.style.position = "absolute";
      canvas.style.top = scratchImage.offsetTop + "px";
      canvas.style.left = scratchImage.offsetLeft + "px";
      canvas.style.cursor = "pointer";
      scratchImage.parentElement.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = "./assets/img/scratch.png";
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      let isScratching = false;
      canvas.addEventListener("mousedown", () => (isScratching = true));
      canvas.addEventListener("mouseup", () => (isScratching = false));
      canvas.addEventListener("mousemove", (e) => {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      });

      // Emoji logic
      const emojis = ["🏆", "💰", "🤑", "🏆", "💰", "🤑", "🏆", "💰", "🤑"];
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };
      shuffleArray(emojis);

      const emojiGrid = [];
      while (emojis.length) emojiGrid.push(emojis.splice(0, 3));

      const emojiContainer = document.createElement("div");
      emojiContainer.id = "emojiContainer";
      emojiContainer.style.position = "absolute";
      emojiContainer.style.top = scratchImage.offsetTop + "px";
      emojiContainer.style.left = scratchImage.offsetLeft + "px";
      emojiContainer.style.width = scratchImage.offsetWidth + "px";
      emojiContainer.style.height = scratchImage.offsetHeight + "px";
      emojiContainer.style.display = "grid";
      emojiContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
      emojiContainer.style.gridTemplateRows = "1fr 1fr 1fr";
      emojiContainer.style.fontSize = "2rem";
      emojiContainer.style.textAlign = "center";
      emojiContainer.style.alignItems = "center";
      emojiContainer.style.justifyItems = "center";
      emojiContainer.style.visibility = "hidden";
      emojiGrid.flat().forEach((emoji) => {
        const emojiElement = document.createElement("div");
        emojiElement.textContent = emoji;
        emojiContainer.appendChild(emojiElement);
      });
      scratchImage.parentElement.appendChild(emojiContainer);

      // Remove canvas after 50% is scratched
      canvas.addEventListener("mouseup", () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let scratchedPixels = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] === 0) scratchedPixels++;
        }
        const scratchedPercentage = (scratchedPixels / (canvas.width * canvas.height)) * 100;
        if (scratchedPercentage > 50) {
          canvas.remove();
          emojiContainer.style.visibility = "visible";
        }
      });

      // Check ticket logic
      checkTicketBtn.addEventListener("click", () => {
        if (emojiContainer.style.visibility === "visible") {
          const checkWin = () => {
            for (let i = 0; i < 3; i++) {
              if (emojiGrid[i][0] === emojiGrid[i][1] && emojiGrid[i][1] === emojiGrid[i][2]) return true;
              if (emojiGrid[0][i] === emojiGrid[1][i] && emojiGrid[1][i] === emojiGrid[2][i]) return true;
            }
            return (
              (emojiGrid[0][0] === emojiGrid[1][1] && emojiGrid[1][1] === emojiGrid[2][2]) ||
              (emojiGrid[0][2] === emojiGrid[1][1] && emojiGrid[1][1] === emojiGrid[2][0])
            );
          };

          if (checkWin()) {
            popupTitle.textContent = "Congratulations!";
            popupMessage.textContent = "You are amazing! 🎉";
          } else {
            popupTitle.textContent = "Try Again!";
            popupMessage.textContent = "Better luck next time! 💔";
          }
          popupModal.classList.remove("hidden");
          popupModal.classList.add("flex");
        } else {
          popupTitle.textContent = "Incomplete!";
          popupMessage.textContent = "Please scratch the ticket completely before checking!";
          popupModal.classList.remove("hidden");
        }
      });
    }, 3000);
  });

  function resetGame() {
    popupModal.classList.add("hidden");

    // Reset game elements
    newTicketBtn.style.display = "block";
    checkTicketBtn.style.display = "none";
    metricsNum.textContent = "000000 Lucky World Cup 7 000000";

    // Remove scratch canvas
    const existingCanvas = document.getElementById("scratchCanvas");
    if (existingCanvas) existingCanvas.remove();

    // Remove emoji container
    const existingEmojiContainer = document.getElementById("emojiContainer");
    if (existingEmojiContainer) existingEmojiContainer.remove();

    // Reset scratch image
    scratchImage.src = "./assets/img/sample.png";
  }
});

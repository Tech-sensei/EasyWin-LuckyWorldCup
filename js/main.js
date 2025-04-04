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
  newTicketBtn.addEventListener("click", handleNewTicket);

  function handleNewTicket() {
    showLoadingIndicator();

    setTimeout(() => {
      hideLoadingIndicator();
      prepareNewTicket();
      createScratchCanvas();
      createEmojiGrid();
    }, 3000);
  }

  // function to show the loading indicator
  function showLoadingIndicator() {
    loadingIndicator.style.display = "flex";
  }

  // function to hide the loading indicator after the ticket is generated
  function hideLoadingIndicator() {
    loadingIndicator.style.display = "none";
  }

  // function to prepare the new ticket
  function prepareNewTicket() {
    newTicketBtn.style.display = "none";
    checkTicketBtn.style.display = "block";
    scratchImage.src = "./assets/img/bg.png";
    metricsNum.textContent = generateRandomTicketNumber();
  }

  // function to generate a random ticket number...the number is a random 15-digit number
  function generateRandomTicketNumber() {
    return Math.floor(Math.random() * 1000000000000000);
  }

  // function to create the scratch canvas 
  function createScratchCanvas() {
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
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    setupScratchEvents(canvas, ctx);
  }

  // function to set up the scratch events on the canvas
  function setupScratchEvents(canvas, ctx) {
    let isScratching = false;

    const startScratch = () => (isScratching = true);
    const stopScratch = () => (isScratching = false);
    const scratch = (e) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", startScratch);
    canvas.addEventListener("mouseup", stopScratch);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("touchstart", startScratch);
    canvas.addEventListener("touchend", stopScratch);
    canvas.addEventListener("touchmove", scratch);

    canvas.addEventListener("mouseup", () => checkScratchCompletion(canvas, ctx));
    canvas.addEventListener("touchend", () => checkScratchCompletion(canvas, ctx));
  }

  function checkScratchCompletion(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let scratchedPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) scratchedPixels++;
    }
    const scratchedPercentage = (scratchedPixels / (canvas.width * canvas.height)) * 100;
    if (scratchedPercentage > 30) {
      canvas.remove();
      document.getElementById("emojiContainer").style.visibility = "visible";
    }
  }

  function createEmojiGrid() {
    const emojis = shuffleArray(["🏆", "💰", "🤑", "🏆", "💰", "🤑", "🏆", "💰", "🤑"]);
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
    setupCheckTicketLogic(emojiGrid);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setupCheckTicketLogic(emojiGrid) {
    checkTicketBtn.addEventListener("click", () => {
      const emojiContainer = document.getElementById("emojiContainer");
      if (emojiContainer.style.visibility === "visible") {
        if (checkWin(emojiGrid)) {
          showPopup("Congratulations!", "You are amazing! 🎉");
        } else {
          showPopup("Try Again!", "Better luck next time! 💔");
        }
      } else {
        showPopup("Incomplete!", "Please scratch the ticket completely before checking!");
      }
    });
  }

  function checkWin(emojiGrid) {
    for (let i = 0; i < 3; i++) {
      if (emojiGrid[i][0] === emojiGrid[i][1] && emojiGrid[i][1] === emojiGrid[i][2]) return true;
      if (emojiGrid[0][i] === emojiGrid[1][i] && emojiGrid[1][i] === emojiGrid[2][i]) return true;
    }
    return (
      (emojiGrid[0][0] === emojiGrid[1][1] && emojiGrid[1][1] === emojiGrid[2][2]) ||
      (emojiGrid[0][2] === emojiGrid[1][1] && emojiGrid[1][1] === emojiGrid[2][0])
    );
  }

  function showPopup(title, message) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupModal.style.display = "flex";
  }

  function resetGame() {
    popupModal.style.display = "none";
    newTicketBtn.style.display = "block";
    checkTicketBtn.style.display = "none";
    metricsNum.textContent = "000000 Lucky World Cup 7 000000";

    const existingCanvas = document.getElementById("scratchCanvas");
    if (existingCanvas) existingCanvas.remove();

    const existingEmojiContainer = document.getElementById("emojiContainer");
    if (existingEmojiContainer) existingEmojiContainer.remove();

    scratchImage.src = "./assets/img/sample.png";
  }
});

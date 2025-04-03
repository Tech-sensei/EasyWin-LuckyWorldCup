document.addEventListener("DOMContentLoaded", function () {
  const newTicketBtn = document.getElementById("newTicketBtn");
  const checkTicketBtn = document.getElementById("checkTicketBtn");
  const scratchImage = document.getElementById("scratchImage");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const metricsNum = document.getElementById("metricsNum");

  newTicketBtn.addEventListener("click", function () {
    // Show loading indicator
    loadingIndicator.style.display = "flex";

    setTimeout(() => {
      // Hide loading indicator after 3 seconds
      loadingIndicator.style.display = "none";

      // Hide the "New Ticket" button
      newTicketBtn.style.display = "none";

      // Show the "Check Ticket" button
      checkTicketBtn.style.display = "block";

      // Change the scratch image to "scratch.png"
      scratchImage.src = "./assets/img/bg.png";

      // change the metrics number to a random number
      const randomNum = Math.floor(Math.random() * 1000000000000000);
      metricsNum.textContent = randomNum;

      // Create a scratchable canvas with "scratch.png" as the background
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
        ctx.drawImage(img, 0, 0, scratchCanvas.width, scratchCanvas.height);
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

      // Add emojis behind the scratch area
      const emojis = ["🍎", "🍌", "🍇", "🍎", "🍌", "🍇", "🍎", "🍌", "🍇"];
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
      emojiContainer.style.visibility = "hidden"; // Initially hidden
      emojiGrid.flat().forEach((emoji) => {
        const emojiElement = document.createElement("div");
        emojiElement.textContent = emoji;
        emojiContainer.appendChild(emojiElement);
      });
      scratchImage.parentElement.appendChild(emojiContainer);

      // Optional: Remove the canvas after a certain percentage is scratched
      canvas.addEventListener("mouseup", () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let scratchedPixels = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] === 0) scratchedPixels++;
        }
        const scratchedPercentage = (scratchedPixels / (canvas.width * canvas.height)) * 100;
        if (scratchedPercentage > 50) {
          canvas.remove();
          emojiContainer.style.visibility = "visible"; // Reveal emojis
        }
      });

      // Add event listener to "Check Ticket" button
      checkTicketBtn.addEventListener("click", () => {
        if (emojiContainer.style.visibility === "visible") {
          // Check for winning condition
          const checkWin = () => {
            for (let i = 0; i < 3; i++) {
              // Check rows
              if (emojiGrid[i][0] === emojiGrid[i][1] && emojiGrid[i][1] === emojiGrid[i][2]) {
                return true;
              }
              // Check columns
              if (emojiGrid[0][i] === emojiGrid[1][i] && emojiGrid[1][i] === emojiGrid[2][i]) {
                return true;
              }
            }
            // Check diagonals
            if (
              (emojiGrid[0][0] === emojiGrid[1][1] && emojiGrid[1][1] === emojiGrid[2][2]) ||
              (emojiGrid[0][2] === emojiGrid[1][1] && emojiGrid[1][1] === emojiGrid[2][0])
            ) {
              return true;
            }
            return false;
          };

          if (checkWin()) {
            alert("Congratulations! You won!");
          } else {
            alert("Try again later!");
          }
        } else {
          alert("Please scratch the ticket completely before checking!");
        }
      });
    }, 3000);
  });
});

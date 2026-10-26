const images = [
    { src: "/picture/index/picture1new.png", text: "Its the new notice-board, enjoy the new look" },
    { src: "/picture/index/picture2.png", text: "its the new about me page" },
    { src: "/picture/index/picture3.png", text: "its the new projects page" },
    { src: "/picture/index/picture4.png", text: "its the new links page" },
    { src: "/picture/index/picture5.png", text: "more updates on the board" }
  ];

        let currentImageIndex = 0;
        let timeLeft = 6;
        let timerElement = document.getElementById('timer');
        let imageElement = document.getElementById('notice-image');
        let textElement = document.getElementById('image-text');

        function updateTimer() {
            timerElement.textContent = `Time Left: ${timeLeft}s`;
            timeLeft--;

            if (timeLeft < 0) {
                timeLeft = 6; // reset the timer
                changeImage(); // change the image
            }
        }

        function changeImage() {
            // Change to the next image
            currentImageIndex = (currentImageIndex + 1) % images.length;
            imageElement.style.opacity = 0; // fade out the image

            // Wait for the fade-out to finish
            setTimeout(() => {
                imageElement.src = images[currentImageIndex].src;  // Update image source
                textElement.textContent = images[currentImageIndex].text;  // Update text
                imageElement.style.opacity = 1; // fade in the new image
            }, 1000);
        }

        setInterval(updateTimer, 1000); // update the timer every second

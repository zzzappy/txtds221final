document.getElementById('rouletteButton').addEventListener('click', function() {
    const button = document.getElementById('rouletteButton');
    button.disabled = true; // Disable the button
    document.getElementById('rouletteWheel').style.display = 'block';
    spinRoulette();
});

function spinRoulette() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const artists = [
        "Banksy", "AI Banksy", 
        "Jean-Michel Basquiat", "AI Jean-Michel Basquiat", 
        "Hieronymus Bosch", "AI Hieronymus Bosch", 
        "Sandro Botticelli", "AI Sandro Botticelli", 
        "Leonardo da Vinci", "AI Leonardo da Vinci", 
        "Salvador Dalí", "AI Salvador Dalí", 
        "Marcel Duchamp", "AI Marcel Duchamp", 
        "Keith Haring", "AI Keith Haring", 
        "Yayoi Kusama", "AI Yayoi Kusama", 
        "Michelangelo", "AI Michelangelo", 
        "Claude Monet", "AI Claude Monet", 
        "Jackson Pollock", "AI Jackson Pollock", 
        "Jan van Eyck", "AI Jan van Eyck", 
        "Vincent van Gogh", "AI Vincent van Gogh", 
        "Johannes Vermeer", "AI Johannes Vermeer", 
        "Andy Warhol", "AI Andy Warhol"
    ];
    const numSegments = artists.length;
    const anglePerSegment = 2 * Math.PI / numSegments;

    let startAngle = 0;
    let spinAngle = Math.random() * 6 * Math.PI + 16 * Math.PI; // Increase randomness and spin duration
    let spinDuration = 3000; // Extended spin duration in milliseconds
    let spinStart = null;

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < numSegments; i++) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle + i * anglePerSegment, startAngle + (i + 1) * anglePerSegment);
            ctx.fillStyle = i % 2 === 0 ? '#FF5733' : '#C70039';
            ctx.fill();
            ctx.stroke();
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(startAngle + (i + 0.5) * anglePerSegment);
            ctx.fillStyle = "white";
            ctx.textAlign = "right"; // Justify text to the outer edge of the wheel
            ctx.font = "16px Arial";
            ctx.textBaseline = "middle"; // Ensure text is vertically centered
            ctx.fillText(`${artists[i]}`, canvas.width / 2.2, 0); // Position text closer to the edge
            ctx.restore();
        }
        drawPointer();
    }

    function drawPointer() {
        const pointerSize = 20;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - pointerSize, 0);
        ctx.lineTo(canvas.width / 2 + pointerSize, 0);
        ctx.lineTo(canvas.width / 2, pointerSize);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.fill();
    }

    function animateSpin(timestamp) {
        if (!spinStart) spinStart = timestamp;
        const elapsed = timestamp - spinStart;

        const remainingTime = Math.max(spinDuration - elapsed, 0);
        const easingFactor = remainingTime / spinDuration; // Linear easing for consistent slowdown

        spinAngle *= easingFactor;
        startAngle += spinAngle; // Increased speed multiplier for quicker slowdown

        drawWheel();

        if (remainingTime > 0.01) { // Stop the animation loop slightly sooner for snappy modal pop-up
            requestAnimationFrame(animateSpin);
        } else {
            const finalAngle = startAngle % (2 * Math.PI);
            const offsetAngle = finalAngle + (Math.PI / 2); // Offset by a quarter circle counterclockwise
            const chosenSegment = Math.floor((2 * Math.PI - offsetAngle) / anglePerSegment) % numSegments;
            document.getElementById('rouletteWheel').style.display = 'none';
            mimicImageClick(chosenSegment + 1); // Add 1 to match the image IDs
            document.getElementById('rouletteButton').disabled = false; // Re-enable the button
        }
    }

    requestAnimationFrame(animateSpin);
}

function mimicImageClick(imageId) {
    imageId = (imageId + 32) % 32;
    imageId = imageId === 0 ? 32 : imageId;
    const imgElement = document.getElementById(`wheel-id-${imageId}`);
    if (imgElement) {
        imgElement.click();
    } else {
        console.error("No image element found for ID:", imageId);
    }
}

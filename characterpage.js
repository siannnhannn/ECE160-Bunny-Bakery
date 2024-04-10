window.addEventListener("DOMContentLoaded", () => {
    const spriteImage = new Image();
    spriteImage.src = 'PINKSPRITE.png';
    spriteImage.onload = function() {
        drawImage(spriteImage, 0, 0, 500px, 500px);
    };
}

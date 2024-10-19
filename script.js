const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = innerWidth;
let height = innerHeight;
canvas.width = width;
canvas.height = height;
let movement = [false, false, false, false];
let Xvelocity = 0;
let Yvelocity = 0;
let camera = {
    x: 0,
    y: 0,
    Xoffset: width / 4,
    Yoffset: height / 4
};

window.addEventListener("keydown", event => {
    if (event.key === 'w') {
        movement[0] = true;
    }
    if (event.key === 's') {
        movement[1] = true;
    }
    if (event.key === 'd') {
        movement[2] = true;
    }
    if (event.key === 'a') {
        movement[3] = true;
    }
});

window.addEventListener("keyup", event => {
    if (event.key === 'w') {
        movement[0] = false;
        Yvelocity = 0;
    }
    if (event.key === 's') {
        movement[1] = false;
        Yvelocity = 0;
    }
    if (event.key === 'd') {
        movement[2] = false;
        Xvelocity = 0;
    }
    if (event.key === 'a') {
        movement[3] = false;
        Xvelocity = 0;
    }
});
class Player {
    constructor() {
        // Initialize the player at the origin (0, 0)
        this.x = width/2;
        this.y = height/2;
        this.radius = 20;
        this.color = "green";
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }



    update() {
        if (movement[0] && !movement[1]) {
            Yvelocity = Math.max(Yvelocity - 0.2, -4);
        }
        if (movement[1] && !movement[0]) {
            Yvelocity = Math.min(Yvelocity + 0.2, 4);
        }
        if (movement[2] && !movement[3]) {
            Xvelocity = Math.min(Xvelocity + 0.2, 4);
        }
        if (movement[3] && !movement[2]) {
            Xvelocity = Math.max(Xvelocity - 0.2, -4);
        }

        this.y += Yvelocity;
        this.x += Xvelocity;

        this.draw();
    }
}

class Bullet{
    constructor(p){
        this.x = p.x ;
        this.y = p.y ;
        this.radius = 10 ;
        this.color = "red" ;
    }
    draw(){

    }
    }

let p = new Player();
requestAnimationFrame(animate);

function animate() {
    clearCanvas();

    // Update camera position based on player movement
    if (p.x - camera.x > camera.Xoffset + width/2) {
        camera.x = p.x - camera.Xoffset - width/2;
    } else if (p.x - camera.x < camera.Xoffset) {
        camera.x = p.x - camera.Xoffset;
    }

    if (p.y - camera.y > camera.Yoffset + height/2) {
        camera.y = p.y - camera.Yoffset - height /2;
    } else if (p.y - camera.y < camera.Yoffset) {
        camera.y = p.y - camera.Yoffset;
    }
    console.log(p.x , p.y)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y); // Directly set transformation

    clearCanvas();

    // Draw a stationary red circle for reference
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(200, 200, 30, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    p.update();

    ctx.restore(); // Restore the canvas state to its original
    requestAnimationFrame(animate);
}

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(camera.x, camera.y, width, height);
}

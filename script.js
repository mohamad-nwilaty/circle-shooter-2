const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = innerWidth;
let height = innerHeight;
canvas.width = width;
canvas.height = height;
let movement = [false, false, false, false];
let Xvelocity = 0;
let Yvelocity = 0;
let weapon = "shotgun" ;
let rifleInterval = null ;
let mouseX = 0 ;
let mouseY = 0 ;
let camera = {
    x: 0,
    y: 0,
    
    
};
let mouseOffset = {
    x:0 ,
    y:0
}
let xMove = true
let yMove = true

let bullets = [];


class Player {
    constructor() {
        // Initialize the player at the origin (0, 0)
        this.x = width/2;
        this.y = height/2;
        this.radius = 20;
        this.color = "ghostwhite";
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
            Yvelocity = Math.max(Yvelocity - 0.2, -3);
        }
        if (movement[1] && !movement[0]) {
            Yvelocity = Math.min(Yvelocity + 0.2, 3);
        }
        if (movement[2] && !movement[3]) {
            Xvelocity = Math.min(Xvelocity + 0.2, 3);
        }
        if (movement[3] && !movement[2]) {
            Xvelocity = Math.max(Xvelocity - 0.2, -3);
        }
        
        
        camera.y += Yvelocity ;
        camera.x += Xvelocity  ;
        this.x += Xvelocity 
        this.y += Yvelocity
        // console.log( p.x -width*0.25  , camera.x)
        this.draw();
    }
}

class Bullet{
    constructor(p , angle){
        this.x = p.x ;
        this.y = p.y ;
        this.radius = 5 ;
        this.color = "red" ;
        this.velocity = {
            x : -Math.cos(angle) * 6 ,
            y : -Math.sin(angle) * 6
        }
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
    update(){
        this.x += this.velocity.x ;
        this.y += this.velocity.y ;
        this.draw()
    }
}

let p = new Player();
let b = new Bullet(p , 1)
requestAnimationFrame(animate); 

function animate() {
    clearCanvas();

    // this is to stop the camaera from scrolling past the player this way is the safest way to set it took me 4 hours to get to this I hate camera offsets so much kill me 
    if(p.x < camera.x + width *0.25){
        if(mouseOffset.x < 0){
            xMove=true
        }
        else{
            xMove=false
        }
    }
    if(p.x > camera.x + width *0.75){
        if(mouseOffset.x > 0){
            xMove=true
        }
        else{
            xMove=false
        }
    }
    if(p.y < camera.y + height *0.25){
        if(mouseOffset.y < 0){
            yMove=true
        }
        else{
            yMove=false
        }
    }
    if(p.y > camera.y + height *0.75){
        if(mouseOffset.y > 0){
            yMove=true
        }
        else{
            yMove=false
        }
    }

    if(xMove){
        camera.x += mouseOffset.x
    }
    if(yMove){
        camera.y += mouseOffset.y
    }
  
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y); // Directly set transformation
    clearCanvas();

    // Draw a stationary red circle for reference
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(100, 100 , 30, 0, Math.PI * 2, false);
    ctx.arc(600 , 600 , 30, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    for(let i=0 ; i < bullets.length ; i++){
        bullets[i].update()

        if(checkOutofBounds(bullets[i] , p)){
            bullets.splice(i , 1);
            i-- ;
        }
    }
    
    p.update();

    ctx.restore(); // Restore the canvas state to its original
    
    requestAnimationFrame(animate);
}

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(camera.x, camera.y, width, height);
}

function checkOutofBounds(bullet , player){
    if(bullet.x > (player.x + width) || bullet.x < (player.x - width)){
        return true ;
    }
    if(bullet.y > (player.y + height) || bullet.y < (player.y - height)){
        return true ;
    }

    return false ;
}
function shoot(event){
    x = p.x - camera.x ;
    y = p.y - camera.y ;
    let angle = Math.atan2(y - event.y , x - event.x )
    if(weapon == "pistol"){
        let b = new Bullet(p , angle);
        bullets.push(b)
    }
    else if(weapon == "shotgun"){
        let spread = -0.15
        for(let i =0 ; i<6 ; i++){
            let b = new Bullet(p , angle + spread );
            spread += 0.05
            bullets.push(b)
        }
    }
}

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

window.addEventListener("mousemove" , event =>{
    mouseX = event.clientX;
    mouseY = event.clientY; // track the mouse for the rifle stream to follow the mouse
    
    if(((event.x < width * 0.25 || event.x > width * 0.75) || (event.y < height * 0.25 || event.y > height * 0.75))  ){
        mouseOffset.x = -(width / 2 - event.clientX) / 140;
        mouseOffset.y = -(height / 2 - event.clientY ) / 140;
    }
    else{
        mouseOffset.x = 0 ;
        mouseOffset.y = 0 ;
    }
})
window.addEventListener("mousedown" , event =>{
    if(weapon == "rifle"){
        rifleInterval = setInterval(()=>{
            x = p.x - camera.x;
            y = p.y - camera.y;
            let angle = Math.atan2(y - mouseY, x - mouseX);
            let b = new Bullet(p , angle);
            bullets.push(b)
        }, 100)
    }
    else{
        shoot(event)
    }
})
window.addEventListener("mouseup" , event =>{
    if(rifleInterval){
        clearInterval(rifleInterval) ;
        rifleInterval = null ;
    }
})


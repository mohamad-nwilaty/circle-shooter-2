const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = innerWidth;
let height = innerHeight;
canvas.width = width;
canvas.height = height;
let score = 0 ;
let movement = [false, false, false, false];
let Xvelocity = 0;
let Yvelocity = 0;
const weapons = ["pistol" , "shotgun" , "rifle"] ;
let weaponIndex = 0 ;
let weapon = weapons[weaponIndex] ;
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
let enemies = [];


class Player {
    constructor() {
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
        
        this.draw();
    }
}
class Enemy {
    constructor(x,y , angle) {
        this.x = x ;
        this.y = y ;
        this.radius = 20;
        this.color = "red";
        this.angle = angle ;
        this.velocity = {
            x : -Math.cos(angle) * 3 ,
            y : -Math.sin(angle) * 3
        }
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
    update(){
        this.velocity = {
            x : -Math.cos(this.angle) * 3 ,
            y : -Math.sin(this.angle) * 3
        }
        this.x += this.velocity.x ;
        this.y += this.velocity.y ;
        this.draw() ; 
    }
}

class Bullet{
    constructor(p , angle , speed){
        this.x = p.x ;
        this.y = p.y ;
        this.radius = 5 ;
        this.color = "ghostwhite" ;
        this.speed = speed
        this.velocity = {
            x : -Math.cos(angle) * this.speed ,
            y : -Math.sin(angle) * this.speed
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
let enemy = new Enemy(10,10 ,4)
let enemySpawner = setInterval(spawnEnemy ,1000); // enemy spawner
requestAnimationFrame(animate); 

function animate() {
    weapon = weapons[weaponIndex]
    clearCanvas();
    console.log(bullets.length)
    
    restrictCamera()

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y); // Directly set transformation
    clearCanvas();
    
    for(let i=0 ; i < bullets.length ; i++){
        bullets[i].update()

        if(checkOutofBounds(bullets[i] , p)){
            bullets.splice(i , 1);
            i-- ;
        }
    }
    for(let i=0 ; i<enemies.length ; i++){
        enemies[i].angle = Math.atan2(enemies[i].y - p.y , enemies[i].x - p.x) ;
        enemies[i].update();
    }
    
    p.update();
    drawScore()
    ctx.restore(); // Restore the canvas state to its original
    
    requestAnimationFrame(animate);
}

function clearCanvas() {
    ctx.fillStyle = "rgba(0,0,0,0.4)";
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
function drawScore(){
    ctx.beginPath();
    ctx.font = "48px pixel" ;
    ctx.fillStyle = "red"
    ctx.fillText(score , camera.x + 20,camera.y + 50);
    ctx.fillText(weapon , camera.x + 20,camera.y +height -50);
    ctx.closePath();
}

function spawnEnemy(){
    let x = 100 ;
    let y = 100 ;
    let angle = Math.atan2(y-p.y , x-p.x)
    let enemy = new Enemy(x,y,angle)
    enemies.push(enemy)
}
function calculateCursorAngle(xPoint,yPoint){
    x = p.x - camera.x ;
    y = p.y - camera.y ;
    return Math.atan2(y - yPoint , x - xPoint )
}

function shoot(event){
    let angle = calculateCursorAngle(event.x , event.y)
    if(weapon == "pistol"){
        let b = new Bullet(p , angle , 12);
        bullets.push(b)
    }
    else if(weapon == "shotgun"){
        let spread = -0.15
        for(let i =0 ; i<6 ; i++){
            let b = new Bullet(p , angle + spread , 8 );
            spread += 0.05
            bullets.push(b)
        }
    }
}

function restrictCamera(){ // this is to stop the camaera from scrolling past the player this way is the safest way to set it took me 4 hours to get to this I hate camera offsets so much kill me 
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
    if(event.key == 'q'){
        if(weaponIndex >= weapons.length -1){
            weaponIndex = 0 ;
            
        }else{
            weaponIndex ++ ;
        }
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
            let b = new Bullet(p , calculateCursorAngle(mouseX,mouseY) , 6);
            bullets.push(b)
        }, 80)
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


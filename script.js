 let board ;
 let boardWidth=1012;
 let boardHeight=592;
 let context;
let birdWidth=34;
let birdHeight=24;

let birdX = birdWidth * 0.8;
let birdY = birdHeight * 0.1;
let birdImg;
let bird={
   x:birdX,
   y:birdY,
   width:birdWidth,
   height:birdHeight
}


let pipesArray=[];
let pipeWidth=70;
let pipeHeight=502;
let pipeX=boardWidth;
let pipeY=0;


let topPipeImg;
let bottomPipeImg;

//physics

let velocityX=-2;
let velocityY=0;
let gravity=0.2;

let gameover=false;
let score =0;


 window.onload = ()=>{
    board=document.getElementById('board');
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext('2d');


   //  context.fillStyle="green";
   //  context.fillRect(bird.x,bird.y,bird.width,bird.height);
   document.addEventListener('touchstart', function() {
      velocityY = -5;  // Same as space key for upward movement
   });


    birdImg=new Image();
    birdImg.src='./newflappy.png';

    birdImg.onload= function() {
      context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    }

      topPipeImg = new Image();

      topPipeImg.src='./toppipe.png';

      bottomPipeImg = new Image();
      bottomPipeImg.src='./bottompipe.png';


    requestAnimationFrame(update);

   setInterval(placepipe ,1500);

    document.addEventListener('keydown',moveBird);

   }

 function update(){
   requestAnimationFrame(update);
   if(gameover){
      return;
   }
   context.clearRect(0,0,boardWidth,boardHeight);
   velocityY+=gravity;
   bird.y=Math.max(bird.y+velocityY,0);

   context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);


   if(bird.y>boardHeight){
      gameover=true;
   }

   for(let i=0; i<pipesArray.length;  i++){
      let pipe=pipesArray[i];
      pipe.x+=velocityX;
      context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
      if(!pipe.passed && bird.x >pipe.x+pipe.width){
         score+=0.5;
         pipe.passed=true;
      }     
      if(DetectCollision(bird,pipe)){
         gameover=true;
      }
   }


   while(pipesArray.length >=0 && pipesArray[0].x<-pipeWidth){
      pipesArray.shift();
   }

   context.fillStyle="white";
   context.font="45px sans-serif";
   context.fillText(score,5,45);

   if(gameover){
      context.fillText("GAME OVER",400,300);
   }
 }


 function placepipe(){

   if(gameover){
      return;
   }


   let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
   let openSpace=boardHeight/4;

   let toppipe= {
      img: topPipeImg,
      x: pipeX,
      y:randomPipeY,
      width:pipeWidth,
      height:pipeHeight,
      passed: false
   }

   pipesArray.push(toppipe);



   let bottompipe = {
      img: bottomPipeImg,
      x:pipeX,
      y:randomPipeY+pipeHeight+openSpace,
      width: pipeWidth,
      height: pipeHeight,
      passed: false
   }

   pipesArray.push(bottompipe);
 }

function moveBird(e){
   if (gameover && e.code === 'Enter') {
      location.reload();  // Reloads the game
      return;
   }
   if(e.code=='space' || e.code=='ArrowUp' || e.code=='keyX'){
      velocityY+=-5;
   }else if(e.code=='ArrowDown'){
      velocityY+=5;
   }
}


function DetectCollision(a,b){
   return a.x<b.x+b.width &&
    a.x+a.width>b.x &&
     a.y<b.y+b.height &&
      a.y+a.height>b.y;
}
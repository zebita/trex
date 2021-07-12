var trex, trex_running, edges, trex_dead;
var groundImage;
var ground;
var pisoinvisible;
var nubes,nubesitas;
var obstaculoimg1,obstaculoimg2,obstaculoimg3,obstaculoimg4,obstaculoimg5;
var cactus;
var clouds;
var PLAY = 1;
var END = 0;
var estadodejuego = PLAY;
var score = 0;
var gameOverImg, restartImg, gameOver, restart;
var sonidodead,sonidojump,sonidocheck;

function preload(){
trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png") // precargar animaciones o imagenes
  nubesitas=loadImage("Cloud.png");
  obstaculoimg1=loadImage("Obstacle2-1.png");
  obstaculoimg2=loadImage("Obstacle2.png");
  obstaculoimg3=loadImage("Obstacle3.png");
  obstaculoimg4=loadImage("Obstacle4.png");
  obstaculoimg5=loadImage("Obstacle5.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("GameOver.png")
  
  trex_dead = loadAnimation("trex_collided.png");
  
  sonidodead = loadSound("die.mp3.mp3");
  sonidojump = loadSound("jump.mp3.mp3");
  sonidocheck = loadSound("checkPoint.mp3.mp3");
}

function setup(){
  createCanvas(600,200);
  //crea el Trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);//añadir animaciones
  trex.addAnimation("colision" , trex_dead);
  edges = createEdgeSprites();
  
  //añade escala y posición al Trex
  trex.scale = 0.5;
  trex.x = 50
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2; 
  pisoinvisible = createSprite(200,190,400,10);
  pisoinvisible.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //console.log("prueba  "   +     1);
  
  cactus=new Group();
  
  clouds=new Group();
  
  score = 0;
  
  trex.setCollider("circle" ,0,0,40);
  trex.debug=true;
  
  //var mensaje = "prueba";
  //console.log(mensaje);
}


function draw(){
  //establece un color de fondo 
  background("red");
  text ("score" + score ,500,50);
  console.log(estadodejuego);
  if(estadodejuego===PLAY){
     score = score + Math.round(getFrameRate()/60);
     ground.velocityX = -(2+3*score/100);
     gameOver.visible = false;
     restart.visible = false;
     trex.changeAnimation("running", trex_running)
    if(score>0 && score%100===0){
        sonidocheck.play();
      }
     
    if (ground.x <0){
    ground.x = ground.width/2;//repeticion del suelo
  }
    
    if(keyDown("space")&& trex.y>=160){
    trex.velocityY = -10;
    sonidojump.play();    
  }
    
    spawnClouds();
    spawnObtacles();
    trex.velocityY = trex.velocityY + 0.5;
    if(cactus.isTouching(trex)){
       estadodejuego=END;
       sonidodead.play();   
       }
    }
  
  else if(estadodejuego===END){
      ground.velocityX = 0;
      trex.velocityY=0;
      cactus.setLifetimeEach(-1);
      cactus.setVelocityXEach(0);
      clouds.setLifetimeEach(-1);
      clouds.setVelocityXEach(0);
      restart.visible=true;
      gameOver.visible=true;
      trex.changeAnimation("colision" , trex_dead);
        if (mousePressedOver(restart)){
      console.log("reinicio");
      reset();
    }
     }

  
  //ingresa la posición y del Trex
  //console.log(trex.y)  
  
  //salta cuando se presiona la barra espaciadora
  
  //evita que el Trex caiga
  trex.collide(pisoinvisible);
  

  drawSprites();
}
function spawnClouds(){
 if(frameCount%60===0){// mostrar las nubes cada 60 frames
  nubes = createSprite(600,100,40,10);
  nubes.velocityX=-3;
  nubes.lifetime=220;
  nubes.addImage(nubesitas);
  nubes.y=Math.round(random(10,60));//randomizar posicion en Y de las nubes
  nubes.depth=trex.depth;//igualar profundidad de las nubes y el trex
  trex.depth=trex.depth+1;
   clouds.add(nubes);
  }
}
function spawnObtacles(){
  if(frameCount%60===0){
    var obstaculo = createSprite(600,165,10,40);
    obstaculo.velocityX=-(6+score/100);
   var rand = Math.round(random(1,5));
   switch(rand){
     case 1: obstaculo.addImage(obstaculoimg1);
             break;
     case 2: obstaculo.addImage(obstaculoimg2);
             break;
     case 3: obstaculo.addImage(obstaculoimg3);
             break;
     case 4: obstaculo.addImage(obstaculoimg4);
             break;
     case 5: obstaculo.addImage(obstaculoimg5);
             break;
     default: break;        
   } 
    obstaculo.scale=0.5;
    obstaculo.lifetime=300;
    cactus.add(obstaculo);
  }
}
function reset(){
  estadodejuego=PLAY;
  clouds.destroyEach();
  cactus.destroyEach();
  gameOver.visible=false;
  restart.visible=false;
  score = 0;
  trex.changeAnimation("running", trex_running)
}

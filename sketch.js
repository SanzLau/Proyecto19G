//CREACIÓN DE VARIABLES
  var jugador; //jugador
  var puntos = 0; //puntaje
  var fondo, fondoImg; // fondo del juego
  var vistaizquierda; //vista izquierda del jugador
  var vistaderecha; //vista derecha del juagdor
  var gameState = "START"; //estados del juego
  var baseImg, baseGroup; //bases
  var premiosImg, premiosGroup; //premios
  var enemigosImg, enemigosGroup; //enemigos
  var sonido;
//FUNCION PARA CARGAR IMÁGENES Y ANIMACIONES
  function preload() {
    vistaderecha = loadImage("Carpeta1/Isabella.png");
    vistaizquierda = loadImage("Carpeta1/Personaje.png");

    //GUARDAR IMAGEN FONDO
    fondoImg = loadImage("Imagenes/Fondo1.png");
    premiosImg = loadImage("Carpeta1/Flores.png");
    enemigosImg = loadImage("Carpeta1/Lombriz.png");
    baseImg = loadImage("Carpeta1/Canasta base.png");
    
    sonido = loadSound("Carpeta1/sonido.mp3");
  }

//FUNCIÓN PARA DECLARAR SPRITES Y GRUPOS
  function setup() {
    createCanvas(450, 700);

    fondo = createSprite(225,330,20,30);
    fondo.addImage("fondo", fondoImg);

    jugador = createSprite(225, 450, 20, 20);
    jugador.addImage("imagen", vistaderecha);
    jugador.scale = 0.28;

    //Radio colisionador
    jugador.debug= false;
    jugador.setCollider("rectangle",0,-30,200,360);


    baseGroup = new Group();
    premiosGroup = new Group();
    enemigosGroup = new Group();
  }

//FUNCIÓN PARA DIBUJAR LOS SPRITES Y ESTABLECER LAS REGLAS DEL JUEGO.
  function draw() {
    background(220);
    drawSprites();
    
  //Puntuación
    textSize(20);
    fill("hotpink");
    text("Puntos: "+ puntos,10,25);

  //Inicio del juego
    if (gameState === "START" && keyDown("up_arrow") ){

    //Cambio de estado
      gameState="PLAY";

    }

    if (gameState === "PLAY") {
      //Fondo infinito
      fondo.velocityY = 1;
      
      if(fondo.y > 650){
        fondo.y = 100;
      }
      
      //gravedad
      jugador.velocityY = jugador.velocityY + 0.3;


    //Mover personaje con las flechas

      //movimiento derecha
      if (keyDown("right_arrow")) {
        jugador.x = jugador.x + 5;
      }

      //movimeinto izquierda
      if (keyDown("left_arrow")) {
        jugador.x = jugador.x - 5;
      }

      //Salto del jugador
      if (keyDown("up_arrow")) {
        jugador.velocityY = -4;
      }

      //crear bases y hacer que el personaje quede sobre ellas
      creaBases();
      
      if(jugador.isTouching(baseGroup)){
         jugador.velocityY=0;
       } 

      //Aumentar puntos
      if(jugador.isTouching(premiosGroup, removepremios)){
        puntos= puntos+10;
      }

      //crear Cosas Malas
      creaEnemigos();

      //Cambiar a estado GAMEOVER
      if (jugador.isTouching(enemigosGroup)) { 
          sonido.play();
          gameState= "GAMEOVER";
        }

    }

    //Estado GAMEOVER 
      if(gameState==="GAMEOVER"){
        jugador.velocityY=0;
       
        //sonido.play();
       
        
        textSize(40);
        fill("purple");
        text("game over", 100,200);
        
        textSize(25);
        fill("purple");
        text("Para volver a jugar presiona r", 100,300);
        
        if(gameState=== "GAMEOVER" && keyDown("r")){
          gameState = "PLAY";
          puntos=0;
        }
         }

  }


//FUNCION PARA CREAR BASES
  function creaBases() {
    if (frameCount % 90 === 0) {
      var base = createSprite(random(100, 400), 0, 70, 20);
      base.velocityY = 3.5;
      base.addImage("base",baseImg);
      base.scale=0.33;
      baseGroup.add(base);
      
      //Radio colisionador
      base.debug=false;
      base.setCollider("obb",0,20,100,40);
      
      //Profundidad
      jugador.depth = base.depth;
      jugador.depth= jugador.depth +1;

      var premios= createSprite(base.x,base.y-15,20,20);
      premios.velocityY=3.5;
      premios.addImage("floresitas",premiosImg);
      premios.scale=0.085;

      premiosGroup.add(premios);
    }

  }

//FUNCIÓN PARA CREAR ENEMIGOS
  function creaEnemigos() {
    var velo = 3;
    if (frameCount % 140 === 0) {
      var enemigos = createSprite(random(50,400),0,70,20)
      enemigos.velocityY=3;
      enemigos.addImage("nombre enemigo",enemigosImg);
      enemigos.scale = 0.08; 

      //Radio colisionador
      enemigos.debug= false;
      enemigos.setCollider("rectangle",0,-200,900,100);

      enemigosGroup.add(enemigos)
      
      //aumenta la velocidad
      enemigos.velocityY= 3+4 *puntos/60;
    }
    
  }

//FUNCION ELIMINAR PREMIOS
  function removepremios(sprite, premiosGroup) {
    premiosGroup.remove();


  }

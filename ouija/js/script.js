//<![CDATA[

var board, planchette;    // Board and planchette elements.

var boardY, boardY;       // Coordinates.
var nextX, nextY;
var saveX, saveY;
var posX, posY;

var offsetX = 75;         // Offset of viewport on planchette.
var offsetY = 70;

var questionFld,          // Question and reply form fields.
    replyFld;

var inReply   = false;    // Status flags.
var inContact = false;

var response;             // Response to spell out.
var nextChar;             // Next character to move to.

var step    =    16;       // Used for movement.
var timeout =   50;
var pause   = 2000;
var angle;
var timerID;


var chars = "abcdefghijklmnopqrstuvwxyz1234567890!~^_ ";



posX = new Array(105, 134, 171, 204, 240, 270, 305, 340, 372, 389, 420, 452, 484,
                 114, 151, 182, 217, 249, 274, 300, 331, 365, 399, 436, 466, 492,
                 154, 184, 217, 251, 281, 314, 346, 378, 410, 441,
                 137, 465, 300, 300, 300);
posY = new Array(182, 161, 145, 134, 126, 123, 124, 125, 130, 140, 146, 155, 175,
                 223, 202, 190, 181, 174, 171, 169, 172, 174, 185, 199, 211, 231,
                 280, 280, 280, 280, 280, 280, 280, 280, 280, 280,
                 054, 054, 350, 140, 215);

window.onload = init;

//-----------------------------------------------------------------------------
// Initialize everything.
//-----------------------------------------------------------------------------

function init() {

  var i;



  board = document.getElementById("board");
  boardX = getPageOffsetLeft(board);
  boardY = getPageOffsetTop(board);

  planchette = document.getElementById("planchette");
  i = chars.indexOf("_");
  moveElTo(planchette, boardX + posX[i] - offsetX, boardY + posY[i] - offsetY);
  planchette.style.visibility = "visible";
  


  questionFld = document.getElementById("question");
  replyFld = document.getElementById("reply");
}


function handsOn() {

  inContact = true;
}

function handsOff() {

  inContact = false;
  if (inReply) {
    saveX = getElLeft(planchette);
    saveY = getElTop(planchette);
    shakePlanchette();
  }
}

function startReply() {



  response += "_";
  if (!inContact) {
    saveX = getElLeft(planchette);
    saveY = getElTop(planchette);
    shakePlanchette();
  }
  if (getNext()) {
    inReply = true;
    movePlanchette();
  }
  else
    inReply = false;
}

function endReply() {



  nextChar = "";
  inReply = false;
}

function getNext() {

  var i;



  if (response == "")
    return false;

  nextChar = response.substr(0, 1)
  response = response.substr(1);
  for (i = 0; i < chars.length; i++)
    if (chars.charAt(i) == nextChar.toLowerCase()) {
      nextX = posX[i];
      nextY = posY[i];
      return true;
    }

  return false;
}

function movePlanchette() {

  var i, dx, dy, last, theta;



  if (!inReply)
    return;



  if (inContact) {



    dx = boardX + nextX - getElLeft(planchette) - offsetX;
    dy = boardY + nextY - getElTop(planchette) - offsetY;
    theta = Math.round(Math.atan2(-dy, dx) * 180 / Math.PI);
    if (theta < 0)
      theta += 360;



    if (Math.abs(dx) < step && Math.abs(dy) < step) {

   
      moveElBy(planchette, dx, dy);
      if (nextChar == "!")
	  	replyFld.value = "SIM";
      else if (nextChar == "~")
	  	replyFld.value = "NÃO";
      else if (nextChar == "^")
	  	replyFld.value = "GOOD BYE";
	  else if (nextChar != "_")
        replyFld.value += nextChar.toUpperCase();



      last = nextChar;
      if (getNext()) {
        if (nextChar == last) {
          angle = 0;
          timerID = window.setTimeout('circlePlanchette()', pause);
        }
        else
          timerID = window.setTimeout('movePlanchette()', pause);
        return;
      }

      

      else {
        endReply();
        return;
      }
    }

 

    else if (theta > 23 && theta <= 68)
      moveElBy(planchette, step, -step);
    else if (theta > 68 && theta <= 113)
      moveElBy(planchette, 0, -step);
    else if (theta > 113 && theta <= 158)
      moveElBy(planchette, -step, -step);
    else if (theta > 158 && theta <= 203)
      moveElBy(planchette, -step, 0);
    else if (theta > 203 && theta <= 248)
      moveElBy(planchette, -step, step);
    else if (theta > 248 && theta <= 293)
      moveElBy(planchette, 0, step);
    else if (theta > 293 && theta <= 338)
      moveElBy(planchette, step, step);
    else
      moveElBy(planchette, step, 0);
  }

  

  timerID = window.setTimeout('movePlanchette()', timeout);
}

function circlePlanchette() {

  var x, y;



  if (!inContact) {
    timerID = window.setTimeout('circlePlanchette()', timeout);
    return;
  }

  

  x = getElLeft(planchette) + step * Math.cos(angle);
  y = getElTop(planchette) - step * Math.sin(angle);
  moveElTo(planchette, x, y);
  angle += Math.PI / 10;
  if (angle < 2 * Math.PI)
    timerID = window.setTimeout('circlePlanchette()', timeout);
  else
    movePlanchette();
}

function shakePlanchette() {

  var dx, dy, x, y;

 

  if (inContact)
    return;

  

  dx = Math.floor(Math.random() * 5) - 2;
  dy = Math.floor(Math.random() * 5) - 2;
  x = saveX + dx;
  y = saveY + dy;
  moveElTo(planchette, x, y);
  timerID = window.setTimeout('shakePlanchette()', timeout);
}



var none = new Array("pergunte me", "estou aqui", "nao tenha medo", "fale",
                     "fale comigo", "estou ouvindo", "estou aguardando");
var days = new Array("domingo", "segunda", "terca", "quarta", "quinta",
                     "sexta", "sabado");
var months = new Array("em janeiro", "em fevereiro", "em marco", 
					   "em abril", "em maio", "em junho", "em julho", 
					   "em agosto", "em setembro", "em outubro", "em novembro","em dezembro");
var seasons = new Array("na primavera", "no verao", "no outono", "no inverno");
var times = new Array("nunca", "dia 10", "dia 20", "muito breve", "amanha", "semana que vem", "nao agora", "mais tarde", "no tempo certo", "ainda nao" , "em breve" , "logo mais", "logo logo");
var people = new Array("um amigo", "um estranho", "voce", "ninguem", "um espirito", "uma mulher", "uma criança", "uma entidade", "um homem");
var places = new Array("distante", "perto", "muito perto", "outro lugar",
                       "nao aqui");
var other = new Array("nao responderei isso" , "nao entendi" ,"nao pergunte isso", "nao sei", "cuidado com suas perguntas", "tenho medo de responder", "vejo coisas estranhas", "estou com medo de responder" , "nao pense nisso", "estou muito perto" , "nao olhe para tras" , "tem alguem ai com voce" , "estou ouvindo vozes" , "pergunte novamente" , "pergunte de outra forma" , "pergunte diferente"  , "nao gostei da sua pergunta" , "nao quero responder" , "vou perturbar seu sono" );
 
function consult() {

  var question, words, r;
  var i, today;

  

  if (timerID)
    clearTimeout(timerID);
  response = "";
  inReply = false;
  
  
  replyFld.value = "";



  question = questionFld.value;
  question = clean(question);
  words = question.split(" ");
  r = Math.random();



  if (question == "") {
    response = pickFromList(none);
    startReply();
    return false;
  }

  

  if (words.length >= 3)
    for (i = 0; i < words.length - 3; i++)
      if (words[i + 1] == "or") {
        if (r < .5)
          response = words[i];
        else
          response = words[i + 2];
        startReply();
        return false;
      }



  if (r < .1)
    response = pickFromList(other);

 

  else if (inList(words, "dia")) {         
    if (r < .7)
      response = pickFromList(days);
    else
      response = pickFromList(times);
  }
  else if ((inList(words, "mes")) || (inList(words, "mês"))) {    
    if (r < .7)
      response = pickFromList(months);
    else
      response = pickFromList(times);
  }
  else if (inList(words, "tempo"))            
    response = Math.floor(Math.random() * 12) + 1;
  else if (inList(words, "quando")) {          
    if (r < .3)
      response = pickFromList(days);
    if (r < .4)
      response = pickFromList(months);
    if (r < .5)
      response = pickFromList(seasons);
    else
      response = pickFromList(times);
  }

  // Asking for a number?

  else if (inList(words, "quanto") ||
      (inList(words, "pouco") ||
       inList(words, "quantos") ||
       inList(words, "muito") ||
       inList(words, "muitos"))) {
    response = Math.round(Math.random() * 10) + 1;    
    if (response != 10 && r < .5)                     
      response += Math.round(Math.random() * 10);
  }



  else if (inList(words, "quem")) {
    response = pickFromList(people);
  }



  else if (inList(words, "onde") ||
    inList(words, "aonde"))
    response = pickFromList(places);



  else if (inList(words, "porque") ||
  			inList(words, "por que") ||
			inList(words, "por quê") ||
			inList(words, "porquê") ||
			inList(words, "o quê") ||
  			inList(words, "o que"))

    response = pickFromList(other);



  else if (inList(words, "sou") ||
  		inList(words, "estou") ||
			inList(words, "esta") ||
			inList(words, "tem") ||
			inList(words, "temos") ||
			inList(words, "tenho") ||
			inList(words, "terei") ||
			inList(words, "serei") ||
			inList(words, "estarei") ||
      inList(words, "é") ||
		  inList(words, "era") ||
		  inList(words, "sera") ||
		  inList(words, "vou") ||
		  inList(words, "vai") ||
		  inList(words, "vão") ||
		  inList(words, "vao") ||
      inList(words, "pode") ||
		  inList(words, "posso") ||
      inList(words, "podem") ||
      inList(words, "poderia") ||
		  inList(words, "poderiam") ||
		  inList(words, "devemos") ||
		  inList(words, "devo") ||
		  inList(words, "deve") ||
		  inList(words, "devem") ||
      inList(words, "podia") ||
      inList(words, "me") ||
      inList(words, "ama") ||
      inList(words, "deveria")) {
    if (r < .5)
      response = "!";
    else
      response = "~";
  }



  if (response == "")
    response = pickFromList(other);



  startReply();
}

function abortReply() {

  var i;



  if (timerID)
    clearTimeout(timerID);
  response = "";
  inReply = false;


  
  i = chars.indexOf("_");
  moveElTo(planchette, boardX + posX[i] - offsetX, boardY + posY[i] - offsetY);
}

//-----------------------------------------------------------------------------
// Utility functions.
//-----------------------------------------------------------------------------

function clean(s) {

  var i, c, t;
  var letters = "abcdefghijklmnopqrstuvwxyz";



  t = s.toLowerCase();



  s = "";
  for (i = 0; i < t.length; i++) {
    if (t.substr(i, 2) == "'s") {
      s += " is";
      i++;
    }
    else if (t.substr(i, 2) == "'t") {
      s += " not";
      i++;
    }
    else if (t.substr(i, 3) == "'ll") {
      s += " will";
      i += 2;
    }
    else
      s += t.substr(i, 1);
  }



  t = "";
  for (i = 0; i < s.length; i++) {
    c = s.substr(i, 1);
    if (letters.indexOf(c) >= 0)
      t += c;
    else
      t += " ";
  }
  return t;
}

function inList(list, word) {

  var i;



  for (i = 0; i < list.length; i++)
    if (list[i] == word)
      return true;
  return false;
}

function pickFromList(list) {

  var r;



  r = Math.floor(Math.random() * list.length);
  return list[r];
}



function getPageOffsetLeft(el) {


  return el.offsetLeft + (el.offsetParent ? getPageOffsetLeft(el.offsetParent) : 0);
}

function getPageOffsetTop(el) {


  return el.offsetTop + (el.offsetParent ? getPageOffsetTop(el.offsetParent) : 0);
}

function getElLeft(el) {


  return parseInt(el.style.left, 10);
}

function getElTop(el) {


  return parseInt(el.style.top, 10);
}

function moveElTo(el, x, y) {


  el.style.left = x + "px";
  el.style.top  = y + "px";
}

function moveElBy(el, dx, dy) {


  el.style.left = (getElLeft(el) + dx) + "px";
  el.style.top  = (getElTop(el)  + dy) + "px";
}

//]]>
//<![CDATA[

var board, planchette;    // Board and planchette elements.

var boardY, boardY;       // Coordinates.
var nextX, nextY;
var saveX, saveY;
var posX, posY;

var offsetX = 70;         // Offset of viewport on planchette.
var offsetY = 70;

var inReply   = false;    // Status flags.
var inContact = false;

var answer;               // Response to spell out.
var nextChar;             // Next character to move to.

var step    =    10;       // Used for movement.
var timeout =   50;
var pause   = 2000;
var angle;
var timerID;

// Board positions, each letter and number has position. In addition, other
// symbols are used for other areas of the board:
// ! = 'yes'
// ~ = 'no'
// ^ = 'goodbye'
// _ = rest position
// and a space is a blank spot on the board.

var chars = "abcdefghijklmnopqrstuvwxyz1234567890!~^_ ";

// Set up character positions.

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

  // Initialize planchette.

  board = document.getElementById("board");
  boardX = getPageOffsetLeft(board);
  boardY = getPageOffsetTop(board);

  planchette = document.getElementById("planchette");
  i = chars.indexOf("_");
  moveElTo(planchette, boardX + posX[i] - offsetX, boardY + posY[i] - offsetY);
  planchette.style.visibility = "visible";
}

//-----------------------------------------------------------------------------
// These functions handle the movement of the planchette when revealing a
// response.
//-----------------------------------------------------------------------------

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

  // Start revealing an answer.

  answer += "_";
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

  // Done revealing answer.

  nextChar = "";
  inReply = false;
  inContact  = false;
}

function getNext() {

  var i;

  // Find the next character to move to.

  if (answer == "")
    return false;

  nextChar = answer.substr(0, 1)
  answer = answer.substr(1);
  for (i = 0; i < chars.length; i++)
    if (chars.charAt(i) == nextChar) {
      nextX = posX[i];
      nextY = posY[i];
      return true;
    }

  return false;
}

function movePlanchette() {

  var i, dx, dy, last, theta;

  // If no reply to give, return.

  if (!inReply)
    return;

  // If mouse is on planchette, move it.

  if (inContact) {

    // Move planchette toward the designated character.

    dx = boardX + nextX - getElLeft(planchette) - offsetX;
    dy = boardY + nextY - getElTop(planchette) - offsetY;
    theta = Math.round(Math.atan2(-dy, dx) * 180 / Math.PI);
    if (theta < 0)
      theta += 360;

    // If we reached the character, pause and start on the next one.

    if (Math.abs(dx) < step && Math.abs(dy) < step) {
      moveElBy(planchette, dx, dy);
      last = nextChar;

      // Circle if next character is the same as the last.

      if (getNext()) {
        if (nextChar == last) {
          angle = 0;
          timerID = window.setTimeout('circlePlanchette()', pause);
        }
        else
          timerID = window.setTimeout('movePlanchette()', pause);
        return;
      }

      // End movement if no more characters in reply.

      else {
        endReply();
        return;
      }
    }

    // If not, move it.

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

  // Set up next call.

  timerID = window.setTimeout('movePlanchette()', timeout);
}

function circlePlanchette() {

  var x, y;

  // Mouse on planchette?

  if (!inContact) {
    timerID = window.setTimeout('circlePlanchette()', timeout);
    return;
  }

  // Move the planchette in a small circle.

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

  // Mouse on planchette?

  if (inContact)
    return;

  // Randomly move planchette around it's original position.

  dx = Math.floor(Math.random() * 5) - 2;
  dy = Math.floor(Math.random() * 5) - 2;
  x = saveX + dx;
  y = saveY + dy;
  moveElTo(planchette, x, y);
  timerID = window.setTimeout('shakePlanchette()', timeout);
}

//-----------------------------------------------------------------------------
// This code handles the analysis of a question and generates an answer.
//-----------------------------------------------------------------------------

// Lists of responses by category.


var none = new Array("pergunta", "pergunte me", "estou aqui", "nao tenha medo", "fale",
                     "fale comigo", "estou ouvindo", "estou aguardando");
var days = new Array("domingo", "segunda", "terca", "quarta", "quinta",
                     "sexta", "sabado");
var months = new Array("em janeiro", "em fevereiro", "em marco", "em abril", "em maio", "em 				junho", "em julho", "em agosto", "em setembro", "em outubro", "em novembro",                 "em dezembro");
var seasons = new Array("na primavera", "no verao", "no outono", "no inverno");
var times = new Array("nunca", "dia 10", "dia 20","dia 10","muito breve", "amanha", "semana que vem", "nao agora", "mais tarde", "no tempo certo", "ainda nao");
var people = new Array("amigo", "estranho", "voce", "ninguem", "o proximo");
var places = new Array("distante", "perto", "muito perto", "outro lugar",
                       "nao aqui");
var other = new Array("nao sei", "cuidado com suas perguntas", "tenho medo de responder", "estou vendo coisas estranhas", "estou com medo", "em breve", "talvez depois", "futuramente",
                      "mais tarde", "nao pense nisso", "estou muito perto");

function consult() {

  var question, words, r;
  var i, today;

  // Make up and answer based on keywords in the question.

  inContact = false;
  question = document.forms[0].elements[0].value;
  question = clean(question);
  words = question.split(" ");
  r = Math.random();

  // No question?

  if (question == "") {
    answer = pickFromList(none);
    startReply();
    return false;
  }

  // Look for two words surrounding 'or' and pick one at random.

  if (words.length >= 3)
    for (i = 0; i < words.length - 3; i++)
      if (words[i + 1] == "ou") {
        if (r < .5)
          answer = words[i];
        else
          answer = words[i + 2];
        startReply();
        return false;
      }

  // At random, give a ambiguous answer.

  if (r < .1)
    answer = pickFromList(other);

  // Time related question?

  else if (inList(words, "dia")) {         // Pick a random day.
    if (r < .7)
      answer = pickFromList(days);
    else
      answer = pickFromList(times);
  }
  else if ((inList(words, "mes")) || (inList(words, "mês"))) {    // Pick a random month.
    if (r < .7)
      answer = pickFromList(months);
    else
      answer = pickFromList(times);
  }
  else if (inList(words, "tempo"))            // Pick random time.
    answer = Math.floor(Math.random() * 12) + 1;
  else if (inList(words, "quando")) {          // Pick a random time.
    if (r < .3)
      answer = pickFromList(days);
    if (r < .4)
      answer = pickFromList(months);
    if (r < .5)
      answer = pickFromList(seasons);
    else
      answer = pickFromList(times);
  }

  // Asking for a number?

  else if (inList(words, "quanto") &&
      (inList(words, "pouco") ||
       inList(words, "quantos") ||
       inList(words, "muito") ||
       inList(words, "muitos"))) {
    answer = Math.round(Math.random() * 10) + 1;    // Give a one or two digit
    if (answer != 10 && r < .5)                     // random number.
      answer += Math.round(Math.random() * 10);
  }

  // Asking about a person?

  else if (inList(words, "quem"))
    answer = pickFromList(people);

  // Asking about a place?

  else if (inList(words, "onde"))
    answer = pickFromList(places);

  // Asking about a thing?

  else if (inList(words, "porque") ||
  			inList(words, "por que") ||
  			inList(words, "o que"))
    answer = pickFromList(other);

  // Yes or no question?

  else if (inList(words, "sou") ||
  			inList(words, "estou") ||
			inList(words, "está") ||
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
           inList(words, "são") ||
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
           inList(words, "deveria")) {
    if (r < .5)
      answer = "!";
    else
      answer = "~";
  }

  // All else failed, give a nice, ambiguous answer.

  if (answer == "")
    answer = pickFromList(other);

  // Start the animation.

  startReply();
}

//-----------------------------------------------------------------------------
// Utility functions.
//-----------------------------------------------------------------------------

function clean(s) {

  var i, c, t;
  var letters = "abcdefghijklmnopqrstuvwxyz";

  // Convert string to lower case.

  t = s.toLowerCase();

  // Expand any contractions.

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

  // Replace any non-letters with spaces.

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

  // Return true if the given word is in the list.

  for (i = 0; i < list.length; i++)
    if (list[i] == word)
      return true;
  return false;
}

function pickFromList(list) {

  var r;

  // Return a random word from a list.

  r = Math.floor(Math.random() * list.length);
  return list[r];
}

//-----------------------------------------------------------------------------
// Positioning utility functions.
//-----------------------------------------------------------------------------

function getPageOffsetLeft(el) {

  // Return the true x coordinate of an element relative to the page.

  return el.offsetLeft + (el.offsetParent ? getPageOffsetLeft(el.offsetParent) : 0);
}

function getPageOffsetTop(el) {

  // Return the true y coordinate of an element relative to the page.

  return el.offsetTop + (el.offsetParent ? getPageOffsetTop(el.offsetParent) : 0);
}

function getElLeft(el) {

  // Returns an element's x-coordinate.

  return parseInt(el.style.left, 10);
}

function getElTop(el) {

  // Returns an element's y-coordinate.

  return parseInt(el.style.top, 10);
}

function moveElTo(el, x, y) {

  // Move an element to the specified coordinates.

  el.style.left = x + "px";
  el.style.top  = y + "px";
}

function moveElBy(el, dx, dy) {

  // Move an element by the specified offsets.

  el.style.left = (getElLeft(el) + dx) + "px";
  el.style.top  = (getElTop(el)  + dy) + "px";
}

//]]>
/*
    NAME: Bomberman
    AUTHOR: dres-t
    DESCRIPTION: a static version of the game bomberman
*/

console.log("begining bomberman");

let player1;
let player2;
let players;
const vakbreedte = 40;
const xrijen = 13; // liefst oneven
const yrijen = 13; // idem
const keyassignments = {90:"up", 68:"right", 81:"left", 83:"down", 38: "up", 39:"right", 37:"left", 40:"down"};
let lastbuttons1 = [];
let lastbuttons2 = [];
let bord;
let end_game = [false];

var imgextrabomb;
var imgrange;
var imgmovebomb;
var imgspeed;
var imgbox;
var imgwall;
var imgbomb;
var imgexplosion;
var imghat;

function setup() {
    let myCanvas = createCanvas(vakbreedte*xrijen, vakbreedte*yrijen);
    myCanvas.parent("myContainer");
    var myp5 = new p5(uitleg);
    setupGame();
    
    /*
    let naam1 = document.getElementById("naam1").value;
    let naam2 = document.getElementById("naam2").value;
    if (naam1 == "") {naam1 = "1"};
    if (naam2 == "") {naam2 = "2"};
    player1 = new player(color(255,0,0), 0, 0, naam1);
    player2 = new player(color(0,0,255),width-vakbreedte,height-vakbreedte, naam2);
    players = [player1, player2];

    bord = new field(players);
    console.log(bord);
    */
}

function draw() {
    // teken het bord
    background(225);
    if (!end_game[0]) {
        drawfield();
        bord.draw();
        // player1.draw();
        // player2.draw();

        // voer acties uit
        checkkeys();
        checkforpowerups();
        checkfordeath();
    }
    else {
        textSize(32);
        text("einde, speler "+end_game[1]+" wint", 50, height/2);
    }
}

function preload() {
    imgextrabomb = loadImage('images/extrabomb.png');
    imgrange = loadImage('images/range.png');
    imgmovebomb = loadImage('images/movebomb.png');
    imgspeed = loadImage('images/speed.png');
    imgbox = loadImage('images/box.png');
    imgwall = loadImage('images/muur.png');
    imgbomb = loadImage('images/bomb.png');
    imgexplosion = loadImage('images/explosion.png');
    imghat = loadImage('images/hat.png');
}

function setupGame() {
    let naam1 = document.getElementById("naam1").value;
    let naam2 = document.getElementById("naam2").value;
    if (naam1 == "") {naam1 = "1"};
    if (naam2 == "") {naam2 = "2"};
    player1 = new player(color(255,0,0), 0, 0, naam1);
    player2 = new player(color(0,0,255),width-vakbreedte,height-vakbreedte, naam2);
    players = [player1, player2];

    bord = new field(players);
    console.log(bord);
}

function drawfield() {
    stroke(50);
    for (let i=0;i<=height;i+=vakbreedte) {
        line(0,i,width,i);
    }
    for (let j=0;j<=width;j+=vakbreedte) {
        line(j,0,j,height);
    }
}

function keyPressed() {
    // console.log(key);
    if (key == "z") {
        lastbuttons1.push(90);
    }
    if (key == "d") {
        lastbuttons1.push(68);
    }
    if (key == "q") {
        lastbuttons1.push(81);
    }
    if (key == "s") {
        lastbuttons1.push(83);
    }
    if (key == "ArrowUp") {
        lastbuttons2.push(38);
    }
    if (key == "ArrowRight") {
        lastbuttons2.push(39);
    }
    if (key == "ArrowLeft") {
        lastbuttons2.push(37);
    }
    if (key == "ArrowDown") {
        lastbuttons2.push(40);
    }
    if (key == " ") {bord.addBomb(player1)}
    if (key == "Shift") {bord.addBomb(player2)}
}

function checkkeys() {
    // keys voor speler 1
    let teller = 1;
    while (teller <= lastbuttons1.length) {
        let lastbutton1 = lastbuttons1[lastbuttons1.length-teller];
        if (keyIsDown(lastbutton1)) {
            if (player1.canmove(keyassignments[lastbutton1])) {
                player1.move(keyassignments[lastbutton1]);
                break
            }
        }
        else {
            lastbuttons1.splice(lastbuttons1.length-teller, 1);
            teller-=1;
        }
        teller += 1;
    }
    
    // keys voor speler 2
    let teller2 = 1;
    while (lastbuttons2.length>=teller2) {
        let lastbutton2 = lastbuttons2[lastbuttons2.length-teller2];
        if (keyIsDown(lastbutton2)) {
            if (player2.canmove(keyassignments[lastbutton2])) {
                player2.move(keyassignments[lastbutton2]);
                break
            }      
        }
        else {
            lastbuttons2.splice(lastbuttons2.length-teller2, 1);
            teller2-=1;
        }
        teller2+=1;
    }
}

function checkforpowerups() {
    for (let i=0; i<players.length; i++) {
        players[i].checkpowerup();
    }
}

function checkfordeath() {
    for (let i=0; i<players.length; i++) {
        if (players[i].checkdeath()) {
            console.log("speler "+players[i].name+" died");
            players.splice(i,1);
            // end_game = true;
        }
    }
    if (players.length == 1) {end_game = [true, players[0].name]}
    else if (players.length == 0) {end_game = [true, "niemand"]}
}

function reset_knop() {
    console.log("resetted");
    setupGame();
    end_game = [false];
}

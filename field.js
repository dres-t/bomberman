class field{
    constructor(players = []) {
        this.speelbord = {};
        this.xvelden = width/vakbreedte;
        this.yvelden = width/vakbreedte;
        this.nobeginbox = [];
        this.players = players;

        this.nobeginbox = [[0,0],[0,1],[1,0],[this.xvelden-1, this.yvelden-1],[this.xvelden-2,this.yvelden-1],[this.xvelden-1, this.yvelden-2]];
        for (let i=0; i<3*(this.xvelden+this.yvelden); i++) {
            let x = int(random(0, this.xvelden));
            let y = int(random(0, this.yvelden));
            append(this.nobeginbox, [x, y]);
        }
        for (let i=0; i<this.xvelden; i++) {
            for (let j=0; j<this.yvelden; j++) {
                if (!bevat(this.nobeginbox, new Array(i,j))) {
                    this.speelbord[[i, j]] = "box";
                }
            }
        }

        for (let i=1; i<this.xvelden-1; i+=2) {
            for (let j=1; j<this.yvelden-1; j+=2) {
                this.speelbord[[i,j]] = "wall";
            }
        }

    }

    addExplosion(x, y, range = 1) {
        console.log("add explosion");
        this.speelbord[[x, y]] = new explosion(x, y);
        let drop = 3;
        // rechts
        for (let i= 1; i<=range; i++) {
            let cell = [x+i, y];
            let cellelem = this.speelbord[cell];
            if (cell[0] < 0 || cell[0] >= this.xvelden || cell[1] < 0 || cell[1] >= this.yvelden || cellelem == "wall") {break}
            if (cellelem == "box") {
                delete this.speelbord[cell];
                let rand = int(random(0,drop));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
                cellelem.getSpeler().aantalbombs -= 1;
                break
            }
            this.speelbord[cell] = new explosion(cell[0], cell[1]);
        }
        // links, zeer gelijkaardig
        for (let i= 1; i<=range; i++) {
            let cell = [x-i, y];
            let cellelem = this.speelbord[cell];
            if (cell[0] < 0 || cell[0] >= this.xvelden || cell[1] < 0 || cell[1] >= this.yvelden || cellelem == "wall") {break}
            if (cellelem == "box") {
                delete this.speelbord[cell];
                let rand = int(random(0,drop));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
                cellelem.getSpeler().aantalbombs -= 1;
                break
            }
            this.speelbord[cell] = new explosion(cell[0], cell[1]);
        }
        // boven
        for (let i= 1; i<=range; i++) {
            let cell = [x, y-i];
            let cellelem = this.speelbord[cell];
            if (cell[0] < 0 || cell[0] >= this.xvelden || cell[1] < 0 || cell[1] >= this.yvelden || cellelem == "wall") {break}
            if (cellelem == "box") {
                delete this.speelbord[cell];
                let rand = int(random(0,drop));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
                cellelem.getSpeler().aantalbombs -= 1;
                break
            }
            this.speelbord[cell] = new explosion(cell[0], cell[1]);
        }
        // onder
        for (let i= 1; i<=range; i++) {
            let cell = [x, y+i];
            let cellelem = this.speelbord[cell];
            if (cell[0] < 0 || cell[0] >= this.xvelden || cell[1] < 0 || cell[1] >= this.yvelden || cellelem == "wall") {break}
            if (cellelem == "box") {
                delete this.speelbord[cell];
                let rand = int(random(0,drop));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
                cellelem.getSpeler().aantalbombs -= 1;
                break
            }
            this.speelbord[cell] = new explosion(cell[0], cell[1]);
        }
        console.log(this);
    }

    draw() {
        let textures = document.getElementById("textures").checked;
        for (let i=0; i<this.xvelden; i++) {
            for (let j=0; j<this.yvelden; j++) {
                let co = getdrawco(i, j);
                // console.log(textures);
                // teken walls
                if (this.speelbord[[i,j]] == "wall") {
                    if (!textures) {
                        fill(color(0,255,0));
                        rect(co[0], co[1], vakbreedte, vakbreedte);
                    }
                    else {image(imgwall, co[0], co[1], vakbreedte, vakbreedte);}                    
                }
                // teken boxes
                else if (this.speelbord[[i, j]] == "box") {
                    if (!textures) {
                        fill(color(230, 230, 28));
                        rect(co[0],co[1], vakbreedte, vakbreedte);
                    }
                    else {image(imgbox, co[0] + 5, co[1] + 5, vakbreedte - 10, vakbreedte - 10);}
                }
                // teken bombs, tel ze af en beweeg ze
                else if (typeof(this.speelbord[[i, j]]) == "object" && this.speelbord[[i, j]].type() == "bomb") {
                    this.speelbord[[i, j]].draw(textures);
                    // move
                    let moveret = this.speelbord[[i, j]].move();
                    if (moveret[0]) {
                        this.speelbord[[moveret[1], moveret[2]]] = this.speelbord[[i, j]];
                        delete this.speelbord[[i, j]];
                    }
                    // explode
                    else if (this.speelbord[[i, j]].countdown()) {
                        console.log("explode!");
                        this.speelbord[[i, j]].getSpeler().aantalbombs -= 1;
                        let range = this.speelbord[[i, j]].range
                        delete this.speelbord[[i, j]];
                        this.addExplosion(i, j, range);
                    }
                }
                // teken de explosions en tel ze af
                else if (typeof(this.speelbord[[i, j]]) == "object" && this.speelbord[[i, j]].type() == "explosion") {
                    this.speelbord[[i, j]].draw(textures);
                    if (this.speelbord[[i, j]].countdown()) {
                        console.log("end explosion");
                        delete this.speelbord[[i, j]];
                    }
                }
                // teken de power ups
                else if (typeof(this.speelbord[[i, j]]) == "object" && this.speelbord[[i, j]].type() == "power") {
                    this.speelbord[[i, j]].draw();
                }
            }
        }
        // teken de spelers
        for (let i=0; i<this.players.length; i++) {this.players[i].draw(textures)}
    }

    checkCell(x, y, movebomb = false, movedirection = "up") {
        let cellelem = this.speelbord[[x, y]];
        // buiten veld
        if (x < 0 || x >= this.xvelden) {return false}
        if (y < 0 || y >= this.yvelden) {return false}
        
        // muur of box
        if (cellelem == "wall" || cellelem == "box") {return false}

        // bomb
        if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
            if (movebomb) {cellelem.setDirection(movedirection)}
            return false;
        }

        // andere speler
        for (let i=0; i<this.players.length; i++) {
            let playercell = this.players[i].getCell();
            if (playercell[0] == x && playercell[1] == y) {return false}
        }

        // alles oke
        return true
    }

    addBomb(speler) {
        if (speler.aantalbombs < speler.maxbombs) {
            speler.aantalbombs += 1;
            let cell = speler.getCell();
            this.speelbord[cell] = new bomb(cell[0], cell[1], speler, speler.rangebomb);
        }
    }
}

function bevat(biglijst, smalllijst) {
    for (let x=0; x < biglijst.length; x++) {
        if (biglijst[x][0] == smalllijst[0] && biglijst[x][1] == smalllijst[1]) {
            return true
        }
    }
    return false
}

function getdrawco(i,j) {
    let xco = i*vakbreedte;
    let yco = j*vakbreedte;
    return [xco, yco];
}

class bomb {
    constructor(x, y, speler, range = 1) {
        this.xcell = x;
        this.ycell = y;
        this.r = vakbreedte/2;
        this.xdraw = x*vakbreedte + this.r;
        this.ydraw = y*vakbreedte + this.r;
        this.direction = "nope"; 
        this.timer = 200;
        this.range = range;
        this.speler = speler;
        this.speed = 2;
    }

    draw(textures) {
        if (!textures) {
            fill(color(30,30,30));
            ellipse(this.xdraw, this.ydraw, this.r*1.5, this.r*1.5);
        }
        else {image(imgbomb, this.xdraw - vakbreedte*(3/8), this.ydraw - vakbreedte*(3/8), vakbreedte*(3/4), vakbreedte*(3/4));}
    }

    countdown() {
        this.timer -= 1;
        if (this.timer <= 0) {return true}
        return false;
    }

    type() {
        return "bomb";
    }

    getSpeler() {
        return this.speler;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    drawtocell() {
        return [int(this.xdraw/vakbreedte), int(this.ydraw/vakbreedte)];
    }

    celltodraw() {
        this.xdraw = this.xcell*vakbreedte + this.r;
        this.ydraw = this.ycell*vakbreedte + this.r;
    }

    move() {
        if (this.direction != "nope") {
            // console.log("bewegende bomb");
            // omhoog
            if (this.direction == "up") {
                this.ydraw -= this.speed;
                if ((this.ydraw%vakbreedte<=vakbreedte/2 || this.ydraw <= 0 ) && (!bord.checkCell(this.xcell, this.ycell-1))) {
                    this.celltodraw(); this.direction = "nope";
                }
            }
            // omlaag
            else if (this.direction == "down") {
                this.ydraw += this.speed;
                if ((this.ydraw%vakbreedte>=vakbreedte/2 || this.ydraw%vakbreedte == 0) && (!bord.checkCell(this.xcell, this.ycell+1))) {
                    this.celltodraw(); this.direction = "nope";
                }
            }
            // links
            else if (this.direction == "left") {
                this.xdraw -= this.speed;
                if ((this.xdraw%vakbreedte<=vakbreedte/2 || this.xdraw <= 0 ) && (!bord.checkCell(this.xcell - 1, this.ycell))) {
                    this.celltodraw(); this.direction = "nope";
                }
            }
            // rechts
            else if (this.direction == "right") {
                this.xdraw += this.speed;
                if ((this.xdraw%vakbreedte>=vakbreedte/2 || this.xdraw%vakbreedte == 0) && (!bord.checkCell(this.xcell+1, this.ycell))) {
                    this.celltodraw(); this.direction = "nope";
                }
            }
        }
        // kijken of er van cell veranderd is
        let newcell = this.drawtocell();
        if (!(newcell[0] == this.xcell && newcell[1] == this.ycell)) {
            this.xcell = newcell[0]; this.ycell = newcell[1];
            return [true, newcell[0], newcell[1]];
        }
        return [false, this.xcell, this.ycell];
    }
}

class explosion {
    constructor(x, y) {
        this.xco = x;
        this.yco = y;
        this.timer = 90;
    }

    draw(textures) {
        let co = getdrawco(this.xco, this.yco)
        if (!textures) {
            fill(color(242, 105, 0));
            rect(co[0] + vakbreedte/4, co[1] + vakbreedte/4, vakbreedte/2, vakbreedte/2);
        }
        else {image(imgexplosion, co[0], co[1], vakbreedte, vakbreedte);}
    }

    type() {
        return "explosion";
    }

    countdown() {
        this.timer -= 1;
        if (this.timer <= 0) {return true}
        return false;
    }
}

class power {
    constructor(x, y) {
        this.xcell = x;
        this.ycell = y;
        let rand = int(random(0,4));  // 4 power ups: max bombs, range bombs, move bombs, speed
        if (rand == 0) {this.power = "extrabombs"}
        if (rand == 1) {this.power = "range"}
        if (rand == 2) {this.power = "movebombs"}
        if (rand == 3) {this.power = "speed"}
    }

    draw() {
        let xdraw = this.xcell*vakbreedte + vakbreedte/8;
        let ydraw = this.ycell*vakbreedte + vakbreedte/8;

        if (this.power == "extrabombs") {image(imgextrabomb, xdraw, ydraw)}
        if (this.power == "range") {image(imgrange, xdraw, ydraw)}
        if (this.power == "movebombs") {image(imgmovebomb, xdraw, ydraw)}
        if (this.power == "speed") {image(imgspeed, xdraw, ydraw)}
    }

    type() {
        return "power";
    }
}
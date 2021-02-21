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
        // rechts
        for (let i= 1; i<=range; i++) {
            let cell = [x+i, y];
            let cellelem = this.speelbord[cell];
            if (cell[0] < 0 || cell[0] >= this.xvelden || cell[1] < 0 || cell[1] >= this.yvelden || cellelem == "wall") {break}
            if (cellelem == "box") {
                delete this.speelbord[cell];
                let rand = int(random(0,5));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
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
                let rand = int(random(0,5));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
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
                let rand = int(random(0,5));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
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
                let rand = int(random(0,5));
                if (rand == 0) {
                    this.speelbord[cell] = new power(cell[0], cell[1]);
                }
                break;
            }
            if (typeof(cellelem) == "object" && cellelem.type() == "bomb") {
                this.addExplosion(cell[0], cell[1], cellelem.range);
                break
            }
            this.speelbord[cell] = new explosion(cell[0], cell[1]);
        }
        console.log(this);
    }

    draw() {
        for (let i=0; i<this.xvelden; i++) {
            for (let j=0; j<this.yvelden; j++) {
                let co = getdrawco(i, j);
                // teken walls
                if (this.speelbord[[i,j]] == "wall") {
                    fill(color(0,255,0));
                    rect(co[0], co[1], vakbreedte, vakbreedte);
                }
                // teken boxes
                else if (this.speelbord[[i, j]] == "box") {
                    fill(color(230, 230, 28));
                    rect(co[0],co[1], vakbreedte, vakbreedte);
                }
                // teken bombs, tel ze af en beweeg ze
                else if (typeof(this.speelbord[[i, j]]) == "object" && this.speelbord[[i, j]].type() == "bomb") {
                    this.speelbord[[i, j]].draw();
                    if (this.speelbord[[i, j]].countdown()) {
                        console.log("explode!");
                        this.speelbord[[i, j]].getSpeler().aantalbombs -= 1;
                        let range = this.speelbord[[i, j]].range
                        delete this.speelbord[[i, j]];
                        this.addExplosion(i, j, range);
                    }
                }
                // teken de explosions en tel ze af
                else if (typeof(this.speelbord[[i, j]]) == "object" && this.speelbord[[i, j]].type() == "explosion") {
                    this.speelbord[[i, j]].draw();
                    if (this.speelbord[[i, j]].countdown()) {
                        console.log("end explosion");
                        delete this.speelbord[[i, j]];
                    }
                }
            }
        }
        for (let i=0; i<this.players.length; i++) {this.players[i].draw()}
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
            // if (cellelem.direction !)

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
        this.timer = 250;
        this.range = range;
        this.speler = speler;
    }

    draw() {
        fill(color(30,30,30));
        ellipse(this.xdraw, this.ydraw, this.r*1.5, this.r*1.5);
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
}

class explosion {
    constructor(x, y) {
        this.xco = x;
        this.yco = y;
        this.timer = 125;
    }

    draw() {
        fill(color(242, 105, 0));
        let co = getdrawco(this.xco, this.yco)
        rect(co[0] + vakbreedte/4, co[1] + vakbreedte/4, vakbreedte/2, vakbreedte/2);
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
        this.xco = x;
        this.yco = y;
        let rand = int(random(0,3));

    }

    type() {
        return "power";
    }
}
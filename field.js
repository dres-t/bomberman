class field{
    constructor() {
        this.speelbord = {};
        this.xvelden = width/vakbreedte;
        this.yvelden = width/vakbreedte;
        this.nobeginbox = [];

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
        console.log("not yet implemented")
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
                // teken bombs en tel ze af
                else if (typeof(this.speelbord[[i, j]]) == "object" && this.speelbord[[i, j]].type() == "bomb") {
                    this.speelbord[[i, j]].draw();
                    if (this.speelbord[[i, j]].countdown()) {
                        console.log("explode!");
                        this.addExplosion(i, j, this.speelbord[[i, j]].range);
                        delete this.speelbord[[i, j]];
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
    }

    checkCell(x, y) {
        // buiten veld
        if (x < 0 || x >= this.xvelden) {return false}
        if (y < 0 || y >= this.yvelden) {return false}

        // muur of box
        if (this.speelbord[[x, y]] == "wall" || this.speelbord[[x, y]] == "box") {return false}

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
    constructor(x, y, range = 1) {
        this.xco = x;
        this.yco = y;
        this.timer = 250;
        this.range = range;
    }

    draw() {
        fill(color(30,30,30));
        let r = vakbreedte/2;
        ellipse(this.xco*vakbreedte + r, this.yco*vakbreedte + r, r*1.5, r*1.5);
    }

    countdown() {
        this.timer -= 1;
        if (this.timer <= 0) {return true}
        return false;
    }

    type() {
        return "bomb";
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
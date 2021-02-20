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

    getdrawco(i,j) {
        let xco = i*vakbreedte;
        let yco = j*vakbreedte;
        return [xco, yco];
    }

    draw() {
        for (let i=0; i<this.xvelden; i++) {
            for (let j=0; j<this.yvelden; j++) {
                let co = this.getdrawco(i, j);
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
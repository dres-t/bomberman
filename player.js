class player {
    constructor(color,beginx = 0, beginy = 0) {
        this.color = color;
        this.xco = beginx;
        this.yco = beginy;
        this.speed = 2.5;
        this.cell = this.getCell();
        this.aantalbombs = 0;
        this.maxbombs = 1;
        this.movebomb = false;
        this.rangebomb = 1;
    }
    
    draw() {
        fill(this.color);
        let r = vakbreedte/2;
        ellipse(this.xco + r,this.yco + r,r,r);
    }

    canmove(direction) {
        let offset = vakbreedte/4;
        this.cell = this.getCell();
        if (direction == "up" || direction =="down") {
            // check of gewenste cell mag
            if (direction == "up" && (this.yco%vakbreedte>vakbreedte/2 || this.yco <= 0 || this.yco%vakbreedte == 0)) {
                if (!bord.checkCell(this.cell[0],this.cell[1]-1, this.movebomb, "up")) {return false} }
            if (direction == "down" && this.yco%vakbreedte<vakbreedte/2) {
                if (!bord.checkCell(this.cell[0],this.cell[1]+1, this.movebomb, "down")) {return false} }

            // als de cell oke is
            if (this.xco%vakbreedte <= offset) {
                this.xco = int(this.xco/vakbreedte) * vakbreedte;
                return true;
            }
            else if (this.xco%vakbreedte > vakbreedte-offset) {
                this.xco = (int(this.xco/vakbreedte) * vakbreedte) + vakbreedte;
                return true;
            }
            return false
        }
        else if (direction == "left" || direction == "right") {
            // check of gewenste cell mag
            if (direction == "left" && (this.xco%vakbreedte>vakbreedte/2 || this.xco <= 0 || this.xco%vakbreedte == 0)) {
                if (!bord.checkCell(this.cell[0]-1,this.cell[1], this.movebomb, "left")) {return false} }
            if (direction == "right" && this.xco%vakbreedte<vakbreedte/2) {
                if (!bord.checkCell(this.cell[0]+1,this.cell[1], this.movebomb, "right")) {return false} }

            // als de cell oke is
            if (this.yco%vakbreedte <= offset) {
                this.yco = int(this.yco/vakbreedte) * vakbreedte;
                return true;
            }
            else if (this.yco%vakbreedte > vakbreedte-offset) {
                this.yco = (int(this.yco/vakbreedte) * vakbreedte) + vakbreedte;
                return true;
            }
            return false
        }
        return true
    }

    move(direction) {
        /*  
        if (!this.canmove(direction)) {         // zit al op hoger niveau
            return
        }
        */
        if (direction == "up") {  // z = 90
            this.yco -= this.speed;
        }
        else if (direction == "down") { // s = 83
            this.yco += this.speed;
        }
        else if (direction == "right") { // d = 68
            this.xco += this.speed;
        }
        else if (direction == "left") { // q = 81
            this.xco -= this.speed;
        }
    }

    getCell() {
        let xcell = int((this.xco+vakbreedte/2) / vakbreedte);
        let ycell = int((this.yco+vakbreedte/2) / vakbreedte);
        return [xcell, ycell];
    }

    checkpowerup() {
        let cell = this.getCell();
        let cellelem = bord.speelbord[cell];
        if (typeof(cellelem) == "object" && cellelem.type() == "power") {
            if (cellelem.power == "extrabombs") {this.maxbombs += 1}
            if (cellelem.power == "range") {this.rangebomb += 1}
            if (cellelem.power == "movebombs") {this.movebomb = true}
            if (cellelem.power == "speed" && this.speed < 5) {this.speed += 0.5}
            delete bord.speelbord[cell];
        }
    }

    checkdeath() {
        let cell = this.getCell();
        let cellelem = bord.speelbord[cell];
        if (typeof(cellelem) == "object" && cellelem.type() == "explosion") {
            return true;
        }
        return false;
    }
}

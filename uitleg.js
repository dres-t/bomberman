var uitleg = function(p) {

    p.setup = function() {
        let myuitlegcanvas = p.createCanvas(600, vakbreedte*yrijen);
        myuitlegcanvas.parent("myContainer");
        p.background(200);
        p.noLoop()

    }
    p.draw = function() {
        p.textSize(20);
        let doel = "Doel van het spel: probeer de andere speler te vermoorden.";
        let regels = "Regels: enkel de dozen (geel) kunnen kapot gemaakt worden, hieruit kunnen 'power-ups' verkregen worden.";
        let besturing = "Besturing: speler 1 speelt met 'z,q,s,d' en spatie, speler 2 speelt met de pijltjes en 'Shift'.";
        
        p.text(doel, 25, 25, 550, 100);
        p.text(regels, 25, 68, 551,120);
        p.text(besturing, 25,135, 520, 150);
        p.text("power-ups:", 25, 230,520,100);

        let extrabombt = "'Extra bom': je kan een extra bom op hetzelfde moment leggen.";
        let movebombt = "'Beweeg bom': je kan nu bommen (terug)       duwen door er tegen te lopen.";
        let rangt = "'Kracht': je bommen zijn krachtiger en         rijken verder.";
        let speedt = "Snelheid': je kan sneller lopen";

        p.image(imgextrabomb, 25, 282, 50, 50); p.text(extrabombt, 90, 275, 205, 200);
        p.image(imgmovebomb, 25, 420, 50, 50); p.text(movebombt, 90, 400, 189, 200);
        p.image(imgrange, 330,282,50,50); p.text(rangt, 400, 272, 180, 200);
        p.image(imgspeed, 330, 420, 50, 50); p.text(speedt, 400, 422, 160, 200);
        }
}
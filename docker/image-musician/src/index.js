
var dgram = require('dgram');
const uuid =require('uuid/v1')
const ADRESS = "238.255.255.1";
const PORT = 34641;
function musicien(instrument){
    this.instrument = instrument;
    var instruments = new Map();
	instruments.set("piano", "ti-ta-ti");
	instruments.set("trumpet", "pouet");
	instruments.set("flute", "trulu");
	instruments.set("violin", "gzi-gzi");
    instruments.set("drum", "boum-boum");
    const udpSocket = dgram.createSocket('udp4');
    var note = {
        son: instruments.get(this.instrument),
        uuid: uuid()
    };
    var payload = JSON.stringify(note);
    musicien.prototype.update = function() {
        var message = new Buffer(payload);
        udpSocket.send(message,0 , message.length, 
            PORT, ADRESS, function(){
                console.log("Le musicien " + note.instrument + " joue avec l'uuid " + note.uuid
                + " et cela fait "+ note.son);
            });
    }
    setInterval(this.update.bind(this),500);
}

var instrument = process.argv[2];
var musicien = new musicien(instrument);

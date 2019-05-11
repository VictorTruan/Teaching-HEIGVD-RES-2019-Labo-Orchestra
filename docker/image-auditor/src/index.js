var dgram = require('dgram');
var moment = require('moment');
var net = require('net');
var ArrayList = require('arraylist')
const ADRESS = "238.255.255.1";
const PORT = 34641;
const udpSocket = dgram.createSocket('udp4');
function auditor(){
    var listened = new ArrayList;
    udpSocket.bind(PORT, function(){
        udpSocket.addMembership(ADRESS);
    });
    
    udpSocket.on('message', function(msg, source){
        var tmp = JSON.parse(msg);
        updateTime(tmp.uuid, tmp.instrument);    
    });

    function updateTime(uuid, instrument){
        var tmp = {
            uuid: uuid,
            time: new Date(),
            lastSound : moment(this.time),
            instrument : instrument
        }
        var isInside = false;
        for (var element of listened){
            if(element.uuid == tmp.uuid){
                isInside = true;
                if(element.activeSince == null){
                    element.activeSince = tmp.lastSound;
                }
                element.lastSound = tmp.lastSound;
            }
        };
        if(!isInside){
            listened.add(tmp);
        }
    }

    auditor.prototype.updateList = function(){
        var datetmp = moment(new Date())
        for(var element of listened) {
            if(datetmp-element.lastSound>5000){
                listened.removeElement(element);
            }
        }
        console.log(listened);
    }

    var serveur = net.createServer();
    serveur.listen(2205);
    serveur.on("connection",function(socket){
        var tmp = new ArrayList;
            for (var element of listened){
                tmp.add({
                    uuid: element.uuid,
                    instrument: element.instrument,
                    activeSince: element.activeSince
                })
            }
            socket.write(JSON.stringify(tmp));
            socket.end();

    });
    setInterval(this.updateList.bind(this),500);
}

var auditor = new auditor();
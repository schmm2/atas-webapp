class Tracker {

    constructor(id){
        this.key = id;
        this.position = {};
        this.render = false
        this.inDangerzone = false
        this.buttonPressed = false
    }

    setGPS(gpsObject){
        this.position.lat =  parseFloat(gpsObject.lat);
        this.position.lng =  parseFloat(gpsObject.lng);
    }

    setButtonPressed(buttonPressed){
        this.buttonPressed = buttonPressed;
    }

    setInDangerzone(inDangerzone){
        this.inDangerzone = inDangerzone;
    }

    getButtonPressed(){
        return this.buttonPressed;
    }

    getInDangerzone(){
        return this.inDangerzone;
    }
    getLatitude(){
        return this.position.lat;
    }

    getLongitude(){
        return this.position.lng;
    }

    getId(){
        return this.key;
    }
}
module.exports = Tracker;
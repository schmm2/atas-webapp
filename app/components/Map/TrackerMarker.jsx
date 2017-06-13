class TrackerMarker {

    constructor(id){
        this.key = id;
        this.position = {};
        this.defaultAnimation = 2
        this.inDangerzone = false
        this.buttonPressed = false
    }

    setLongitude(lng){
        this.position.lng = lng;
    }

    setLatitude(lat) {
        this.position.lat = lat;
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
module.exports = TrackerMarker;
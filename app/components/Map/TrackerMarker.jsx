class TrackerMarker {

    constructor(id){
        this.key = id;
        this.position = {
            lat: 0,
            lng: 0
        };
        this.visible = false
        this.defaultAnimation = 2
        this.inDangerzone = false
        this.buttonPressed = false
    }

    setLongitude(lng){
        this.position.lng =  parseFloat(lng);
    }

    setLatitude(lat) {
        this.position.lat =  parseFloat(lat);
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
class TrackerMarker {

    constructor(id){
        this.key = id;
        this.position = {};
        this.defaultAnimation = 2
    }

    setLongitude(lng){
        this.position.lng = lng;
    }

    setLatitude(lat) {
        this.position.lat = lat;
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
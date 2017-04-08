import React from 'react';
import { appConstants } from '../../constants/appConstants.jsx'
import { GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import mqtt_regex from 'mqtt-regex';
var mqtt = require('mqtt');
const TrackerMarker = require('./TrackerMarker.jsx');

// Stylesheets
require('./map.scss');

class Map extends React.Component {

    isTrackerAlreadyAdded(key){
        for(var i = 0; i < this.state.trackers.length; i++) {
            if (this.state.trackers[i].key == key) {
                return i;
            }
        }
        return -1;
    }

    constructor(props){
        super(props);

        // mqtt
        this.connectedTrackerObserver = null;

        // for REGEX, mqtt topic, tracker id  regex
        this.trackerMqttTopic = appConstants.MQTT_TOPIC_TRACKER;
        this.trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";

        this.state = {
            trackers: []
        };

        this.mqttOptions = {
            port: appConstants.MQTT_BROKER_PORT,
            host: appConstants.MQTT_BROKER_URL,
            clientId: 'atas-webapp-' + Math.random().toString(16).substr(2, 8),
            username: appConstants.MQTT_BROKER_USER,
            password: appConstants.MQTT_BROKER_PASSWORD,
            keepalive: 60,
            reconnectPeriod: 1000,
            protocolId: 'MQIsdp',
            protocolVersion: 3,
            clean: true,
            encoding: 'utf8'
        };
    }

    componentWillUnmount() {
        this.connectedTrackerObserver.end();
    }

    componentDidMount() {
        var self = this;

        self.connectedTrackerObserver = mqtt.connect(appConstants.MQTT_BROKER_URL, self.mqttOptions);
        self.connectedTrackerObserver.on('connect', function () {
            // subscribe
            self.connectedTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/gps/latitude");
            self.connectedTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/gps/longitude");
            self.connectedTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/buttonpressed");
        })

        self.connectedTrackerObserver.on('message', function(topic, payload, packet) {

            var message_info = mqtt_regex(self.trackerIDPattern).exec;
            // get tracker id from topic parameter
            var trackerId = message_info(topic).id;

            // check if we have stored this tracker already
            var trackerObjectIndex;
            trackerObjectIndex = self.isTrackerAlreadyAdded(trackerId);

            // tracker not added yet, add it now
            if(trackerObjectIndex == -1){
                console.log(trackerObjectIndex)
                var tracker = new TrackerMarker(trackerId);
                // save the index of our new tracker
                trackerObjectIndex = self.state.trackers.push(tracker) -1 ;
            }

            switch(topic) {
                case (self.trackerMqttTopic + trackerId +  "/up/gps/longitude"):
                    var lng = parseFloat(payload.toString().replace(/['"]+/g, ''));
                    self.state.trackers[trackerObjectIndex].setLongitude(lng);
                    console.log("longitude:" + lng);
                    break;
                case (self.trackerMqttTopic + trackerId +  "/up/gps/latitude"):
                    var lat = parseFloat(payload.toString().replace(/['"]+/g, ''));
                    self.state.trackers[trackerObjectIndex].setLatitude(lat);
                    console.log("latitude:" + lat);
                    break;
                case (self.trackerMqttTopic + trackerId +  "/up/gps/buttonpressed"):
                    break;
                default:
                    break;
            }
            console.log(self.state.trackers);

            // manuall rerender
            self.setState({'trackerStateChanged': Math.random()});
        });
    }

    render(){
        console.log("render");
        return (
            <section style={{height: "100%"}}>
                <GoogleMapLoader
                    containerElement={
                        <div id="mapContainer"/>
                    }
                    googleMapElement={
                        <GoogleMap
                            defaultZoom={3}
                            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}>
                            {this.state.trackers.map((tracker) => (
                                <Marker
                                    {...tracker}
                                />
                            ))}
                        </GoogleMap>
                    }
                />
            </section>
        );
    }
}
export default Map;
import React from 'react';
import { appConstants } from '../../constants/appConstants.jsx'
import mqtt_regex from 'mqtt-regex';
var mqtt = require('mqtt');
const TrackerMarker = require('./TrackerMarker.jsx');

import AtasMap from './AtasMap.jsx';

// Stylesheets
require('./map.scss');

class MapContainer extends React.Component {
    constructor(props){
        super(props);

        // mqtt
        this.connectedTrackerObserver = null;

        // for REGEX, mqtt topic, tracker id  regex
        this.trackerMqttTopic = appConstants.MQTT_TOPIC_TRACKER;
        this.trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";

        /*this.state = {
            trackers: []
        };*/
        this.state = {
            center: { lat: -25.363882, lng: 131.044922 },
            activeTracker: null,
            trackers: [{
                position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                },
                alarm: false,
                showInfo: false,
                key: `Taiwan`,
                defaultAnimation: 2,
                getId: function(){
                    return this.key;
                }
            }, {
                position: {
                    lat: 26.0112183,
                    lng: 126.52067570000001,
                },
                alarm: true,
                showInfo: false,
                key: `Taiwan2`,
                defaultAnimation: 2,
                getId: function(){
                    return this.key;
                }
            }],
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

        this.handleMarkerClose = this.handleMarkerClose.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }

    componentDidMount() {
        var self = this;


        self.connectedTrackerObserver = mqtt.connect(appConstants.MQTT_BROKER_URL, self.mqttOptions);
        self.connectedTrackerObserver.on('connect', function () {
            // subscribe
            self.connectedTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/gps");
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
                case (self.trackerMqttTopic + trackerId +  "/up/gps"):
                    var lng = parseFloat(payload.longitude.toString().replace(/['"]+/g, ''));
                    var lat = parseFloat(payload.latitude.toString().replace(/['"]+/g, ''));
                    // set marker data
                    self.state.trackers[trackerObjectIndex].setLongitude(lng);
                    self.state.trackers[trackerObjectIndex].setLatitude(lat);
                    break;
                case (self.trackerMqttTopic + trackerId +  "/up/buttonpressed"):
                    break;
                default:
                    break;
            }
            console.log(self.state.trackers);

            // manuall rerender
            self.setState({'trackerStateChanged': Math.random()});
        });
    }

    isTrackerAlreadyAdded(key){
        for(var i = 0; i < this.state.trackers.length; i++) {
            if (this.state.trackers[i].key == key) {
                return i;
            }
        }
        return -1;
    }

    handleMarkerClose(){
        this.setState({ 'activeTracker':null});
    }

    handleMarkerClick(targetTracker){
        this.setState({ 'activeTracker':targetTracker});
    }

    componentWillUnmount() {
        this.connectedTrackerObserver.end();
    }

    render(){
        console.log("render");
        return (
            <AtasMap
                containerElement={
                    <div id="mapContainer" />
                }
                mapElement={
                    <div style={{ height: `100%` }} />
                }
                center={this.state.center}
                trackers={this.state.trackers}
                onMarkerClick={this.handleMarkerClick}
                onMarkerClose={this.handleMarkerClose}
                activeTracker={this.state.activeTracker}
            />
        );
    }
}
export default MapContainer;
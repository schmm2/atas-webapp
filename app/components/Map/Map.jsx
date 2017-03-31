import React from 'react';
import { appConstants } from '../../constants/actionConstants.jsx';
import { GoogleMapLoader, GoogleMap} from "react-google-maps";
import mqtt from 'mqtt';
import mqtt_regex from 'mqtt-regex';

// Stylesheets
require('./map.scss');

class Map extends React.Component {

    constructor(props){
        super(props);
        // mqtt
        this.connectedTrackerObserver = null;

        // for REGEX, mqtt topic, tracker id  regex
        this.trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";
        this.state = {
            trackerIds: []
        }
    }

    componentWillUnmount() {
        this.connectedTrackerObserver.end();
    }

    componentDidMount() {
        var self = this;

        self.connectedTrackerObserver = mqtt.connect(appConstants.MQTT_BROKER);
        self.connectedTrackerObserver.on('connect', function () {
            self.connectedTrackerObserver.subscribe(appConstants.MQTT_TOPIC_TRACKER + "+/state")
        })

        self.connectedTrackerObserver.on('message', function(topic, payload, packet) {
            switch(payload.toString()) {
                case "on":
                    var message_info = mqtt_regex(self.trackerIDPattern).exec;
                    // get tracker id from topic parameter
                    var trackerId = message_info(topic).id;
                    // store id
                    self.trackerIds.push(trackerId);
                    break;
                case "off":
                    var message_info = mqtt_regex(self.trackerIDPattern).exec;
                    // get topic parameter
                    var trackerId = message_info(topic).id;
                    // remove of from store
                    var index = self.trackerIds.indexOf(trackerId);
                    // found the specified train
                    if(index != -1) {
                        self.trackerIds.splice(index, 1)
                    }
                default:
            }
            // rerender
            self.setState({'trackerStateReceived': Math.random()});
        });
    }


    render(){
        return (
            <section style={{height: "100%"}}>
                <GoogleMapLoader
                    containerElement={
                        <div id="mapContainer"/>
                    }
                    googleMapElement={
                        <GoogleMap
                            defaultZoom={3}
                            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
                            >
                        </GoogleMap>
                    }
                />
            </section>
        );
    }
}
export default Map;
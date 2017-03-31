import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import mqtt from 'mqtt';
import {appConstants} from '../constants/appConstants.jsx'

class MqttDemoData {
    setTrackerData(tracker) {
        var client = mqtt.connect(appConstants.MQTT_BROKER)

        client.on('connect', function () {
            for(var i = 0; i < tracker.length; i++) {
                var rootTopic = appConstants.MQTT_BROKER + tracker[i].id;
                // Connection State
                client.publish(rootTopic + '/state', "on", {retain: true});
                // TrackerID
                client.publish(rootTopic + '/id', tracker[i].id, {retain: true});
                // GPS, Longitude
                client.publish(rootTopic + '/longitude', tracker[i].longitude, {retain: true});
                // GPS, Latitude
                client.publish(rootTopic + '/latitude', tracker[i].latitude, {retain: true});
                // Battery Level
                client.publish(rootTopic + '/battery', tracker[i].battery, {retain: true});
                // Alarm
                client.publish(rootTopic + '/alarm', tracker[i].alarm, {retain: true});
            }
        })
    }
}
export default MqttDemoData;

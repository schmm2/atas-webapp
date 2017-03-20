import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import mqtt from 'mqtt';
import {appConstants} from '../constants/appConstants.jsx'

class MqttDemoData {
    setTrainData(trains) {
        var client = mqtt.connect(appConstants.MQTT_BROKER)

        client.on('connect', function () {
            for(var i = 0; i < trains.length; i++) {
                var rootTopic = appConstants.MQTT_BROKER + "/" + trains[i].id;
                // Connection State
                client.publish(rootTopic + '/state', "on", {retain: true});
                // Name
                client.publish(rootTopic + '/name', trains[i].name, {retain: true});
                // IP
                client.publish(rootTopic + '/ip', trains[i].ip, {retain: true});
                // Light
                client.publish(rootTopic + '/light', "true", {retain: true});
                // Speed
                var speed = Math.floor((Math.random() * 100) + 1);
                client.publish(rootTopic + '/speed', speed, {retain: true});
            }
        })
    }
}
export default MqttDemoData;

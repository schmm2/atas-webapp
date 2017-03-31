import React from 'react';
import MqttDemoData from './MqttDemoData.jsx';

class StartPage extends React.Component {

    constructor(){
        super()
        var tracker = [{
            state: "on",
            id: "tracker1",
            longitude: "7.275503",
            latitude: "46.505929",
            battery: "50",
            alarm: "no",
        },{
            state: "on",
            id: "tracker2",
            longitude: "7.266883",
            latitude: "46.503109",
            battery: "50",
            alarm: "no",
        },{
            state: "on",
            id: "tracker3",
            longitude: "7.251312",
            latitude: "46.506838",
            battery: "50",
            alarm: "no",
        },{
            state: "off",
            id: "tracker4",
            longitude: "7.219609",
            latitude: "46.506289",
            battery: "50",
            alarm: "no",
        }];

        var mqttDemoData = new MqttDemoData();
        mqttDemoData.setTrackerData(tracker);
    }

    render(){
        return(
            <div className="margin">
                <h1>Startpage</h1>
                <p>DemoData sent to MQTT Broker.</p>
            </div>
        );
    }
}
export default StartPage;
import React from 'react';
import MqttDemoData from './MqttDemoData.jsx';

class StartPage extends React.Component {

    constructor(){
        super()
        var trains = [{
            id: "mark1",
            name: "MARK I",
            ip: "192.168.0.106",
        },{
            id: "mark2",
            name: "MARK II",
            ip: "192.168.0.106",
        },{
            id: "mark3",
            name: "MARK III",
            ip: "192.168.0.106",
        }];

        var mqttDemoData = new MqttDemoData();
        mqttDemoData.setTrainData(trains);
    }

    render(){
        return(
            <div>
                <h1>Startpage</h1>
                <p>DemoData sent to MQTT Broker.</p>
            </div>
        );
    }
}
export default StartPage;
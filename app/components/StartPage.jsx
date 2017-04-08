import React from 'react';

class StartPage extends React.Component {

    constructor(){
        super()
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
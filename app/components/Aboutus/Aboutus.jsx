import React from 'react';

// Stylesheets
require('./aboutus.scss');

class Aboutus extends React.Component {

    constructor(){
        super()
    }

    render(){
        return(
            <div id="aboutus-container" className="flexbox flexbox-row">
                <div id="video-container">
                    <video id="video-player" className="position-center" autoPlay loop>
                        <source src="https://player.vimeo.com/external/189545864.hd.mp4?s=d362be969621898d1303318865ab6f2b15b6edb9" type="video/mp4" />
                    </video>
                    <div id="video-foreground"></div>
                </div>
                <div id="content" className="margin">
                    <p className="title">ATAS</p>
                    <p className="subtitle">Alpinist Tracker and Alerting System</p>
                    <p className="intro"></p>
                    <p>
                        Stellen Sie sich ein kleines mobiles Gerät vor, nachfolgend Tracker genannt, welches Ski- fahrern, Wanderer usw. abgegeben werden kann. Das Gerät sendet die Position der Person an einen Empfänger, nachfolgend Gateway genannt. Der Gateway wird bei der Talstation oder im nächsten Bergdorf montiert.
                        Der Gateway sendet die empfangenen Daten der Tracker an eine zentralen Broker irgendwo im Internet. eifen.
                    </p>
                    <p>
                        Die Administratoren des Systems, beispielsweise die Rega, können schlussendlich über eine Webseite die aktuelle Position der Personen in den Bergen mitverfolgen.
                    </p>
                </div>
            </div>
        );
    }
}
export default Aboutus;
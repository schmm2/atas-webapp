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
                <div id="content">
                    <p className="title">ATAS</p>
                    <p className="subtitle">Alpinist Tracking & Alerting System</p>
                    <p className="intro"></p>
                    <p>
                        Stellen Sie sich ein kleines mobiles Gerät vor, nachfolgend Tracker genannt, welches an Skifahrern,
                        Wanderer usw. abgegeben werden kann. Das Gerät sendet die Position der Person
                        an einen Empfänger. Der Empfänger wird bei der Talstation oder im nächsten Bergdorf
                        montiert. Die Daten werden von einer Software gesammelt und analysiert. Die Administratoren
                        des Systems, beispielsweise die REGA, können in Echtzeit über eine Webseite die
                        aktuelle Position der Personen in den Bergen mitverfolgen und überwachen.
                    </p>
                    <div className="systemarchitecture"></div>
                </div>
            </div>
        );
    }
}
export default Aboutus;
import {Marker, InfoWindow} from "react-google-maps";
import React from 'react';

// Icons
import GPS from 'material-ui/svg-icons/communication/location-on'
import Action from 'material-ui/svg-icons/action/build'
var markerOk = require('./assets/markerOk.png');
var markerAlert = require('./assets/markerAlert.png');
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';

class AtasMarker extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        if(this.props.tracker.inDangerzone == true || this.props.tracker.buttonPressed == true){
            this.icon = markerAlert;
        }else{
            this.icon = markerOk;
        }
        return(
            <Marker
                position={{
                    lat: this.props.tracker.position.lat,
                    lng: this.props.tracker.position.lng
                }}
                icon = {this.icon}
                onClick={() => this.props.onMarkerClick(this.props.tracker)}
            >
            {this.props.selected && (
                <InfoWindow onCloseClick={this.props.onMarkerClose}>
                    <List>
                        <ListItem primaryText={"Tracker: "+ this.props.tracker.getId()} disabled={true}/>
                        <Divider />
                        <ListItem
                            primaryText="GPS"
                            leftIcon={<GPS/>}
                            initiallyOpen={false}
                            nestedItems={[
                                <ListItem
                                    key={1}
                                    primaryText={this.props.tracker.getLatitude()}
                                    secondaryText="Latitude"
                                    disabled={true}
                                    style={{ paddingTop: `0px`, paddingBottom: `12px`}}
                                />,
                                <ListItem
                                    key={2}
                                    primaryText={this.props.tracker.getLongitude()}
                                    secondaryText="Longitude"
                                    disabled={true}
                                    style={{ paddingTop: `0px`, paddingBottom: `12px`}}
                                />,
                            ]}/>
                        <Divider />
                        <ListItem
                            primaryText="Actions"
                            leftIcon={<Action/>}
                            initiallyOpen={false}
                            nestedItems={[
                                <ListItem>
                                    <Toggle
                                        label="Alarm"
                                        onToggle={this.props.onTriggerAlarm}
                                    />
                                </ListItem>
                            ]}/>
                    </List>
                </InfoWindow>
            )}
            </Marker>
        )
    }
}
export default AtasMarker;
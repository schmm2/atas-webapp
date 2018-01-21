import {Marker, InfoWindow} from "react-google-maps";
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Flexbox from 'react-material-flexbox'

// Icons
import GPS from 'material-ui/svg-icons/communication/location-on'
import Action from 'material-ui/svg-icons/action/build'
var markerOk = require('./assets/markerOk.png');
var markerAlert = require('./assets/markerAlert.png');

// material-ui
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class AtasMarker extends React.Component{
    constructor(props){
        super(props);

        // state
        this.state = {
            alarm : 0
        };

        //bindings
        this.onChangeAlarm= this.onChangeAlarm.bind(this);
    }

    onChangeAlarm(event, index, value){
        this.props.onTriggerAlarm(value);
        this.setState({
            'alarm': value
        });
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
                        <ListItem
                            primaryText={"Tracker: "+ this.props.tracker.getId()}
                            disabled={true}
                        />
                        <Divider />
                        <ListItem
                            primaryText="GPS"
                            leftIcon={<GPS/>}
                            initiallyOpen={false}
                            style={{
                                paddingLeft: '0px'
                            }}
                            nestedItems={[
                                <ListItem
                                    key={1}
                                    primaryText={this.props.tracker.getLatitude()}
                                    secondaryText="Latitude"
                                    disabled={true}
                                    style={{ paddingTop: `0px`, paddingBottom: `12px`, paddingLeft: '0px'}}
                                />,
                                <ListItem
                                    key={2}
                                    primaryText={this.props.tracker.getLongitude()}
                                    secondaryText="Longitude"
                                    disabled={true}
                                    style={{ paddingTop: `0px`, paddingBottom: `12px`, paddingLeft: '0px'}}
                                />,
                            ]}/>
                        <Divider />
                        <ListItem
                            primaryText="Actions"
                            leftIcon={<Action/>}
                            initiallyOpen={false}
                            nestedItems={[
                                <ListItem
                                    key={1}
                                    innerDivStyle={{ padding: '0px', margin: '0px'}}
                                    disabled={true}
                                >
                                    <SelectField
                                        className="actionDropdown"
                                        value={this.state.alarm}
                                        onChange={this.onChangeAlarm}
                                    >
                                        <MenuItem key="alarm-0" value={0} primaryText="No Alarm" />
                                        <MenuItem key="alarm-1" value={1} primaryText="Avalanche" />
                                        <MenuItem key="alarm-2" value={2} primaryText="Snowstorm" />
                                        <MenuItem key="alarm-3" value={3} primaryText="Landslide" />
                                        <MenuItem key="alarm-4" value={4} primaryText="Gap" />
                                    </SelectField>
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
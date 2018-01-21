import React from 'react';
import { connect } from 'react-redux';
import { appConstants } from '../../constants/appConstants.jsx'
import { getDangerzones } from '../../actions/getDangerzones.jsx';
import { postDangerzone } from '../../actions/postDangerzone.jsx';
import { deleteDangerzone } from '../../actions/deleteDangerzone.jsx';

import mqtt_regex from 'mqtt-regex';
var mqtt = require('mqtt');
const Tracker = require('./Tracker.jsx');
import FloatingActionButton from 'material-ui/FloatingActionButton';

// Icons
import ContentAdd from 'material-ui/svg-icons/content/add';
import Check from 'material-ui/svg-icons/navigation/check';
import Warning from 'material-ui/svg-icons/alert/warning';
import Delete from 'material-ui/svg-icons/action/delete'


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';

import Badge from 'material-ui/Badge';

import {List, ListItem} from 'material-ui/List';

import {red600} from 'material-ui/styles/colors';
import AtasGoogleMap from './AtasGoogleMap.jsx';

// Stylesheets
require('./map.scss');

class Map extends React.Component {
    isValidLat(lat){
        if(lat <= 90 && lat >= -90){
            return true;
        }
        return false;
    }

    isValidLng(lng) {
        if (lng <= 180 && lng >= -180) {
            return true;
        }
        return false;
    }

    constructor(props){
        super(props);

        this.searchBox = null;

        // mqtt connection
        this.mqttTrackerObserver = null;

        // for REGEX, mqtt topic, tracker id  regex
        this.trackerMqttTopic = appConstants.MQTT_TOPIC_TRACKER;
        this.trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";

        this.state = {
            drawingMode: false,
            editDangerzoneMode: false,
            center: { lat: 0, lng: 0 },
            activeTracker: null,
            activeDangerzone: null,
            searchMarkers: [],
            alertsViewOpen: false,
            zoom: 3,
            trackers: [{
                position: {
                    lat: 46.382428,
                    lng: 7.468159,
                },
                alarm: false,
                showInfo: false,
                render: true,
                key: `atas-node45`,
                defaultAnimation: 2,
                buttonPressed: false,
                inDangerzone: true,
                getId: function(){
                    return this.key;
                },
                getLongitude: function(){
                    return this.position.lng;
                },
                getLatitude: function(){
                    return this.position.lat;
                }
            }]
        };

        this.mqttOptions = {
            port: appConstants.MQTT_BROKER_PORT,
            host: appConstants.MQTT_BROKER_URL,
            clientId: appConstants.NAME + Math.random().toString(16).substr(2, 8),
            username: appConstants.MQTT_BROKER_USER,
            password: appConstants.MQTT_BROKER_PASSWORD,
            keepalive: 60,
            reconnectPeriod: 2000,
            protocolId: 'MQIsdp',
            protocolVersion: 3,
            clean: true,
            encoding: 'utf8'
        };

        this.handleMarkerClose = this.handleMarkerClose.bind(this);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
        this.triggerAlarm = this.triggerAlarm.bind(this);
        this.toggleDrawingMode = this.toggleDrawingMode.bind(this);

        this.storeDangerzone = this.storeDangerzone.bind(this);
        this.selectDangerzoneCallback = this.selectDangerzoneCallback.bind(this);
        this.handleDeleteDangerzone= this.handleDeleteDangerzone.bind(this);

        this.handleMapClickCallback = this.handleMapClickCallback.bind(this);

        this.onPlacesChangedCallback =  this.onPlacesChangedCallback.bind(this);
        this.handleSearchBoxMountedCallback =  this.handleSearchBoxMountedCallback.bind(this);

        this.toggleAlertsView =  this.toggleAlertsView.bind(this);

        this.zoomInOnMarker = this.zoomInOnMarker.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getDangerzones());

        var self = this;

        // ***** MQTT *****
        self.mqttTrackerObserver = mqtt.connect(appConstants.MQTT_BROKER_URL, self.mqttOptions);
        self.mqttTrackerObserver.on('connect', function () {
            // subscribe
            self.mqttTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/gps");
            self.mqttTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/buttonpressed");
            self.mqttTrackerObserver.subscribe(self.trackerMqttTopic + "+/up/indangerzone");
        })

        self.mqttTrackerObserver.on('message', function(topic, payload, packet) {
            var message_info = mqtt_regex(self.trackerIDPattern).exec;
            // get tracker id from topic parameter
            var trackerId = message_info(topic).id;

            console.log("TrackerID: " +trackerId);
            console.log("Topic: " +topic);

            // check if we have stored this tracker already
            var trackerObjectIndex;
            trackerObjectIndex = self.isTrackerAlreadyAdded(trackerId);

            // tracker not added yet, add it now
            if(trackerObjectIndex == -1){
                var tracker = new Tracker(trackerId);
                // save the index of our new tracker
                trackerObjectIndex = self.state.trackers.push(tracker) -1 ;
            }

            switch(topic) {
                case (self.trackerMqttTopic + trackerId +  "/up/gps"):
                    var gpsObject = JSON.parse(payload.toString());
                    console.log("gpsObject: "+ JSON.stringify(gpsObject));

                    if(self.isValidLat(gpsObject.lat) && self.isValidLng(gpsObject.lng)){
                        // set marker data
                        console.log("new GPS Data");
                        self.state.trackers[trackerObjectIndex].render = true;
                        self.state.trackers[trackerObjectIndex].setGPS(gpsObject);
                        break;
                    } else {
                        self.state.trackers[trackerObjectIndex].render = false;
                        break;
                    }
                    break;
                case (self.trackerMqttTopic + trackerId +  "/up/buttonpressed"):
                    var buttonPressed = JSON.parse(payload.toString());
                    self.state.trackers[trackerObjectIndex].setButtonPressed(buttonPressed);
                    break;
                case (self.trackerMqttTopic + trackerId +  "/up/indangerzone"):
                    var inDangerzone = JSON.parse(payload.toString());
                    self.state.trackers[trackerObjectIndex].setInDangerzone(inDangerzone);
                    break;
                default:
                    break;
            }
            // manual render
            console.log(self.state.trackers);
            self.setState({'trackerStateChanged': Math.random()});
        });
    }

    isTrackerAlreadyAdded(key){
        for(var i = 0; i < this.state.trackers.length; i++) {
            if (this.state.trackers[i].key == key) {
                return i;
            }
        }
        return -1;
    }

    handleMapClickCallback(){
        if(this.state.editDangerzoneMode){
            this.setState({'editDangerzoneMode': false});
        }
        // close marker
        this.handleMarkerClose();
    }

    selectDangerzoneCallback(targetDangerzone){
        this.setState({'activeDangerzone':targetDangerzone});

        if(!this.state.editDangerzoneMode){
            this.setState({'editDangerzoneMode': true});
        }
    }

    handleDeleteDangerzone(){
        this.props.dispatch(deleteDangerzone(this.state.activeDangerzone._id));
        this.setState({'editDangerzoneMode': false});
    }

    storeDangerzone(polygonObj){
        console.log("store dangerzone: ");
        var pointArray=[];
        polygonObj.getPath().forEach(function(latlng){
            var points = {
                lat: latlng.lat(),
                lng: latlng.lng()
            };
            pointArray.push(points);
        });
        this.props.dispatch(postDangerzone(pointArray));
    }

    toggleDrawingMode(){
        this.setState({'drawingMode': !this.state.drawingMode})
    }

    handleMarkerClose(){
        this.setState({ 'activeTracker':null});
    }

    handleMarkerClick(targetTracker){
        this.setState({ 'activeTracker':targetTracker});
    }

    triggerAlarm(event, isInputChecked){
        var alarmTopic = this.trackerMqttTopic + this.state.activeTracker.getId() + "/down";
        var bool;

        if(isInputChecked == true){ bool = "true";}
        else{ bool = "false";}

        var message = '{"port":1,"payload_fields":{"alarm":'+ bool +'}}'
        this.mqttTrackerObserver.publish(alarmTopic, message);
    }

    componentWillUnmount() {
        this.mqttTrackerObserver.end();
    }

    handleSearchBoxMountedCallback(searchBox){
        this.searchBox = searchBox;
    }

    onPlacesChangedCallback(){
        const places = this.searchBox.getPlaces();

        // Add a marker for each place returned from search bar
        const searchMarkers = places.map(place => ({
            position: place.geometry.location,
        }));

        // Set markers; set map center to first search result
        const mapCenter =searchMarkers.length > 0 ?searchMarkers[0].position : this.state.center;

        this.setState({
            center: mapCenter,
            searchMarkers
        });
    }

    toggleAlertsView(){
        this.setState({
            'alertsViewOpen': !this.state.alertsViewOpen
        });
    }

    toggleHistoryView(){
        this.setState({
            'historyViewOpen': !this.state.alertsViewOpen
        });
    }


    zoomInOnMarker(marker){
        this.toggleAlertsView();
        this.setState({
            center: { lat: marker.position.lat, lng: marker.position.lng },
            zoom: 11
        })
    }

    render(){
        console.log("map render");
        return (
            <div id="map">
                <AtasGoogleMap
                    containerElement={
                        <div id="google-map" />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                    center={this.state.center}
                    trackers={this.state.trackers}
                    searchMarkers={this.state.searchMarkers}
                    drawingMode={this.state.drawingMode}
                    editDangerzoneMode={this.state.editDangerzoneMode}
                    dangerzones={this.props.dangerzones}
                    onMarkerClick={this.handleMarkerClick}
                    onMarkerClose={this.handleMarkerClose}
                    mapClickCallback={this.handleMapClickCallback}
                    onTriggerAlarm={this.triggerAlarm}
                    activeTracker={this.state.activeTracker}
                    activeDangerzone={this.state.activeDangerzone}
                    storeDangerzoneCallback={this.storeDangerzone}
                    selectDangerzoneCallback={this.selectDangerzoneCallback}
                    onPlacesChangedCallback={this.onPlacesChangedCallback}
                    handleSearchBoxMountedCallback={this.handleSearchBoxMountedCallback}
                    zoom={this.state.zoom}
                />
                <div id="button-add">
                    {
                        !this.state.editDangerzoneMode &&
                        <FloatingActionButton
                            onTouchTap={this.toggleDrawingMode}>
                            {
                                !this.state.drawingMode &&
                                <ContentAdd />
                            }
                            {
                                this.state.drawingMode &&
                                <Check/>
                            }
                        </FloatingActionButton>
                    }
                    {
                        this.state.editDangerzoneMode &&
                        <FloatingActionButton
                            backgroundColor={red600}
                            onTouchTap={this.handleDeleteDangerzone}
                        >
                            <Delete/>
                        </FloatingActionButton>
                    }
                </div>
                <div id="button-alerts">
                    <Badge
                        badgeContent={this.state.trackers.filter(tracker => tracker.inDangerzone == true || tracker.buttonPressed == true).length}
                        badgeStyle={{
                            top: 15,
                            right: 15,
                            zIndex: 3
                        }}
                        style={{
                            paddingLeft: 0
                        }}
                    >
                        <FloatingActionButton
                            onTouchTap={this.toggleAlertsView}
                            backgroundColor={red600}>
                            <Warning/>
                        </FloatingActionButton>
                    </Badge>
                </div>
                <Dialog
                    title="Alerts"
                    actions={
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onTouchTap={this.toggleAlertsView}
                        />
                    }
                    modal={false}
                    open={this.state.alertsViewOpen}
                    onRequestClose={this.toggleAlertsView}
                    autoScrollBodyContent={true}
                >
                    {
                        this.state.trackers.filter(tracker => tracker.inDangerzone == true).length > 0 &&
                        <div>
                            <Subheader>In Dangerzone</Subheader>
                                <List>
                                    {this.state.trackers
                                        .filter(tracker => tracker.inDangerzone == true)
                                        .map((tracker) => (
                                        <ListItem
                                            key={tracker.key}
                                            onClick={() => this.zoomInOnMarker(tracker)}
                                            disabled={!tracker.render}
                                        >
                                            {tracker.key}
                                            {!tracker.render &&
                                                <span className="nogpsdata">No GPS Data</span>
                                            }
                                        </ListItem>
                                    ))}
                                </List>
                        </div>
                    }
                    {
                        this.state.trackers.filter(tracker => tracker.buttonPressed == true).length > 0 &&
                        <div>
                            <Subheader>Alert triggered</Subheader>
                            <List>
                                {this.state.trackers
                                    .filter(tracker => tracker.buttonPressed == true)
                                    .map((tracker) => (
                                        <ListItem
                                            key={tracker.key}
                                            onClick={() => this.zoomInOnMarker(tracker)}
                                            disabled={!tracker.render}
                                        >
                                            {tracker.key}
                                            {!tracker.render &&
                                                <span className="nogpsdata">No GPS Data</span>
                                            }
                                        </ListItem>
                                    ))}
                            </List>
                        </div>
                    }
                    {
                        this.state.trackers.filter(tracker => tracker.buttonPressed == true).length == 0 &&
                        this.state.trackers.filter(tracker => tracker.inDangerzone == true).length == 0 &&
                        <p>There are no alerts</p>
                    }
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{ dangerzones: state.dangerzones };
}

export default connect(mapStateToProps)(Map);
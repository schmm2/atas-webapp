import React from 'react';
import { connect } from 'react-redux';
import { appConstants } from '../../constants/appConstants.jsx'
import { getDangerzones } from '../../actions/getDangerzones.jsx';
import { postDangerzone } from '../../actions/postDangerzone.jsx';
import { deleteDangerzone } from '../../actions/deleteDangerzone.jsx';

import mqtt_regex from 'mqtt-regex';
var mqtt = require('mqtt');
const TrackerMarker = require('./TrackerMarker.jsx');
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Check from 'material-ui/svg-icons/navigation/check';
import Delete from 'material-ui/svg-icons/action/delete'

import {red600} from 'material-ui/styles/colors';
import AtasGoogleMap from './AtasGoogleMap.jsx';

// Stylesheets
require('./map.scss');

class Map extends React.Component {
    constructor(props){
        super(props);

        this.searchBox = null;

        // mqtt connection
        this.mqttTrackerObserver = null;

        // for REGEX, mqtt topic, tracker id  regex
        this.trackerMqttTopic = appConstants.MQTT_TOPIC_TRACKER;
        this.trackerIDPattern = appConstants.MQTT_TOPIC_TRACKER + "+id/#path";

        /*this.state = {
            trackers: []
        };*/
        this.state = {
            drawingMode: false,
            editDangerzoneMode: false,
            center: { lat: 0, lng: 0 },
            activeTracker: null,
            activeDangerzone: null,
            searchMarkers: [],

            trackers: [{
                position: {
                    lat: 25.0112183,
                    lng: 121.52067570000001,
                },
                alarm: false,
                showInfo: false,
                key: `atas-node45`,
                defaultAnimation: 2,
                getId: function(){
                    return this.key;
                }
            }, {
                position: {
                    lat: 26.0112183,
                    lng: 126.52067570000001,
                },
                alarm: true,
                showInfo: false,
                key: `Taiwan2`,
                defaultAnimation: 2,
                getId: function(){
                    return this.key;
                }
            }],
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
        })

        self.mqttTrackerObserver.on('message', function(topic, payload, packet) {
            var message_info = mqtt_regex(self.trackerIDPattern).exec;
            // get tracker id from topic parameter
            var trackerId = message_info(topic).id;

            // check if we have stored this tracker already
            var trackerObjectIndex;
            trackerObjectIndex = self.isTrackerAlreadyAdded(trackerId);

            // tracker not added yet, add it now
            if(trackerObjectIndex == -1){
                var tracker = new TrackerMarker(trackerId);
                // save the index of our new tracker
                trackerObjectIndex = self.state.trackers.push(tracker) -1 ;
            }

            switch(topic) {
                case (self.trackerMqttTopic + trackerId +  "/up/gps"):
                    var gpsObject = JSON.parse(payload.toString());

                    var lng = parseFloat(gpsObject.lng);
                    var lat = parseFloat(gpsObject.lat);
                    // set marker data
                    self.state.trackers[trackerObjectIndex].setLongitude(lng);
                    self.state.trackers[trackerObjectIndex].setLatitude(lat);
                    break;
                case (self.trackerMqttTopic + trackerId +  "/up/buttonpressed"):
                    break;
                default:
                    break;
            }
            // manuall rerender
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
        console.log(isInputChecked);
        var alarmTopic = this.trackerMqttTopic + this.state.activeTracker.getId() + "/down";
        var bool;
        if(isInputChecked == true){
            bool = "true";
        }else{
            bool = "false";
        }
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

    render(){
        console.log("render");
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
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{ dangerzones: state.dangerzones };
}

export default connect(mapStateToProps)(Map);
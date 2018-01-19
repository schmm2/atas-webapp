import React from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow, Polygon} from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Toggle from 'material-ui/Toggle';
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

// Icons
import GPS from 'material-ui/svg-icons/communication/location-on'
import Action from 'material-ui/svg-icons/action/build'

var markerOk = require('./assets/markerOk.png');
var markerInfo = require('./assets/markerInfo.png');
var markerAlert = require('./assets/markerAlert.png');


const AtasGoogleMap = withGoogleMap(props => (
    <GoogleMap
	options={{ 
		fullscreenControl: false,
		streetViewControl: false 
	}}
	fullscreenControl
        defaultZoom={props.zoom}
        center={props.center}
        zoom={props.zoom}
        onClick={props.mapClickCallback}
        >

        <SearchBox
            controlPosition={google.maps.ControlPosition.TOP_RIGHT}
            onPlacesChanged={props.onPlacesChangedCallback}
            ref={props.handleSearchBoxMountedCallback}
            inputPlaceholder="Search..."
            inputStyle={{
                    boxSizing: `border-box`,
                    MozBoxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `20vmax`,
                    height: `35px`,
                    marginTop: `40px`,
                    marginRight: `40px`,
                    padding: `0 12px`,
                    borderRadius: `1px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                }}
        />

        {
            props.drawingMode == true &&
            <DrawingManager
                onPolygonComplete={props.storeDangerzoneCallback}
                drawingMode={google.maps.drawing.OverlayType.POLYGON}

                options={{
                    drawingControl: false,
                    // doesn't show polygon
                    polygonOptions: {
                        fillColor: `#FF0000`,
                        fillOpacity: 0.4,
                        strokeWeight: 1,
                        clickable: false,
                        editable: false,
                        zIndex: 1,
                    }
                }}
            />
        }

        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={60}
            styles={[
                {
                    url: 'assets/markercluster/icon.png',
                    textColor: '#ffffff',
                    textSize: 10,
                    height: 40,
                    width: 40
                }
            ]}
        >
        {props.dangerzones.map((dangerzone) => (
            <Polygon
                onClick={() => props.selectDangerzoneCallback(dangerzone)}
                paths={dangerzone.points}
                key={dangerzone._id}
                editable={dangerzone === props.activeDangerzone && props.editDangerzoneMode}
                options={{
                    fillColor: "#FF0000",
                    fillOpacity: 0.4,
                    strokeWeight: 1,
                    clickable: true,
                    zIndex: 100
                }}
            />
        ))}

        {props.searchMarkers.map((searchMarker) => (
            <Marker
                {...searchMarker}
                icon={markerInfo}>
            </Marker>
        ))}

        {props.trackers.filter(tracker => tracker.render).map((tracker) => (
            <Marker
                {...tracker}
                onClick={() => props.onMarkerClick(tracker)}
                icon={markerOk}
            >
                {tracker === props.activeTracker && (
                    <InfoWindow onCloseClick={props.onMarkerClose}>
                        <List>
                            <ListItem primaryText={"Node-ID: "+ tracker.getId()} disabled={true}/>
                            <Divider />
                            <ListItem
                                primaryText="GPS"
                                leftIcon={<GPS/>}
                                initiallyOpen={false}
                                nestedItems={[
                                    <ListItem
                                        key={1}
                                        primaryText={tracker.getLatitude()}
                                        secondaryText="Latitude"
                                        disabled={true}
                                        style={{ paddingTop: `0px`, paddingBottom: `12px`}}
                                    />,
                                    <ListItem
                                        key={2}
                                        primaryText={tracker.getLongitude()}
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
                                            onToggle={props.onTriggerAlarm}
                                        />
                                    </ListItem>
                                ]}/>
                        </List>

                    </InfoWindow>
                )}
            </Marker>
        ))}
        </MarkerClusterer>
    </GoogleMap>
));
export default AtasGoogleMap;

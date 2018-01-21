import React from 'react';
import AtasMarker from "./AtasMarker.jsx";
import {withGoogleMap, GoogleMap, Marker, Polygon} from "react-google-maps";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

var markerInfo = require('./assets/markerInfo.png');


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
        >
            <input
                type="text"
                placeholder="Search..."
                style={{
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
        </SearchBox>

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
        /* Render Tracker */
        {props.trackers.filter(tracker => tracker.render).map((tracker) => (
            <AtasMarker
                key={"marker-"+tracker.key}
                selected={tracker == props.activeTracker}
                tracker={tracker}
                onMarkerClick={props.onMarkerClick}
                onMarkerClose={props.onMarkerClose}
                onTriggerAlarm={props.onTriggerAlarm}
            />
        ))}
        </MarkerClusterer>
    </GoogleMap>
));
export default AtasGoogleMap;

import React from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow, Polygon} from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Toggle from 'material-ui/Toggle';
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";

var markerOk = require('./assets/markerOk.png');
var markerInfo = require('./assets/markerInfo.png');
var markerAlert = require('./assets/markerAlert.png');

const SEARCH_STYLE = {
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
};

const AtasGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={3}
        center={props.center}
        onClick={props.mapClickCallback}
        >

        <SearchBox
            controlPosition={google.maps.ControlPosition.TOP_RIGHT}
            onPlacesChanged={props.onPlacesChangedCallback}
            ref={props.handleSearchBoxMountedCallback}
            inputPlaceholder="Search..."
            inputStyle={SEARCH_STYLE}
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
            imageSizes={[40, 40]}
            imagePath={'assets/markercluster/'}
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

        {props.trackers.map((tracker) => (
            <Marker
                {...tracker}
                onClick={() => props.onMarkerClick(tracker)}
                icon={markerOk}
            >
                {tracker === props.activeTracker && (
                    <InfoWindow onCloseClick={props.onMarkerClose}>
                        <div>
                            <h2>{tracker.getId()}</h2>
                            <Toggle
                                label="Alarm"
                                onToggle={props.onTriggerAlarm}
                            />
                        </div>
                    </InfoWindow>
                )}
            </Marker>
        ))}
        </MarkerClusterer>
    </GoogleMap>
));
export default AtasGoogleMap;
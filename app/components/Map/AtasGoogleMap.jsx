import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow, Polygon} from "react-google-maps";
import Toggle from 'material-ui/Toggle';
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";
import {red600} from 'material-ui/styles/colors';

const AtasGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={3}
        center={props.center}
        onClick={props.mapClickCallback}
        >
        {
            props.drawingMode == true &&
            <DrawingManager
                onPolygonComplete={props.storeDangerzoneCallback}
                drawingMode={google.maps.drawing.OverlayType.POLYGON}

                options={{
                    drawingControl: false,
                    polygonOptions: {
                        fillColor: `#FF0000`,
                        fillOpacity: 0.4,
                        strokeWeight: 1,
                        clickable: true,
                        editable: false,
                        zIndex: 1,
                    },
                }}
            />
        }

        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={60}
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
                }}
            />
        ))}

        {props.trackers.map((tracker) => (
            <Marker
                {...tracker}
                onClick={() => props.onMarkerClick(tracker)}>
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
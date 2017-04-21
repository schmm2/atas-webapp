import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import Toggle from 'material-ui/Toggle';

const AtasMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={3}
        center={props.center}>
        {props.trackers.map((tracker) => (
            <Marker
                {...tracker}
                onClick={() => props.onMarkerClick(tracker)}>
                {tracker === props.activeTracker && (
                        <InfoWindow onCloseClick={() => props.onMarkerClose()}>
                            <div>
                                <Toggle
                                    label="Alarm"
                                />
                            </div>
                        </InfoWindow>
                )}
            </Marker>
        ))}
    </GoogleMap>
));
export default AtasMap;
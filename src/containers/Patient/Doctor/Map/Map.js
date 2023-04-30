import React from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs, Polyline } from 'react-google-maps';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: { lat: 0, lng: 0 },
            zoom: 14,
            currentPosition: null,
            doctorPosition: { lat: 16.0602535, lng: 108.1823864 }
        };

        this.handlePosition = this.handlePosition.bind(this);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.handlePosition);
        }
    }

    handlePosition(position) {
        const { latitude, longitude } = position.coords;

        this.setState({
            center: { lat: latitude, lng: longitude },
            zoom: 14,
            currentPosition: { lat: latitude, lng: longitude },
        });
    }

    render() {
        const { center, zoom, currentPosition, doctorPosition } = this.state;

        const MapWithMarker = withScriptjs(
            withGoogleMap(() => (
                <GoogleMap
                    defaultCenter={center}
                    defaultZoom={zoom}
                    center={center}
                    zoom={zoom}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                    }}
                >
                    {currentPosition && <Marker position={currentPosition} />}
                    {doctorPosition && <Marker position={doctorPosition} />}
                    {currentPosition && doctorPosition && (
                        <Polyline
                            path={[currentPosition, doctorPosition]}
                            options={{ strokeColor: '#FF0000' }}
                        />
                    )}
                </GoogleMap>
            )),
        );

        return (
            <MapWithMarker
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${"AIzaSyDhVMBWNVrRo5TgKiNB7ArkarWmcl7tKyQ"}`}
                loadingElement={<div style={{ height: '100%' }} />}
                containerElement={<div style={{ height: '300px', width: '400px', marginLeft: '400px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
            />
        );
    }
}

export default Map;

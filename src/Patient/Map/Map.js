import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import { getLatLng, geocodeByAddress } from "react-google-places-autocomplete";
// import haversine from 'haversine-distance';
import { FaDirections } from "react-icons/fa";
import "./Map.scss";

function Map(props) {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(16);

  const [doctorPosition, setDoctorPosition] = useState({ lat: 0, lng: 0 });

  const [map, setMap] = useState(null);

  useEffect(() => {
    const { address } = props;
    console.log("address", props);
    const getCoords = async () => {
      try {
        const results = await geocodeByAddress(props.address);
        const latLng = await getLatLng(results[0]);
        console.log("toa do: ", latLng);
        setDoctorPosition({ lat: latLng.lat, lng: latLng.lng });
      } catch (error) {
        console.log("Error getting coordinates", error);
      }
    };
    if (address) {
      if (window.google && window.google.maps) {
        getCoords();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyBJs-bpgSJv89Ux2TreGrl1EJP6wmhzeY4"}&libraries=places`;
        script.onload = () => {
          getCoords();
        };
        document.head.appendChild(script);
      }
    }
  }, [props.address]);

  const handleMapLoad = (map) => {
    setMap(map);
  };

  const MapWithMarker = withScriptjs(
    withGoogleMap(() => (
      <GoogleMap
        center={doctorPosition}
        zoom={zoom}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
        onLoad={handleMapLoad}
      >
        {doctorPosition && <Marker position={doctorPosition} />}
      </GoogleMap>
    )),
  );

  return (
    <div className="map">
      <div className="address">
        {props.address}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${props.address}`}
          target="_blank"
          style={{
            textDecoration: "none",
            cursor: "pointer",
            color: "black",
            marginLeft: "5px",
          }}
        >
          {" "}
          <FaDirections size={25} color="red" />{" "}
        </a>
      </div>
      <MapWithMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${"AIzaSyBJs-bpgSJv89Ux2TreGrl1EJP6wmhzeY4"}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "300px", width: "400px" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
    </div>
  );
}

export default Map;

// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   Marker,
//   withGoogleMap,
//   withScriptjs,
// } from "react-google-maps";
// import { getLatLng, geocodeByAddress } from "react-google-places-autocomplete";

// function Map(props) {
//   const [center, setCenter] = useState({ lat: 0, lng: 0 });
//   const [zoom, setZoom] = useState(16);

//   const [doctorPosition, setDoctorPosition] = useState({ lat: 0, lng: 0 });
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     const { address } = props;
//     console.log("address", props);
//     const getCoords = async () => {
//       try {
//         const results = await geocodeByAddress(props.address);
//         const latLng = await getLatLng(results[0]);
//         console.log("toa do: ", latLng);
//         setDoctorPosition({ lat: latLng.lat, lng: latLng.lng });
//       } catch (error) {
//         console.log("Error getting coordinates", error);
//       }
//     };
//     if (address) {
//       if (window.google && window.google.maps) {
//         getCoords();
//       } else {
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyDsMr6BWfwUsJNCjO-jfwDiVNhbOLBmlE8"}&libraries=places`;
//         script.onload = () => {
//           getCoords();
//         };
//         document.head.appendChild(script);
//       }
//     }
//   }, [props.address]);

//   const handleMapLoad = (map) => {
//     setMap(map);
//   };

//   const MapWithMarker = withScriptjs(
//     withGoogleMap(() => (
//       <GoogleMap
//         center={doctorPosition}
//         zoom={zoom}
//         options={{
//           zoomControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: true,
//         }}
//         onLoad={handleMapLoad}
//       >
//         {doctorPosition && <Marker position={doctorPosition} />}
//       </GoogleMap>
//     )),
//   );

//   return (
//     <MapWithMarker
//       googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${"AIzaSyDsMr6BWfwUsJNCjO-jfwDiVNhbOLBmlE8"}`}
//       loadingElement={<div style={{ height: "100%" }} />}
//       containerElement={<div style={{ height: "300px", width: "319px" }} />}
//       mapElement={<div style={{ height: "100%" }} />}
//     />
//   );
// }

// export default Map;
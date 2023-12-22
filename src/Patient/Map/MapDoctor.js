import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  DirectionsRenderer,
} from "react-google-maps";

import { getLatLng, geocodeByAddress } from "react-google-places-autocomplete";
import haversine from "haversine-distance";
import "./MapForDoctor.scss";
import "dotenv";

function MapDoctor(props) {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(13);
  const [doctorPosition, setDoctorPosition] = useState({ lat: 0, lng: 0 });
  const [patientPositions, setPatientPositions] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [directions, setDirections] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);

  const [patientCoords, setPatientCoords] = useState([]);

  useEffect(() => {
    const { address } = props;
    console.log("check address doctor", address);
    const getCoords = async () => {
      try {
        const results = await geocodeByAddress(props.address);
        const latLng = await getLatLng(results[0]);
        console.log(latLng);
        setDoctorPosition({ lat: latLng.lat, lng: latLng.lng });
      } catch (error) {
        console.log("Error getting coordinates", error);
      }
    };
    if (address) {
      if (window.google && window.google.maps) {
        setMapsLoaded(true);
        getCoords();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyB9B_9WP2V8ovuyRUyCIwYKVoB0MC6MURM"}&libraries=places`;
        script.onload = () => {
          setMapsLoaded(true);
          getCoords();
        };
        document.head.appendChild(script);
      }
    }
  }, [props.address]);

  useEffect(() => {
    const storedDoctorPosition = localStorage.getItem("doctorPosition");
    if (storedDoctorPosition) {
      setDoctorPosition(JSON.parse(storedDoctorPosition));
    }
  }, []);

  useEffect(() => {
    if (doctorPosition) {
      localStorage.setItem("doctorPosition", JSON.stringify(doctorPosition));
    }
  }, [doctorPosition]);

  useEffect(() => {
    const storedPatientCoords = localStorage.getItem("patientCoords");
    if (storedPatientCoords) {
      setPatientCoords(JSON.parse(storedPatientCoords));
    }
  }, []);

  useEffect(() => {
    if (patientCoords.length > 0) {
      localStorage.setItem("patientCoords", JSON.stringify(patientCoords));
    }
  }, [patientCoords]);

  useEffect(() => {
    setCenter(doctorPosition);
    console.log(center);
    const { arrayPatientS3 } = props;
    console.log("check arrayPatient", arrayPatientS3);

    try {
      const getPatientCoordinates = async () => {
        if (window.google && window.google.maps) {
          // Kiểm tra nếu thư viện đã sẵn sàng
          const coordinates = await Promise.all(
            arrayPatientS3.map(async (item) => {
              const results = await geocodeByAddress(item.address);
              const latLng = await getLatLng(results[0]);
              console.log("hdjahsdj", latLng);
              return latLng;
            }),
          );
          setPatientCoords(coordinates);

          // const addresses = await Promise.all(
          //   arrayPatientS3.map(async (item) => {
          //     const results = await geocodeByAddress(item.address);
          //     return results[0].formatted_address;
          //   }),
          // );
          // setPatientAddresses(addresses);
        } else {
          console.log("Google Maps library not available yet.");
        }
      };

      if (arrayPatientS3.length > 0) {
        getPatientCoordinates();
      }
    } catch (error) {
      console.log("Error getting coordinates", error);
    }
  }, [doctorPosition, props.address, props.arrayPatientS3]);

  useEffect(() => {
    if (patientCoords.length > 0) {
      const calculateNearestNeighbor = (start, positions) => {
        const unvisitedPositions = [...positions];
        const path = [start];

        while (unvisitedPositions.length > 0) {
          let nearestPosition = unvisitedPositions[0];
          let nearestDistance = haversine(start, nearestPosition);

          for (let i = 1; i < unvisitedPositions.length; i++) {
            const currentDistance = haversine(start, unvisitedPositions[i]);
            if (currentDistance < nearestDistance) {
              nearestPosition = unvisitedPositions[i];
              nearestDistance = currentDistance;
            }
          }

          path.push(nearestPosition);
          unvisitedPositions.splice(
            unvisitedPositions.indexOf(nearestPosition),
            1,
          );
          start = nearestPosition;
        }

        return path;
      };

      const sortedPatients = calculateNearestNeighbor(
        doctorPosition,
        patientCoords,
      );
      setPatientPositions(sortedPatients);
    }
  }, [doctorPosition, patientCoords]);

  useEffect(() => {
    if (
      mapsLoaded &&
      doctorPosition &&
      patientPositions.length > 0 &&
      window.google &&
      window.google.maps &&
      props.arrayPatientS3.length > 0
    ) {
      const calculateDirections = async () => {
        const directionsService = new window.google.maps.DirectionsService();
        const waypoints = patientPositions.map((position) => ({
          location: position,
        }));

        const request = {
          origin: doctorPosition,
          destination: patientPositions[patientPositions.length - 1],
          waypoints: waypoints.slice(1, -1),
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        });
      };
      calculateDirections();
    } else {
      setDirections(null);
    }
  }, [mapsLoaded, doctorPosition, patientPositions, props.arrayPatientS3]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleMapLoad = (map) => {
    setMap(map);
  };
  const renderPatientInfo = () => {
    if (props.arrayPatientS3.length === 0) {
      return <div style={{ color: "red" }}>Hôm nay không có lịch hẹn</div>;
    } else {
      return patientPositions.slice(1, 10000).map((patient, index) => {
        const distance = (haversine(doctorPosition, patient) / 1000) * 1.4;
        const speed = 40;
        const time = (distance / speed) * 60;
        const patientName = String.fromCharCode(66 + index);

        return (
          <div style={{ borderBottom: "1px solid black" }}>
            <div>
              Khoảng cách đến{" "}
              <span
                style={{ color: "red", fontWeight: "bold" }}
              >{`${patientName}`}</span>
              : {`${distance.toFixed(2)}`} km
            </div>
            <div>Thời gian: {`${time.toFixed(1)}`} phút</div>
          </div>
        );
      });
    }
  };

  const MapWithMarker = withScriptjs(
    withGoogleMap(() => (
      <GoogleMap
        center={center}
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

        {/* {props.arrayPatientS3.length > 0 &&
          patientPositions.map((patient, index) => (
            <Marker key={index} position={patient} />
          ))} */}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#385897",
                strokeWeight: 6,
              },
            }}
          />
        )}
      </GoogleMap>
    )),
  );
  return (
    <div className="center container-fluid">
      <div className="map col-12 ">
        <MapWithMarker
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${"AIzaSyB9B_9WP2V8ovuyRUyCIwYKVoB0MC6MURM"}`}
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={
            <div
              style={{
                height: "100%",
                width: "606px",
                margin: "0",
                padding: "0",
              }}
            />
          }
          mapElement={<div style={{ height: "100%" }} />}
        />
        <div className="toggle-info" onClick={toggleInfo}>
          <i class="fa-solid fa-car"></i>
        </div>
        {showInfo && <div className="info">{renderPatientInfo()}</div>}
      </div>
    </div>
  );
}

export default MapDoctor;

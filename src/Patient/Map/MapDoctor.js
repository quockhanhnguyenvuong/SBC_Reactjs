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

function MapDoctor(props) {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(13);
  const [doctorPosition, setDoctorPosition] = useState({ lat: 0, lng: 0 });
  const [patientPositions, setPatientPositions] = useState([]);
  const [patientAddresses, setPatientAddresses] = useState([]);
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyB0M2HOZPKdY7BiMvXdMJrv_d6yr-cdNio"}&libraries=places`;
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
    const { arrayPatient } = props;
    // console.log("check arrayPatient", arrayPatient);

    try {
      const getPatientCoordinates = async () => {
        const coordinates = await Promise.all(
          arrayPatient.map(async (item) => {
            const results = await geocodeByAddress(item.patientData.address);
            const latLng = await getLatLng(results[0]);
            return latLng;
          }),
        );
        setPatientCoords(coordinates);
        const addresses = await Promise.all(
          arrayPatient.map(async (item) => {
            const results = await geocodeByAddress(item.patientData.address);
            return results[0].formatted_address;
          }),
        );
        setPatientAddresses(addresses);
      };

      if (arrayPatient.length > 0) {
        getPatientCoordinates();
      }
    } catch (error) {
      console.log("Error getting coordinats", error);
    }
  }, [doctorPosition, props.address, props.arrayPatient]);

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
      window.google.maps
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
    }
  }, [mapsLoaded, doctorPosition, patientPositions]);

  const handleMapLoad = (map) => {
    setMap(map);
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

        {patientPositions.map((patient, index) => (
          <Marker key={index} position={patient} />
        ))}

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
  const renderPatientInfo = () => {
    return patientPositions.slice(1, 10000).map((patient, index) => {
      const distance = (haversine(doctorPosition, patient) / 1000) * 1.2; // Quãng đường tính bằng mét, chuyển sang km
      // const speed = 35;
      // const time = (distance / speed) * 60;
      const patientName = String.fromCharCode(66 + index);

      return (
        <tr key={index}>
          <td>{`${patientName}`}</td>
          <td>{`${patientAddresses[index]}`}</td>
          <td>{`${distance.toFixed(2)} km`}</td>
          {/* <td>{`${speed} km/h`}</td> */}
          {/* <td>{`${time.toFixed(0)} phút`}</td> */}
          <td>
            <button className="btn btn-success px-1 mx-1">Hoàn thành</button>
            <button className="btn btn-danger px-1 mx-1">Hủy lịch</button>
            <button className="btn btn-danger px-1 mx-1">
              Thêm vào danh sách đen
            </button>
          </td>
        </tr>
      );
    });
  };
  return (
    <div className="center container-fluid">
      <div className="map col-12 ">
        <MapWithMarker
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${"AIzaSyB0M2HOZPKdY7BiMvXdMJrv_d6yr-cdNio"}`}
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={
            <div
              style={{
                height: "100%",
                width: "670px",
                margin: "0",
                padding: "0",
              }}
            />
          }
          mapElement={<div style={{ height: "100%" }} />}
        />
        <div className="patient-info">
          <h2>Thông tin bệnh nhân</h2>
          <table>
            <thead>
              <tr>
                <th>Tọa độ</th>
                <th>Địa chỉ</th>
                <th>Quãng đường</th>
                {/* <th>Vận tốc</th> */}
                {/* <th>Thời gian</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderPatientInfo()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MapDoctor;

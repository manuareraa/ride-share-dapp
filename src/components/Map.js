import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps";

const Map = withScriptjs(
  withGoogleMap((props) => {
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropLocation, setDropLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [pickupAddress, setPickupAddress] = useState("");
    const [dropAddress, setDropAddress] = useState("");

    useEffect(() => {
      setGeocoder(new window.google.maps.Geocoder());
    }, []);

    useEffect(() => {
      //   console.log("Locations", pickupLocation, dropLocation, directions);
      if (pickupLocation && dropLocation) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: pickupLocation,
            destination: dropLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
              if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);
                const distanceInMeters =
                  window.google.maps.geometry.spherical.computeDistanceBetween(
                    pickupLocation,
                    dropLocation
                  );
                setDistance(distanceInMeters);
                props.setFormData((prevState) => ({
                  ...prevState,
                  distance: distanceInMeters,
                  fare: distanceInMeters * 1000000000,
                }));
              }
            }
          }
        );
      }
    }, [pickupLocation, dropLocation]);

    const getAddress = (location, callback) => {
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          callback(results[0].formatted_address);
        } else {
          callback("");
        }
      });
    };

    useEffect(() => {
      if (pickupLocation) {
        getAddress(pickupLocation, (address) => {
          setPickupAddress(address);
          props.setFormData((prevState) => ({
            ...prevState,
            pickup: address,
          }));
        });
      }
    }, [pickupLocation]);

    useEffect(() => {
      if (dropLocation) {
        getAddress(dropLocation, (address) => {
          setDropAddress(address);
          props.setFormData((prevState) => ({
            ...prevState,
            drop: address,
          }));
        });
      }
    }, [dropLocation]);

    const handleMapClick = (event) => {
      if (!pickupLocation) {
        setPickupLocation(event.latLng);
      } else if (!dropLocation) {
        setDropLocation(event.latLng);
      }
    };

    const handleReset = () => {
      setPickupLocation(null);
      setDropLocation(null);
      setDirections(null);
    };

    return (
      <GoogleMap
        defaultZoom={12}
        center={props.center}
        onClick={(event) => handleMapClick(event)}
      >
        {pickupLocation && <Marker position={pickupLocation} />}
        {dropLocation && <Marker position={dropLocation} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    );
  })
);

const MapComponent = (props) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyChykMQlbWKcQy-qixkVnXCrGVoy-vdlM4`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        center={center}
        setFormData={props.setFormData}
      />
    </div>
  );
};

export default MapComponent;

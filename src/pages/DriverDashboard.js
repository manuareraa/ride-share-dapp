import React, { useEffect, useState } from "react";
import Web3 from "web3";

function DriverDashboard(props) {
  const [pastRides, setPastRides] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);

  const trimString = (str, length) => {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  };

  const processPastRides = () => {
    console.log("processPastRides called");
    const pastRides = props.appState.pastRides;
    if (pastRides.length === 0) {
      setPastRides([]);
    } else {
      const pastRidesArray = [];
      for (let i = 0; i < pastRides.length; i++) {
        pastRidesArray.push(
          <div
            className="flex flex-row bg-custom-secondary p-4 w-full justify-between"
            key={i}
          >
            <div className="flex flex-col">
              <p>
                Pickup Location:{" "}
                <b>{trimString(pastRides[i].pickupLocation, 20)}</b>
              </p>
              <p>
                Drop Location:{" "}
                <b>{trimString(pastRides[i].dropLocation, 20)}</b>
              </p>
              <p>
                Distance:
                <b>{(pastRides[i].distance / 1000).toFixed(2)} KM</b>
              </p>
              <p>
                Fare:{" "}
                <b>{Web3.utils.fromWei(pastRides[i].fare.toString())} MATIC</b>
              </p>
            </div>

            <div className="flex flex-col">
              <p>
                Status:{" "}
                {props.appState.pastRides[i].status === "0" ? (
                  <b>Waiting for a driver to pickup ride...</b>
                ) : props.appState.pastRides[i].status === "1" ? (
                  <b>Ride Cancelled</b>
                ) : props.appState.pastRides[i].status === "2" ? (
                  <b>On The Way</b>
                ) : props.appState.pastRides[i].status === "3" ? (
                  <b>Completed</b>
                ) : null}
              </p>
              <p>
                Driver:{" "}
                <b>
                  {pastRides[i].driverName.length === 0
                    ? "Waiting for a driver to pickup ride..."
                    : pastRides[i].driverName}
                </b>
              </p>
              <p>
                Driver Address: <b>{pastRides[i].driverAddress}</b>
              </p>
            </div>
          </div>
        );
      }
      setPastRides(pastRidesArray);
    }
  };

  const processAvailableRides = () => {
    const availableRides = props.appState.availableRides;
    if (availableRides.length === 0) {
      setAvailableRides([]);
    } else {
      const availableRidesArray = [];
      for (let i = 0; i < availableRides.length; i++) {
        availableRidesArray.push(
          <div
            className="flex flex-row bg-custom-secondary p-4 w-full justify-between"
            key={i}
          >
            <div className="flex flex-col">
              <p>
                Pickup Location:{" "}
                <b>{trimString(availableRides[i].pickupLocation, 20)}</b>
              </p>
              <p>
                Drop Location:{" "}
                <b>{trimString(availableRides[i].dropLocation, 20)}</b>
              </p>
              <p>
                Distance:{" "}
                <b>{(availableRides[i].distance / 1000).toFixed(2)} KM</b>
              </p>
              <p>
                Fare: <b>{Web3.utils.fromWei(availableRides[i].fare)} MATIC</b>
              </p>
            </div>

            <div className="flex flex-col">
              <p>
                Status:{" "}
                {props.appState.availableRides[i].status === "0" ? (
                  <b>Waiting for a driver to pickup ride...</b>
                ) : props.appState.availableRides[i].status === "1" ? (
                  <b>Ride Cancelled</b>
                ) : props.appState.availableRides[i].status === "2" ? (
                  <b>On The Way</b>
                ) : props.appState.availableRides[i].status === "3" ? (
                  <b>Completed</b>
                ) : null}
              </p>
              <p>
                Driver:{" "}
                <b>
                  {availableRides[i].driverName.length === 0
                    ? "Waiting for a driver to pickup ride..."
                    : availableRides[i].driverName}
                </b>
              </p>
              <p>
                Driver Address: <b>{availableRides[i].driverAddress}</b>
              </p>
              <button
                className="text-md px-6 bg-custom-primary text-white py-2 m-4"
                onClick={() => {
                  console.log("PUR", availableRides[i].tripId);
                  props.pickupRide(availableRides[i].tripId);
                }}
              >
                Pickup Ride
              </button>
            </div>
          </div>
        );
      }
      setAvailableRides(availableRidesArray);
    }
  };

  useEffect(() => {
    processPastRides();
    processAvailableRides();
  }, [props.appState.pastRides, props.appState.availableRides]);

  return (
    <>
      <div className="divider pt-8">Current Ride</div>
      <div className="w-full px-10 space-y-4">
        <div className="flex flex-row bg-custom-secondary p-4 w-full justify-between">
          {props.appState.currentRide === null ? (
            <>
              <div className="flex flex-col items-center w-full">
                <p className="text-xl font-bold">No Current Ride</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <p>
                  Pickup Location:{" "}
                  <b>
                    {trimString(props.appState.currentRide.pickupLocation, 20)}
                  </b>
                </p>
                <p>
                  Drop Location:{" "}
                  <b>
                    {trimString(props.appState.currentRide.dropLocation, 20)}
                  </b>
                </p>
                <p>
                  Distance:{" "}
                  <b>
                    {(props.appState.currentRide.distance / 1000).toFixed(2)} KM
                  </b>
                </p>
                <p>
                  Fare: <b>{props.appState.currentRide.fare} MATIC</b>
                </p>
              </div>

              <div className="flex flex-col">
                <p>
                  Status:{" "}
                  {props.appState.currentRide.status === "0" ? (
                    <b>Waiting for a driver to pickup ride...</b>
                  ) : props.appState.currentRide.status === "1" ? (
                    <b>Ride Cancelled</b>
                  ) : props.appState.currentRide.status === "2" ? (
                    <b>On The Way</b>
                  ) : props.appState.currentRide.status === "3" ? (
                    <b>Completed</b>
                  ) : null}
                </p>
                <p>
                  Driver:{" "}
                  <b>
                    {props.appState.currentRide.status === "0"
                      ? "Waiting for a driver to pickup ride..."
                      : props.appState.currentRide.status === "2"
                      ? props.appState.currentRide.driverName
                      : null}
                  </b>
                </p>
                <p>
                  Driver Address:{" "}
                  <b>
                    {props.appState.currentRide.status === "0"
                      ? "Waiting for a driver to pickup ride..."
                      : props.appState.currentRide.status === "2"
                      ? props.appState.currentRide.driverAddress
                      : null}
                  </b>
                </p>
                <p>
                  Vehicle No:{" "}
                  <b>
                    {props.appState.currentRide.status === "0"
                      ? "Waiting for a driver to pickup ride..."
                      : props.appState.currentRide.status === "2"
                      ? props.appState.currentRide.vehicleNumber
                      : null}
                  </b>
                </p>
                <button
                  className="text-md px-6 bg-custom-primary text-white py-2 m-4"
                  onClick={() =>
                    props.completeRide(props.appState.currentRide.tripId)
                  }
                >
                  Complete Ride
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="divider pt-8">Available Rides</div>
      <div className="w-full px-10 space-y-4">
        {props.appState.availableRides.length === 0 ? (
          <>
            <div className="flex flex-col items-center w-full">
              <p className="text-xl font-bold">No Available Rides</p>
            </div>
          </>
        ) : (
          <>{availableRides}</>
        )}
      </div>
      <div className="divider pt-8">Past Rides</div>
      <div className="w-full px-10 space-y-4">
        {props.appState.pastRides.length === 0 ? (
          <div className="flex flex-col items-center w-full">
            <p className="text-xl font-bold">No Past Rides</p>
          </div>
        ) : (
          <>{pastRides}</>
        )}
      </div>
    </>
  );
}

export default DriverDashboard;

import React, { useEffect, useState } from "react";
import MapComponent from "../components/Map";
import Web3 from "web3";

function RiderDashboard(props) {
  const [formData, setFormData] = useState({
    pickup: "",
    drop: "",
    fare: 0,
    distance: 0,
  });

  const [pastRides, setPastRides] = useState([]);

  const handleInput = (field, e) => {
    setFormData({
      ...formData,
      [field]: e.currentTarget.value,
    });
  };

  const trimString = (str, length) => {
    if (str.length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  };

  const processPastRides = () => {
    setPastRides([]);
    const pastRides = props.appState.pastRides;
    if (pastRides.length === 0) {
      setPastRides([]);
    } else {
      let pastRidesArray = [];
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
                Distance: <b>{(pastRides[i].distance / 1000).toFixed(2)} KM</b>
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
                    ? "Cancelled"
                    : pastRides[i].driverName}
                </b>
              </p>
              <p>
                Driver Address:{" "}
                <b>
                  {
                    // trimString(pastRides[i].driverAddress,14)
                    pastRides[i].driverAddress
                  }
                </b>
              </p>
            </div>
          </div>
        );
      }
      setPastRides(pastRidesArray);
    }
  };

  const calculateFareAndDistance = () => {
    // get a random decimal value below 15.0 with one decimal place
    const randomDistance = Math.floor(Math.random() * 15 * 10) / 10;
    let randomFare = (randomDistance * 0.000001).toFixed(6);
    if (parseFloat(randomFare) === 0.0) {
      randomFare = 0.000001;
    }
    console.log("Fare Data: ", randomDistance, randomFare);
    setFormData({
      ...formData,
      distance: randomDistance,
      fare: randomFare,
    });
  };

  useEffect(() => {
    processPastRides();
  }, [props.appState.pastRides]);

  return (
    <>
      <div className="flex flex-col items-center py-6">
        <MapComponent setFormData={setFormData} />
        <p className="font-bold py-6">Book Ride</p>
        <div className="flex flex-col space-y-4 items-center">
          <form className="grid grid-cols-3 gap-4 mb-4">
            <label
              htmlFor="lastname"
              className="col-start-1 col-span-1 text-gray-700"
            >
              Pickup Location:
            </label>
            <input
              type="text"
              placeholder="Enter Pickup Location"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 rounded-none"
              onInputCapture={(e) => handleInput("pickup", e)}
              value={formData.pickup}
            />
            <label
              htmlFor="lastname"
              className="col-start-1 col-span-1 text-gray-700"
            >
              Drop Location:
            </label>
            <input
              type="text"
              placeholder="Enter Drop Location"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 rounded-none"
              onInputCapture={(e) => handleInput("drop", e)}
              value={formData.drop}
            />
          </form>
          <p>
            <b>Fare Per KM: 1000000000000 Wei / KM</b>
          </p>
          <p>
            <b>Distance: </b>
            {(formData.distance / 1000).toFixed(2)} KM
          </p>
          <p>
            <b>Fare: </b>
            {Web3.utils.fromWei(Math.floor(formData.fare).toString())} MATIC
          </p>
          <button
            className="text-md px-6 bg-custom-primary text-white py-2"
            onClick={() =>
              props.createRide(
                formData.pickup,
                formData.drop,
                formData.distance,
                Web3.utils.fromWei(Math.floor(formData.fare).toString())
              )
            }
          >
            Confirm and Book Ride
          </button>
        </div>
        <div className="divider pt-8">Current Ride</div>
        <div className="w-full px-10">
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
                      {trimString(
                        props.appState.currentRide.pickupLocation,
                        20
                      )}
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
                    <b>{props.appState.currentRide.distance / 1000} KM</b>
                  </p>
                  <p>
                    Fare:{" "}
                    <b>
                      {Web3.utils.fromWei(
                        props.appState.currentRide.fare.toString()
                      )}
                      MATIC
                    </b>
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
                  {props.appState.currentRide.status !== "2" ? (
                    <button
                      className="text-md px-6 bg-custom-primary text-white py-2 m-4"
                      onClick={() =>
                        props.cancelRide(props.appState.currentRide.tripId)
                      }
                    >
                      Cancel Ride
                    </button>
                  ) : null}
                  {props.appState.currentRide.status === "2" ? (
                    <button
                      className="text-md px-6 bg-custom-primary text-white py-2 m-4"
                      onClick={() =>
                        props.payDriver(
                          props.appState.currentRide.driverAddress,
                          props.appState.currentRide.fare
                        )
                        // console.log("**", props.appState.currentRide)
                      }
                    >
                      Pay Driver
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="divider pt-8">Past Rides</div>
        <div className="w-full px-10 space-y-8">
          {/* <div className="flex flex-col bg-custom-secondary p-4 w-full justify-between "> */}
          {props.appState.pastRides.length === 0 ? (
            <>
              <div className="flex flex-col items-center w-full">
                <p className="text-xl font-bold">No Past Rides</p>
              </div>
            </>
          ) : (
            <>{pastRides}</>
          )}
        </div>
      </div>
    </>
  );
}

export default RiderDashboard;

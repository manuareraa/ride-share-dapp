import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Web3 from "web3";

import Loading from "./components/Loading";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import RiderSignup from "./pages/RiderSignup";
import RiderLogin from "./pages/RiderLogin";
import DriverSignup from "./pages/DriverSignup";
import DriverLogin from "./pages/DriverLogin";
import RiderDashboard from "./pages/RiderDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import rideshareabi from "./smart-contracts/ride-share";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    loading: false,
    message: "",
  });
  const [appState, setAppState] = useState({
    loggedIn: false,
    web3: null,
    account: "",
    chainId: "",
    maticBalance: "",
    username: "",
    contractAddress: "0xb19B74283345Dc72D0cdE53A1c700D31348120b1",
    ridesCount: 0,
    currentRide: null,
    pastRides: [],
    availableRides: [],
    role: null,
  });

  const setUpWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setAppState((prevState) => {
          return { ...prevState, web3: web3 };
        });
        console.log("<< Web3 Object Received  >>");
        // Check if Polygon chain is added to Metamask

        window.ethereum
          .request({ method: "net_version" })
          .then(async (chainId) => {
            if (chainId !== "80001") {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x13881" }],
                });
                console.log("Polygon Mumbai Chain found.");
              } catch (switchError) {
                console.log("Error connecting to Polygon Mumbai Chain (1)");
              }
            }
          });

        const accounts = await web3.eth.getAccounts();
        console.log("<< Account Received  >>", accounts[0]);
        // setAppState((prevState) => {
        //   return { ...prevState, loggedIn: true };
        // });

        setAppState((prevState) => {
          return {
            ...prevState,
            account: accounts[0],
          };
        });
      } catch (error) {
        console.error(error);
        console.log("Error getting web3 object. Install Metamask.");
      }
    } else {
      console.log("Please install MetaMask to connect your wallet.");
    }
  };

  const riderSignup = async (name, mobile, password) => {
    setLoading({ loading: true, message: "Signing Up Rider..." });
    console.log(
      "<< Rider Sign Up Called  >>",
      name,
      mobile,
      password,
      appState
    );
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods
        .riderSignup(name, mobile, password)
        .send({
          from: appState.account,
        });
      console.log("<< Rider Signup Result >>", result);
      setLoading({ loading: false, message: "" });
      navigate("/rider-login");
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Rider Signup Error >>", error);
    }
  };

  const driverSignUp = async (name, mobile, password, vehicleNumber) => {
    setLoading({ loading: true, message: "Signing Up Driver..." });
    console.log(
      "<< Driver Sign Up Called  >>",
      name,
      mobile,
      password,
      vehicleNumber,
      appState
    );
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods
        .driverSignup(name, mobile, password, vehicleNumber)
        .send({
          from: appState.account,
        });
      console.log("<< Driver Signup Result >>", result);
      setLoading({ loading: false, message: "" });
      navigate("/driver-login");
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Driver Signup Error >>", error);
    }
  };

  const riderLogin = async (name, password) => {
    setLoading({ loading: true, message: "Logging In Rider..." });
    console.log("<< Driver Sign Up Called  >>", name, password);
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods.riderLogin(name, password).call({
        from: appState.account,
      });
      console.log("<< Rider Login Result >>", result);
      setLoading({ loading: false, message: "" });
      if (result === true) {
        setAppState((prevState) => {
          return {
            ...prevState,
            loggedIn: true,
            username: name,
            role: "rider",
          };
        });
        fetchAllRides(true, "rider");
      } else {
        alert("Incorrect Credentials");
      }
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Rider Login Error >>", error);
    }
  };

  const driverLogin = async (name, password) => {
    setLoading({ loading: true, message: "Logging In Driver..." });
    console.log("<< Driver Sign Up Called  >>", name, password);
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods.driverLogin(name, password).call({
        from: appState.account,
      });
      console.log("<< Driver Login Result >>", result);
      setLoading({ loading: false, message: "" });
      if (result === true) {
        setAppState((prevState) => {
          return {
            ...prevState,
            loggedIn: true,
            username: name,
            role: "driver",
          };
        });
        fetchAllRides(true, "driver");
      } else {
        alert("Incorrect Credentials");
      }
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Driver Login Error >>", error);
    }
  };

  // setInterval(() => {
  //   if (appState.loggedIn === true) {
  //     fetchAllRidesRR(false, appState.role);
  //   }
  // }, 5000);

  useEffect(() => {
    setInterval(() => {
      if (appState.loggedIn === true) {
        fetchAllRidesRR(false, appState.role);
      }
    }, 5000);

    // return () => clearInterval(interval);
  }, [appState.loggedIn]);

  const fetchAllRidesRR = async (shouldRedirect, role) => {
    console.log("<< Fetch All RidesRR Called  >>", appState);
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      await contract.methods
        .ridesCount()
        .call({ from: appState.account })
        .then(async (result) => {
          let ridesCount = parseInt(result);
          setAppState((prevState) => {
            return {
              ...prevState,
              ridesCount: ridesCount,
            };
          });

          if (ridesCount === 0) {
            if (shouldRedirect === true) {
              if (role === "rider") {
                navigate("/rider-dashboard");
              } else {
                navigate("/driver-dashboard");
              }
            }
          } else {
            setAppState((prevState) => {
              return {
                ...prevState,
                currentRide: null,
              };
            });
            let tempAvailableRides = [];
            let tempPastRides = [];
            for (let i = 0; i < ridesCount; i++) {
              await contract.methods
                .rides(i)
                .call({ from: appState.account })
                .then((result) => {
                  if (role === "rider") {
                    console.log("Fetching data for riders", result.status);
                    if (result.riderAddress === appState.account) {
                      if (result.status === "0" || result.status === "2") {
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            currentRide: result,
                          };
                        });
                      } else {
                        console.log("Found3", result.status, result.tripId);
                        tempPastRides.push(result);
                      }
                    }
                  } else if (role === "driver") {
                    if (result.driverAddress === appState.account) {
                      if (result.status === "0" || result.status === "2") {
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            currentRide: result,
                          };
                        });
                      } else {
                        tempPastRides.push(result);
                      }
                    } else {
                      if (
                        result.status === "0" &&
                        result.pickupLocation !== ""
                      ) {
                        console.log("Pushed to AR", result);
                        tempAvailableRides.push(result);
                      }
                    }
                  }
                });

              // here
              console.log("++", i, ridesCount);
              if (i === ridesCount - 1) {
                console.log("Updating AR and PR", tempPastRides.length);
                setAppState((prevState) => {
                  return {
                    ...prevState,
                    availableRides: tempAvailableRides,
                  };
                });
                setAppState((prevState) => {
                  return {
                    ...prevState,
                    pastRides: tempPastRides,
                  };
                });
                if (shouldRedirect === true) {
                  if (role === "rider") {
                    navigate("/rider-dashboard");
                  } else {
                    navigate("/driver-dashboard");
                  }
                }
              }
            }
          }
        });
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Fetch All Rides Error >>", error);
    }
  };

  const fetchAllRides = async (shouldRedirect, role) => {
    setLoading({ loading: true, message: "Fetching Rides..." });
    console.log("<< Fetch All Rides Called  >>");
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      await contract.methods
        .ridesCount()
        .call({ from: appState.account })
        .then(async (result) => {
          console.log("<< Fetch All Rides Result >>", result);
          let ridesCount = parseInt(result);
          setAppState((prevState) => {
            return {
              ...prevState,
              ridesCount: ridesCount,
            };
          });

          if (ridesCount === 0) {
            setLoading({ loading: false, message: "" });
            if (shouldRedirect === true) {
              if (role === "rider") {
                navigate("/rider-dashboard");
              } else {
                navigate("/driver-dashboard");
              }
            }
          } else {
            for (let i = 0; i < ridesCount; i++) {
              await contract.methods
                .rides(i)
                .call({ from: appState.account })
                .then((result) => {
                  console.log("<< Ride Data:  >>", i, result);
                  if (role === "rider") {
                    console.log("Fetching data for riders", result.status);
                    if (result.riderAddress === appState.account) {
                      if (result.status === "0" || result.status === "2") {
                        console.log("Pushed to CR", result);
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            currentRide: result,
                          };
                        });
                      } else {
                        console.log("Pushed to PR", result);
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            pastRides: [...prevState.pastRides, result],
                          };
                        });
                      }
                    }
                  } else if (role === "driver") {
                    console.log("Fetching data for drivers");
                    if (result.driverAddress === appState.account) {
                      if (result.status === "0" || result.status === "2") {
                        console.log("Pushed to CR", result);
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            currentRide: result,
                          };
                        });
                      } else {
                        console.log("Pushed to PR", result);
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            pastRides: [...prevState.pastRides, result],
                          };
                        });
                      }
                    } else {
                      if (
                        result.status === "0" &&
                        result.pickupLocation !== ""
                      ) {
                        console.log("Pushed to AR", result);
                        setAppState((prevState) => {
                          return {
                            ...prevState,
                            availableRides: [
                              ...prevState.availableRides,
                              result,
                            ],
                          };
                        });
                      } else {
                        console.log("Omitted", result);
                      }
                    }
                  }
                  if (i === ridesCount - 1) {
                    setLoading({ loading: false, message: "" });
                    if (shouldRedirect === true) {
                      if (role === "rider") {
                        navigate("/rider-dashboard");
                      } else {
                        navigate("/driver-dashboard");
                      }
                    }
                    console.log("Rides Data: ", appState.rides);
                  }
                });
            }
          }
        });
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Fetch All Rides Error >>", error);
    }
  };

  const createRide = async (pickup, drop, distance, fare) => {
    setLoading({ loading: true, message: "Creating Ride..." });
    console.log(
      "<< Create Ride Called  >>",
      pickup,
      drop,
      distance.toFixed(0),
      fare
    );
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      console.log("DDD", fare, Web3.utils.toWei(fare.toString()));
      const result = await contract.methods
        .createRide(
          pickup,
          drop,
          distance.toFixed(0),
          Web3.utils.toWei(fare.toString())
        )
        .send({ from: appState.account });
      console.log("<< Create Ride Result >>", result);
      setLoading({ loading: false, message: "" });
      fetchAllRides(false, "");
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Create Ride Error >>", error);
    }
  };

  const cancelRide = async (rideId) => {
    setLoading({ loading: true, message: "Cancelling Ride..." });
    console.log("<< Cancel Ride Called  >>");
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods
        .cancelRide(rideId)
        .send({ from: appState.account });
      console.log("<< Cancel Ride Result >>", result);
      setLoading({ loading: false, message: "" });
      fetchAllRides(false, "rider");
      setAppState((prevState) => {
        return {
          ...prevState,
          currentRide: null,
        };
      });
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Cancel Ride Error >>", error);
    }
  };

  const pickupRide = async (tripId) => {
    setLoading({ loading: true, message: "Picking Up Ride..." });
    console.log("<< Pickup Ride Called  >>");
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods
        .pickupRide(tripId)
        .send({ from: appState.account });
      console.log("<< Pickup Ride Result >>", result);
      setLoading({ loading: false, message: "" });
      fetchAllRides(false, "driver");
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Pickup Ride Error >>", error);
    }
  };

  const completeRide = async (tripId) => {
    setLoading({ loading: true, message: "Completing Ride..." });
    console.log("<< Complete Ride Called  >>");
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods
        .completeRide(tripId)
        .send({ from: appState.account });
      console.log("<< Complete Ride Result >>", result);
      setLoading({ loading: false, message: "" });
      setAppState((prevState) => {
        return {
          ...prevState,
          currentRide: null,
        };
      });
      fetchAllRides(false, "driver");
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Complete Ride Error >>", error);
    }
  };

  const payDriver = async (driverAddress, amount) => {
    setLoading({ loading: true, message: "Paying Driver..." });
    console.log(
      "<< Pay Driver Called  >>",
      driverAddress,
      Web3.utils.fromWei(amount.toString()),
      amount
    );
    const contract = new appState.web3.eth.Contract(
      JSON.parse(rideshareabi),
      appState.contractAddress
    );

    try {
      const result = await contract.methods.payDriver(driverAddress).send({
        from: appState.account,
        value: amount,
      });
      console.log("<< Pay Driver Result >>", result);
      setLoading({ loading: false, message: "" });
    } catch (error) {
      setLoading({ loading: false, message: "" });
      console.log("<< Pay Driver Error >>", error);
    }
  };

  const walletLogout = async () => {
    console.log("<< Wallet Logout Called  >>");
    setAppState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
        username: "",
      };
    });
    navigate("/");
  };

  return (
    <>
      <div className="h-screen">
        {loading.loading === true ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : null}

        <Header appState={appState} />
        <Navbar appState={appState} walletLogout={walletLogout} />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/rider-signup"
            element={
              <RiderSignup
                appState={appState}
                setUpWeb3={setUpWeb3}
                riderSignup={riderSignup}
              />
            }
          />
          <Route
            path="/rider-login"
            element={
              <RiderLogin
                appState={appState}
                setUpWeb3={setUpWeb3}
                riderLogin={riderLogin}
              />
            }
          />
          <Route
            path="/driver-signup"
            element={
              <DriverSignup
                appState={appState}
                setUpWeb3={setUpWeb3}
                driverSignUp={driverSignUp}
              />
            }
          />
          <Route
            path="/driver-login"
            element={
              <DriverLogin
                appState={appState}
                setUpWeb3={setUpWeb3}
                driverLogin={driverLogin}
              />
            }
          />
          <Route
            path="/rider-dashboard"
            element={
              <RiderDashboard
                appState={appState}
                createRide={createRide}
                fetchAllRides={fetchAllRides}
                cancelRide={cancelRide}
                payDriver={payDriver}
              />
            }
          />
          <Route
            path="/driver-dashboard"
            element={
              <DriverDashboard
                appState={appState}
                pickupRide={pickupRide}
                completeRide={completeRide}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;

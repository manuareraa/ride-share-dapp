import React, { useState } from "react";

function RiderSignup(props) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const handleInput = (field, e) => {
    setFormData({
      ...formData,
      [field]: e.currentTarget.value,
    });
  };

  return (
    <>
      <div className="flex flex-col items-center py-20">
        <p className="font-bold py-6">Create Rider Account</p>
        <div className="flex flex-col space-y-4 items-center">
          <form className="grid grid-cols-3 gap-4 mb-4">
            <label
              htmlFor="lastname"
              className="col-start-1 col-span-1 text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              placeholder="Enter your Name"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 rounded-none"
              onInputCapture={(e) => handleInput("name", e)}
              value={formData.name}
            />
            <label
              htmlFor="Mobile"
              className="col-start-1 col-span-1 text-gray-700"
            >
              Mobile:
            </label>
            <input
              type="text"
              placeholder="Enter your Mobile"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 rounded-none"
              onInputCapture={(e) => handleInput("mobile", e)}
              value={formData.mobile}
            />
            <label
              htmlFor="lastname"
              className="col-start-1 col-span-1 text-gray-700"
            >
              Enter Password
            </label>
            <input
              type="text"
              placeholder="Enter your password"
              className="col-start-2 col-span-2 px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input input-bordered w-full max-w-xs h-8 rounded-none"
              onInputCapture={(e) => handleInput("password", e)}
              value={formData.password}
            />
          </form>
          {props.appState.account === "" ? (
            <button
              className="text-md px-6 bg-custom-primary text-white py-2"
              onClick={() => props.setUpWeb3()}
            >
              Connect Wallet before Signing
            </button>
          ) : (
            <p>Connected: {props.appState.account}</p>
          )}
          <button
            className="text-md px-6 bg-custom-primary text-white py-2"
            onClick={() =>
              props.riderSignup(
                formData.name,
                formData.mobile,
                formData.password
              )
            }
          >
            Sign Up as Rider
          </button>
        </div>
      </div>
    </>
  );
}

export default RiderSignup;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Homepage(props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col w-full items-center mt-20 space-y-8">
        <div className="flex flex-row space-x-8">
          <button
            className="text-md px-6 bg-custom-primary text-white py-2 w-60"
            onClick={() => navigate("/rider-signup")}
          >
            Sign Up as Rider
          </button>
          <button
            className="text-md px-6 bg-custom-primary text-white py-2 w-60"
            onClick={() => navigate("/driver-signup")}
          >
            Sign Up as Driver
          </button>
        </div>
        <div className="flex flex-row space-x-8">
          <button
            className="text-md px-6 bg-custom-primary text-white py-2 w-60"
            onClick={() => navigate("/rider-login")}
          >
            Login as Rider
          </button>
          <button
            className="text-md px-6 bg-custom-primary text-white py-2 w-60"
            onClick={() => navigate("/driver-login")}
          >
            Login as Driver
          </button>
        </div>
      </div>
    </>
  );
}

export default Homepage;

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RideSharing {
    struct Driver {
        string name;
        string mobile;
        string password;
        string vehicleNumber;
        bool exists;
    }

    struct Rider {
        string name;
        string mobile;
        string password;
        bool exists;
    }

    struct Ride {
        string pickupLocation;
        string dropLocation;
        uint256 distance;
        uint256 fare;
        string riderName;
        uint256 tripId;
        address driverAddress;
        string driverName;
        string vehicleNumber;
        uint256 status;
        address riderAddress;
    }

    mapping(address => Driver) public drivers;
    mapping(address => Rider) public riders;
    mapping(uint256 => Ride) public rides;

    uint256 constant STATUS_CREATED = 0;
    uint256 constant STATUS_CANCELLED = 1;
    uint256 constant STATUS_ON_THE_WAY = 2;
    uint256 constant STATUS_DROPPED = 3;
    uint256 public ridesCount = 1;

    function driverSignup(
        string memory name,
        string memory mobile,
        string memory password,
        string memory vehicleNumber
    ) public {
        require(!drivers[msg.sender].exists, "Driver already exists");
        drivers[msg.sender] = Driver(
            name,
            mobile,
            password,
            vehicleNumber,
            true
        );
    }

    function driverLogin(string memory name, string memory password)
        public
        view
        returns (bool)
    {
        Driver memory driver = drivers[msg.sender];
        if (
            keccak256(bytes(driver.name)) == keccak256(bytes(name)) &&
            keccak256(bytes(driver.password)) == keccak256(bytes(password))
        ) {
            return true;
        }
        return false;
    }

    function riderSignup(
        string memory name,
        string memory mobile,
        string memory password
    ) public {
        require(!riders[msg.sender].exists, "Rider already exists");
        riders[msg.sender] = Rider(name, mobile, password, true);
    }

    function riderLogin(string memory name, string memory password)
        public
        view
        returns (bool)
    {
        Rider memory rider = riders[msg.sender];
        if (
            keccak256(bytes(rider.name)) == keccak256(bytes(name)) &&
            keccak256(bytes(rider.password)) == keccak256(bytes(password))
        ) {
            return true;
        }
        return false;
    }

    function createRide(
        string memory pickupLocation,
        string memory dropLocation,
        uint256 distance,
        uint256 fare
    ) public returns (uint256) {
        require(riders[msg.sender].exists, "Rider does not exist");
        uint256 tripId = ridesCount++;
        Ride memory ride = Ride(
            pickupLocation,
            dropLocation,
            distance,
            fare,
            riders[msg.sender].name,
            tripId,
            address(0),
            "",
            "",
            STATUS_CREATED,
            msg.sender
        );
        rides[tripId] = ride;
        return tripId;
    }

    function cancelRide(uint256 tripId) public {
        require(
            rides[tripId].status == STATUS_CREATED,
            "Ride cannot be cancelled"
        );
        require(
            keccak256(bytes(rides[tripId].riderName)) ==
                keccak256(bytes(riders[msg.sender].name)),
            "You are not the rider of this ride"
        );
        rides[tripId].status = STATUS_CANCELLED;
    }

    function pickupRide(uint256 tripId) public {
        require(drivers[msg.sender].exists, "Driver does not exist");
        require(
            rides[tripId].status == STATUS_CREATED,
            "Ride cannot be picked up"
        );
        rides[tripId].driverAddress = msg.sender;
        rides[tripId].driverName = drivers[msg.sender].name;
        rides[tripId].vehicleNumber = drivers[msg.sender].vehicleNumber;
        rides[tripId].status = STATUS_ON_THE_WAY;
    }

    function completeRide(uint256 tripId) public {
        require(
            rides[tripId].status == STATUS_ON_THE_WAY,
            "Ride cannot be completed"
        );
        rides[tripId].status = STATUS_DROPPED;
    }

    function payDriver(address payable receiver) public payable {
        receiver.transfer(msg.value);
    }
}

const greetAdmin = document.querySelector('#greetAdmin');

// Retrieve the backRes value from the URL
const adminParams = new URLSearchParams(window.location.search);
const backRes = adminParams.get('backRes');

console.log(backRes);

// Use the backRes value
greetAdmin.textContent = "Good to see you back, Mr/Mrs " + backRes;


const passengerTableBtn = document.querySelector('#passBtn');

$(passengerTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("passenger"); // TEMPORARY FOR CHECKING PURPOSES
});
   
// ------------------------------------------------------------------------------------------------------------------------

const flightTableBtn = document.querySelector('#flightBtn');

$(flightTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("flight");
});

// ------------------------------------------------------------------------------------------------------------------------

const flightAndPassBtn = document.querySelector('#flightPassBtn');

$(flightAndPassBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("pass_flight");
});

// ------------------------------------------------------------------------------------------------------------------------

const staffTableBtn = document.querySelector('#staffBtn');

$(staffTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("staff");
});

// ------------------------------------------------------------------------------------------------------------------------

const flightCrewTableBtn = document.querySelector('#flightCrewBtn');

$(flightCrewTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("flight_crew");
});

// ------------------------------------------------------------------------------------------------------------------------

const pilotTableBtn = document.querySelector('#pilotBtn');

$(pilotTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("pilot_valid");
});

// ------------------------------------------------------------------------------------------------------------------------

const airplaneTableBtn = document.querySelector('#airplaneBtn');

$(airplaneTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("airplane");
});

// ------------------------------------------------------------------------------------------------------------------------

const cityTableBtn = document.querySelector('#cityBtn');

$(cityTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("city");
});

// ------------------------------------------------------------------------------------------------------------------------

const interStopTableBtn = document.querySelector('#intermBtn');

$(interStopTableBtn).click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent("inter_stop");
});

// ------------------------------------------------------------------------------------------------------------------------

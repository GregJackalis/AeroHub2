// Parse the query string from the URL
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

// Getting the column names for the table that needs to be updated
var paramsJson = urlParams.get('record');

// Parse the JSON string into an array
var data = JSON.parse(paramsJson);

var idData = data[2];

// Now you have the array of parameters
console.log("Current Record Data:", data);


//------------------------------------------------------------------------------------------------------------
// UPDATING HTML'S TITLE DYNAMICALLY
if (data[0] == "pass_flight") {
    document.title = "Passengers & Flights Table";
} else if (data[0] == "flight_crew") {
    document.title = "Flight-Crew Table";
} else if (data[0] == "pilot_valid") {
    document.title = "Pilot-Info Table";
} else if (data[0] == "inter_stop") {
    document.title = "Intermediate Stop Table";
} else {
    document.title = data[0].charAt(0).toUpperCase() + data[0].slice(1) + " Table";
}


//------------------------------------------------------------------------------------------------------------
// GETTING CONTAINER ELEMENT TO ADD ALL THE FORM AND FORM DATA TO THE HTML PAGE
const containerForm = document.querySelector('.container');

//------------------------------------------------------------------------------------------------------------
// CREATING AN APPROPRIATE HEADER BASED ON THE TYPE OF TABLE

const formHeader = document.createElement('header');
formHeader.textContent = "Update " + data[1];
containerForm.appendChild(formHeader);

//------------------------------------------------------------------------------------------------------------
// CREATING A FORM

const updateForm = document.createElement('form');
updateForm.classList.add('form');
updateForm.id = "updateForm";

//------------------------------------------------------------------------------------------------------------
// CREATING A BUTTON EVENT FOR THE ADMIN TO GO BACK TO TABLE VIEW
//------------------------------------------------------------------------------------------------------------

$('#homepageBtn').click(function() {
    window.location.href = "./showTable.html?table=" + encodeURIComponent(data[0]); // TEMPORARY FOR CHECKING PURPOSES
});


var requestData = {
    type: "getSpecific",
    id: idData,
    table: data[0]
};

console.log(requestData);

//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT GETS A SPECIFIC RECORD FROM THE BACK
//------------------------------------------------------------------------------------------------------------

$.get('../Forms/back_end/backEnd.php', requestData, function(response) {
    console.log(response.message);
    setupForm(response.message[0]);
})


//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT ADDS A CLICK EVENT TO THE UPDATE BUTTON WHICH TRIGGER CALLS THE sentUpdateToBack() FUNCTION
$(document).on('click', '#updateRec', function(event) {
    event.preventDefault();
    
    console.log("UPDATE BUTTON PRESSED!");

    sentUpdateToBack();
});


//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT SETS UP THE FROM
//------------------------------------------------------------------------------------------------------------

function setupForm(responseArr) {
    let col = document.createElement('div');
    col.classList.add('column');
    let counter = 0;    

    var inputArray = []

    var fieldNames = createColumnNames();
    console.log(fieldNames);

    fieldNames.forEach(function(field) {
        if (counter === 2) {
            // If counter reaches 2, create a new column
            col = document.createElement('div');
            col.classList.add('column');
            counter = 0; // Reset the counter
        }

        const box = document.createElement('div');
        box.classList.add('input-box');

        const label = document.createElement('label');
        label.textContent = field;

        const inputField = document.createElement('input');
        inputField.setAttribute("type", "text");
        inputField.setAttribute("required", "");

        inputArray.push(inputField);

        box.appendChild(label);
        box.appendChild(inputField);
    
        col.appendChild(box);
    
        updateForm.appendChild(col);

        counter++;
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Update Record";
    submitBtn.id = "updateRec";
    
    updateForm.appendChild(submitBtn);
    
    containerForm.appendChild(updateForm);

    let idx = 0;
    Object.keys(responseArr).forEach(function(key) {
        console.log(key);
        
        const inputField = inputArray[idx]; // Access the input field corresponding to the current index (idx)
        
        inputField.value = responseArr[key];         // Set the value of the input field

        
        if (idx === 0) { 
            // Disable the first input field (if it's the first iteration)
            inputField.disabled = true;
        }
        
        idx++;
    });
}

//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT CRETATES COLUMNS FOR THE UPDATE TABLE TO SHOW
//------------------------------------------------------------------------------------------------------------

function createColumnNames() {
    if (data[0] == "flight") {
        columnNames = ["Flight ID", "Flight Number", "Date", "Departure Time", "Arrival Time", "From", "To", "Plane Serial Number"];
    } else if (data[0] == "passenger") {
        columnNames = ["Passenger ID", "Surname", "Name", "Email", "Address", "Phone"];
    } else if (data[0] == "pass_flight") {
        columnNames = ["Passenger ID", "Passenger Surname", "Passenger Name", "Flight Number", "Flight Departure", "From", "To"];
    } else if (data[0] == "staff") {
        columnNames = ["Staff ID", "Employee Number", "Surname", "Name", "Address", "Phone", "Salary"];
    } else if (data[0] == "flight_crew") {
        columnNames = ["Flight Number", "Employee Number", "Surname", "Name", "Role"];
    } else if (data[0] == "pilot_valid") {
        columnNames = ["Plane Serial Number", "Plane Manufacturer", "Qualified", "Employee Number", "Surname", "Name"];
    } else if (data[0] == "airplane") {
        columnNames = ["Airplane ID", "Airplane Serial Number", "Manufacturer", "Model"];
    } else if (data[0] == "city") {
        columnNames = ["City ID", "City Name", "Country"];
    } else if (data[0] == "inter_stop") {
        columnNames = ["Flight Number", "Date", "From", "Stop", "To"];
    }


    return columnNames;
}


//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT SENDS THE UPDATED DATA FROM THE ADMIN TO THE BACK FOR THEM TO BE SAVED ON THE DB
//------------------------------------------------------------------------------------------------------------

function sentUpdateToBack() {
    const updateForm = document.querySelector('#updateForm');

    const inputElements = updateForm.querySelectorAll('input');

    const valuesArray = [];

    inputElements.forEach(input => {
        const value = input.value;

        valuesArray.push(value);
    });;


    var updateData = {
        type: "updateData",
        table: data[0],
        data: valuesArray,
    };
    
    console.log(updateData);
    
    $.post('../Forms/back_end/backEnd.php', updateData, function(response) {
        console.log(response.message);
        showResponse(response.message);

    })
}

//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT SHOWS AN APPROPRIATE RESPONSE BASED ON THE BACK END'S RESPONSE
//------------------------------------------------------------------------------------------------------------

function showResponse(changed) {
    const updateForm = document.querySelector('#updateForm');
    updateForm.innerHTML = '';

    const formHeader = document.createElement('header');
    if (changed) {
        formHeader.textContent = "Record was successfully changed!";
    } else {
        formHeader.textContent = "There was a problem updating the chosen record. Remember to keep in mind the order and foreign keys of each table.";
    }

    containerForm.appendChild(formHeader);

}
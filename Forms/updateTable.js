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

//------------------------------------------------------------------------------------------------------------

var requestData = {
    type: "getSpecific",
    id: idData,
    table: data[0]
};

console.log(requestData);

$.get('../Forms/back_end/backEnd.php', requestData, function(response) {
    console.log(response.message);
    setupForm(response.message[0]);
})

$(document).on('click', '#updateRec', function(event) {
    event.preventDefault();
    
    console.log("UPDATE BUTTON PRESSED!");
});

//------------------------------------------------------------------------------------------------------------

// FUNCTION THAT SETS UP THE FROM

function setupForm(responseArr) {
    let col = document.createElement('div');
    col.classList.add('column');
    let counter = 0;    

    var inputArray = []

    var fieldNames = createColumnNames();
    console.log(fieldNames);

    fieldNames.forEach(function(field) {
        console.log(field);
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
        // Access the input field corresponding to the current index (idx)
        const inputField = inputArray[idx];
        
        // Set the value of the input field
        inputField.value = responseArr[key];
        
        // Disable the first input field (if it's the first iteration)
        if (idx === 0) {
            inputField.disabled = true;
        }
        
        // Increment the index for the next iteration
        idx++;
    });
}

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
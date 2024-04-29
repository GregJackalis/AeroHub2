// BASED ON THE BUTTON PRESSED ON THE tableAttempt, an appropriate parameter is sent for the ty pe of table to get from DB

const adminParams = new URLSearchParams(window.location.search);
const tableType = adminParams.get('table');

console.log(tableType);

console.log(tableType);
var requestData = {
    type: "table",
    data: tableType
};

//------------------------------------------------------------------------------------------------------------

// GETTING ALL TABLE ELEMENTS SO THAT THEY CAN BE USED

const columnHeaderRow = document.querySelector('#columnHeaders');
const tableBody = document.querySelector('#tableBody');
const tableHeading = document.querySelector('#tableHeading');

//------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------

// ONE AJAX FUNCTION FOR EACH BUTTON/TABLE

//------------------------------------------------------------------------------------------------------------

// HTTP REQUEST TABLE

$.get('../Forms/back_end/backEnd.php', requestData, function(response) {
    console.log(response.message);
    showInTables(response.message);
})


//------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------

// FUNCTION FOR SHOWING REPLIES DYNAMICALLY FROM BACK END TO TABLES

function showInTables(backendTable) {

    try {
        createHeading(); 

        var columnNames = createColumnNames();
        console.log(columnNames);
    
        columnNames.forEach(function(title) {
            var th = document.createElement("th");
            th.textContent = title;
            columnHeaderRow.appendChild(th);
        });
    
    } catch (Error) {
        console.log("There was an error creating column names and table title: " + Error);
    }

    
    var actionTh = document.createElement("th");
    actionTh.textContent = "Actions";
    columnHeaderRow.appendChild(actionTh);

    backendTable.forEach(function(record){
        var tr = document.createElement("tr");

        Object.keys(record).forEach(function(key) {
            var td = document.createElement("td");
            // Set the data-label attribute to the key (column name)
            td.setAttribute("data-label", key);
            // Set the text content of the td to the value of the corresponding property
            td.textContent = record[key];
            tr.appendChild(td);
        });

        var actionBtns = createUpdateDeleteBtns();

        tr.appendChild(actionBtns);

        tableBody.appendChild(tr);
    });
}

function createUpdateDeleteBtns() {
    // Create the <td> element
    var td = document.createElement("td");
    // Set the data-label attribute
    td.setAttribute("data-label", "#");

    // Create the "Update" link
    var updateLink = document.createElement("a");
    updateLink.href = "#";
    updateLink.classList.add("btn");
    updateLink.id = "updateBtn";
    updateLink.textContent = "Update";

    // Create the "Delete" link
    var deleteLink = document.createElement("a");
    deleteLink.href = "#";
    deleteLink.classList.add("btn");
    deleteLink.id = "deleteBtn";
    deleteLink.textContent = "Delete";

    // Append the <a> elements to the <td> element
    td.appendChild(updateLink);
    td.appendChild(deleteLink);

    return td;
}

function createColumnNames() {
    var columnNames = [];
    if (tableType == "flight") {
        columnNames = ["Flight ID", "Flight Number", "Date", "Departure Time", "Arrival Time", "From", "To", "Plane Serial Number"];
    } else if (tableType == "user") {
        columnNames = ["User ID", "Surname", "Name", "Email", "Address", "Phone"];
    } else if (tableType == "pass_flight") {
        columnNames = ["Passenger ID", "Passenger Surname", "Passenger Name", "Flight Number", "Flight Departure", "From", "To"];
    } else if (tableType == "staff") {
        columnNames = ["Staff ID", "Employee Number", "Surname", "Name", "Address", "Phone", "Salary"];
    } else if (tableType == "flight_crew") {
        columnNames = ["Flight Number", "Employee Number", "Surname", "Name", "Role"];
    } else if (tableType == "pilot_valid") {
        columnNames = ["Plane Serial Number", "Plane Manufacturer", "Qualified", "Employee Number", "Surname", "Name"];
    } else if (tableType == "airplane") {
        columnNames = ["Airplane ID", "Airplane Serial Number", "Manufacturer", "Model"];
    } else if (tableType == "city") {
        columnNames = ["City ID", "City Name", "Country"];
    } else if (tableType == "inter_stop") {
        columnNames = ["Flight Number", "Date", "From", "Stop", "To"];
    }


    return columnNames;
}



// FUNCTION THAT HANDLES AND CREATES APPROPRIATE HEADING FOR EACH TABLE BASED ON THE PARAMETER OF THE PAGE

function createHeading() {
    var spanHeader = document.createElement("span");

    if (tableType == "pass_flight") {
        spanHeader.textContent = "Passengers & Flights Table";
    } else if (tableType == "flight_crew") {
        spanHeader.textContent = "Flight-Crew Table";
    } else if (tableType == "pilot_valid") {
        spanHeader.textContent = "Pilot-Info Table";
    } else if (tableType == "inter_stop") {
        spanHeader.textContent = "Intermediate Stop Table";
    } else {
        spanHeader.textContent = tableType.charAt(0).toUpperCase() + tableType.slice(1) + " Table";
    }
    spanHeader.style.border = "3px solid black";
    spanHeader.style.padding = "15px";
    spanHeader.style.borderRadius = "8px";
    spanHeader.style.backgroundColor = "beige";
    tableHeading.appendChild(spanHeader); 

}
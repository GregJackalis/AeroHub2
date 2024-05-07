// BASED ON THE BUTTON PRESSED ON THE tableAttempt, an appropriate parameter is sent for the ty pe of table to get from DB

const adminParams = new URLSearchParams(window.location.search);
const tableType = adminParams.get('table');

if (tableType == "pass_flight") {
    document.title = "Passengers & Flights Table";
} else if (tableType == "flight_crew") {
    document.title = "Flight-Crew Table";
} else if (tableType == "pilot_valid") {
    document.title = "Pilot-Info Table";
} else if (tableType == "inter_stop") {
    document.title = "Intermediate Stop Table";
} else {
    document.title = tableType.charAt(0).toUpperCase() + tableType.slice(1) + " Table";
}


var columnNames = [];
var spanHeader = document.createElement("span");

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
// HANDLING PARAMETERS FOR UPDATE BUTTONS
//------------------------------------------------------------------------------------------------------------
$(document).on('click', "#up" + tableType, function() {

    var row = $(this).closest("tr");

    var id = [];

    if (tableType == "flight_crew") {
        id.push(row.find("td:first").text());
        id.push(row.find("td:eq(1)").text());
    } else {
        // Find the first column in the row and get its text content
        id.push(row.find("td:first").text());
    }
    
   

    var arrayToSend = [];

    arrayToSend.push(tableType);
    arrayToSend.push(spanHeader.textContent);
    arrayToSend.push(id);

    // Convert the array to JSON string
    var jsonArr = JSON.stringify(arrayToSend);
    
    // Construct the URL with the JSON string as a parameter
    var url = "./updateTable.html?record=" + encodeURIComponent(jsonArr);

    window.location.href = url;
});
   
//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT HANDLES DELETE OPERATION ON THE ADMIN TABLE VIEW PAGE
//------------------------------------------------------------------------------------------------------------
$(document).on('click', "#del" + tableType, function() {

    var row = $(this).closest("tr");

    var id = [];

    if (tableType == "flight_crew") {
        id.push(row.find("td:first").text());
        id.push(row.find("td:eq(1)").text());
    } else {
        // Find the first column in the row and get its text content
        id.push(row.find("td:first").text());
    }
    
    var requestData = {
        type: "delSpecific",
        id: id,
        table: tableType
    };

    console.log(requestData);

    $.post('../Forms/back_end/backEnd.php', requestData, function(response) {
        console.log(response.message);
        
        if (!response.message) {
            alert("There was an error deleting the record. Cannot delete or update a parent row when a foreign key constraint is used");
        } else {
            alert("Record deleted successfully!");
        }
    })
});


//------------------------------------------------------------------------------------------------------------
// HTTP REQUEST TABLE
//------------------------------------------------------------------------------------------------------------
$.get('../Forms/back_end/backEnd.php', requestData, function(response) {
    console.log(response.message);
    showInTables(response.message);
})


//------------------------------------------------------------------------------------------------------------
// FUNCTION FOR SHOWING REPLIES DYNAMICALLY FROM BACK END TO TABLES
//------------------------------------------------------------------------------------------------------------
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
            if (key == "pass_id") {
                td.id = "id";
            }

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


//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT CREATES DYNAMICALLY AN UPDATE AND DELETE BUTTON FOR EACH RECORD BEING SHOWN ON THE TABLE
//------------------------------------------------------------------------------------------------------------
function createUpdateDeleteBtns() {
    // Create the <td> element
    var td = document.createElement("td");
    // Set the data-label attribute
    td.setAttribute("data-label", "#");

    // Create the "Update" link
    var updateLink = document.createElement("a");
    updateLink.href = "#";
    updateLink.classList.add("btn");
    updateLink.classList.add("updateBtn");

    updateLink.id = "up" + tableType;
    updateLink.textContent = "Update";

    // Create the "Delete" link
    var deleteLink = document.createElement("a");
    deleteLink.href = "#";
    deleteLink.classList.add("btn");
    deleteLink.classList.add("deletBtn");

    deleteLink.id = "del" + tableType;
    deleteLink.textContent = "Delete";

    // Append the <a> elements to the <td> element
    td.appendChild(updateLink);
    td.appendChild(deleteLink);

    return td;
}


//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT CREATES COLUMN NAMES THAT ARE USED ON THE TABLE'S COLUMNS
//------------------------------------------------------------------------------------------------------------
function createColumnNames() {
    if (tableType == "flight") {
        columnNames = ["Flight ID", "Flight Number", "Date", "Departure Time", "Arrival Time", "From", "To", "Plane Serial Number"];
    } else if (tableType == "passenger") {
        columnNames = ["Passenger ID", "Surname", "Name", "Email", "Address", "Phone"];
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


//------------------------------------------------------------------------------------------------------------
// FUNCTION THAT HANDLES AND CREATES APPROPRIATE HEADING FOR EACH TABLE BASED ON THE PARAMETER OF THE PAGE
//------------------------------------------------------------------------------------------------------------
function createHeading() {

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
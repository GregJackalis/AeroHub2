const homePageBtn = document.querySelector('#homepageBtn'); // on both pages
const adminBtn = document.querySelector('#adminBtn'); // on customer page
const signUpBtn = document.querySelector('#signUp'); // on customer page
const signInCustomerBtn = document.querySelector('#signIn'); // on customer page
const customerBtn = document.querySelector('#customerBtn'); // on admin page
const signInAdminBtn = document.querySelector('#adminSignInBtn'); // on admin page

var userEmailL = ""; //global variable that will be used later as a parameter to be sent to the home.html pagae


// FOR CUSTOMER SIGN UP
$(function() {
    $("#registerBtn").click(function(event) {
        console.log("register button pressed!!");

        event.preventDefault();

        // Serialize form data
        var formData = $("#registerForm").serialize();
        console.log(formData);

        // Send data to server using AJAX
        $.post('./back_end/backEnd.php', formData, function(response) {
            // console.log(response);
            console.log(response.message);

            // surname, name, email, password, address, phone
            showReply(response, "reg");
        })
    });
});


//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------


// FOR CUSTOMER LOGIN
$(function() {
    $("#loginBtn").click(function(event) {
        console.log("register button pressed!!");

        event.preventDefault();

        userEmailL = $("#l1").val();

        var userPassL = $("#l2").val();

        if (userEmailL === "" || userPassL === "") {
            // show a message back to the front without sending it to the back (Saves resources and time)
            showReply("emp", "log");
        } else {
            var formData = $("#loginForm").serialize();
            console.log(formData);
            $.post('./back_end/backEnd.php', formData, function(response) {
                showReply(response.message, "log");

            })
        }   
    });
});

//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------

// FOR ADMIN LOGIN
$(function() {
    $("#adminSignInBtn").click(function(event) {
        event.preventDefault();

        console.log("admin sign in button pressed!!");

        var adminEm = $("#a1").val();
        var adminPas = $("#a2").val();

        if (adminEm === "" || adminPas === "") {
            // show a message back to the front without sending it to the back (Saves resources and time)
            showReply("emp", "adm");
        } else {
            // Serialize form data
            var formData = $("#adminForm").serialize();
            console.log(formData);

            // Send data to server using AJAX
            $.post('./back_end/backEnd.php', formData, function(response) {
                // console.log(response);
                console.log(response.message);

                // surname, name, email, password, address, phone
                showReply(response.message, "adm");
            })
        }
    });
});

//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------

// FOR SEARCH BAR
$(function() {
    $(".search").click(function(event) {
        console.log("search button pressed!!");

        event.preventDefault();

        var fromPlace = $("#fromPlaceInp").val();
        var toPlace = $("#toPlaceInpt").val();
        var departureDate = $("#fromDateInp").val();
        var contentType = $("#type").val();
        var returnDate = $("#toDateInpt").val(); // this could be null in case user wants to book a one-way ticket
        
        if (fromPlace === "" || fromPlace === $("#fromInput").attr("placeholder") || toPlace === "" || toPlace === $("#toInput").attr("placeholder") || departureDate === "") {
            // Show a message indicating required fields are empty
            showReply("emp", "search");
        } else {
            var requestData = {
                fromPlace: fromPlace,
                toPlace: toPlace,
                departureDate: departureDate,
                type: contentType,
                returnDate: returnDate
            };

            $.get('../Forms/back_end/backEnd.php', requestData, function(response) {
                console.log(response.message);
                var flightsReturned  = response.message;

                // if (response.message !== false) {
                //     flightsReturned.forEach(function(flight) {
                //         console.log("Flight ID:", flight.id);
                //         console.log("Flight Number:", flight.flightNum); // important
                //         console.log("Origin:", flight.origin); // important
                //         console.log("Destination:", flight.dest); // important
                //         console.log("Date:", flight.date); // important
                //         console.log("Dep Time:", flight.dep_time); // important
                //         console.log("Arr Time:", flight.arr_time); // important
    
                //     });
                // }

                if (flightsReturned.length === 0) {
                    showReply(false, "search");
                } else {
                    showReply(flightsReturned, "search");
                    createBookButton();
                }
            });
        }

    });
});

//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------

function showReply(backRes, type) {

    if (type == "reg") {
        var formR = document.getElementById("registerForm");

        var removedElements = [];
    
        while (formR.firstChild) {
            removedElements.push(formR.removeChild(formR.firstChild));
        }
    
        if (backRes.status == "credEr") {
            const falseIndices = [];
    
            for (let i = 0; i < backRes.message.length; i++) {
                const subArray = backRes.message[i];
                const hasFalse = subArray.some(([_, value]) => value === false);
                if (hasFalse) {
                    falseIndices.push(i);
                }
            }
    
            // falseIndices: [0, 1, 2, 3, 4, 5] => surname, name, email, password, address, phone
    
            var messagesArr = ["Surname should not contain any special characters or be empty", "Name should not contain any special characters or be empty", 
            "Invalid Email Format", 
            "Password should have upper case and lower case characters, a number, a special character, and at least 8 caharacters long", 
            "Address should not be empty", "Invalid Phone Number"];
    
            for (const key of falseIndices) {
    
                var spanMessage = document.createElement("span");
                spanMessage.textContent = "• " + messagesArr[key]; // Use the current message in the array
                formR.appendChild(spanMessage);
    
                // Line break for each bullet/message pair
                formR.appendChild(document.createElement("br"));
            }
                
    
            var showFormBtn = document.createElement("button");
            showFormBtn.id = "registerBtn";
            showFormBtn.textContent = "Show Form";
            
            showFormBtn.addEventListener('click', function(event) {
                event.preventDefault();
                reappearElements(formR, removedElements);
            });
    
            formR.appendChild(showFormBtn);
    
    
        } else if (backRes.status == "sucIns") {
            var spanMessage1 = document.createElement("span");
            spanMessage1.textContent = "Registered Successfully!"; // Use the current message in the array
    
            var spanMessage2 = document.createElement("span");
            spanMessage2.textContent = "You will be redirected to the home page in 5 seconds..."

            homePageBtn.disabled = true;
            adminBtn.disabled = true;
            signInCustomerBtn.disabled =  true;
            
    
            formR.appendChild(spanMessage1);

            formR.appendChild(document.createElement("br"));

            formR.appendChild(spanMessage2);
    
            var arrayToSend = [];

            arrayToSend.push(true);
            arrayToSend.push(backRes.message[0]);
            console.log(userEmailL);
            arrayToSend.push(backRes.message[1]);


            // Convert the array to JSON string
            var jsonArr = JSON.stringify(arrayToSend);
    
            setTimeout(() => {
                window.location.href = "../Home/home.html?logged=" + encodeURIComponent(jsonArr);
            }, 5000);                

        }

//-----------------------------------------------------------------------------------------------------------------------------------------
    // FOR SEARCH PROCESS
    } else if (type == "search") {
        
        var resultField = document.querySelector('.check');

        while (resultField.firstChild) {
            resultField.removeChild(resultField.firstChild);
        }

        var listEl = document.createElement('ul');
        listEl.style.listStyleType = 'none'; // Remove bullet points
        listEl.style.padding = '0'; // Remove default padding
        listEl.style.display = 'flex'; // Set display to flex
        var responseEl = document.createElement('li');

        if (backRes == "emp") {
            responseEl.textContent = "We can't find you a flight with no help! Please provide some details!";
        } else if (backRes == "sucBook") {
            responseEl.textContent = "You have successfully booked a ticket for this flight!";
        } else if (backRes == "failBook") {
            responseEl.textContent = "You have already booked a flight!";
        } else {
            if (backRes == false) {
                responseEl.textContent = "You might want to adjust your search criteria; no flights were found matching your destination and date selection.";    
            } else {
                responseEl.textContent = "We have found you " + backRes.length + " flight(s)!";
    
                var info = [];
                backRes.forEach(function(flight) {
                    info.push(flight.flightNum); // important
                    info.push(flight.origin); // important
                    info.push(flight.dest); // important
                    info.push(flight.date); // important
                    info.push(flight.dep_time); // important
                    info.push(flight.arr_time); // important
                });
    
                var responseEl2 = document.createElement('li');

                responseEl2.textContent = `It's the flight ${info[0]} on ${info[3]}, departing at ${info[4]} and arriving at ${info[5]},
                and it takes you from ${info[1]} to  ${info[2]}`;
            }
        }

        listEl.appendChild(responseEl);

        resultField.appendChild(listEl);

        if (responseEl2) {
            var flightField = document.createElement('ul')
            flightField.appendChild(responseEl2);

            resultField.appendChild(flightField);
        }


//-----------------------------------------------------------------------------------------------------------------------------------------
        // FOR LOGIN RESPONSE
    } else {
        var spanMessage = document.createElement("span");
        var removedElements = [];
        var messages = ["• Missing Credentials!", "• Invalid Credentials!", "• Welcome back, Mr/Mrs "];


        if (type == "log") {

            var formL = document.getElementById("loginForm");
        
            while (formL.firstChild) {
                removedElements.push(formL.removeChild(formL.firstChild));
            }
    
            var showFormBtn = document.createElement("button");
            showFormBtn.id = "registerBtn";
            showFormBtn.textContent = "Show Form";
            
            showFormBtn.addEventListener('click', function(event) {
                event.preventDefault();
                reappearElements(formL, removedElements);
            });
    
            if (backRes == "emp") {
                spanMessage.textContent = messages[0]; 
                formL.appendChild(spanMessage);
    
                formL.appendChild(document.createElement("br"));
                formL.appendChild(showFormBtn);
    
            } else if (backRes == "logErr") {
                spanMessage.textContent = messages[1]; 
                formL.appendChild(spanMessage);
    
                formL.appendChild(document.createElement("br"));
                formL.appendChild(showFormBtn);
    
            } else {
                console.log(backRes);
                spanMessage.textContent = messages[2] + backRes; 
                formL.appendChild(spanMessage);
    
                var spanMessage2 = document.createElement("span");
                spanMessage2.textContent = "You will be redirected to the home page in 5 seconds..."
    
                homePageBtn.disabled = true;
                adminBtn.disabled = true;
                signUpBtn.disabled =  true;
                
                
                formL.appendChild(spanMessage);
                formL.appendChild(document.createElement("br"));
    
                formL.appendChild(spanMessage2);

                var arrayToSend = [];

                arrayToSend.push(true);
                arrayToSend.push(backRes);
                console.log(userEmailL);
                arrayToSend.push(userEmailL);


                // Convert the array to JSON string
                var jsonArr = JSON.stringify(arrayToSend);
        
                setTimeout(() => {
                    window.location.href = "../Home/home.html?logged=" + encodeURIComponent(jsonArr);
                }, 5000);                


            }        
        
//-----------------------------------------------------------------------------------------------------------------------------------------

            // ADMIN LOGIN
        } else if (type == "adm") {

            var formAdm = document.getElementById("adminForm");
        
            while (formAdm.firstChild) {
                removedElements.push(formAdm.removeChild(formAdm.firstChild));
            }
    
            var showFormBtn = document.createElement("button");
            showFormBtn.id = "adminSignInBtn";
            showFormBtn.textContent = "Show Form";
            
            showFormBtn.addEventListener('click', function(event) {
                event.preventDefault();
                reappearElements(formAdm, removedElements);
            });

            // ADMIN INVALID CREDS
            if (backRes == "emp") {
                spanMessage.textContent = messages[0]; 
                formAdm.appendChild(spanMessage);
                formAdm.appendChild(document.createElement("br"));
                formAdm.appendChild(showFormBtn);
            } else if (backRes === "logErr") {
                spanMessage.textContent = messages[1]; 
                formAdm.appendChild(spanMessage);
                formAdm.appendChild(document.createElement("br"));
                formAdm.appendChild(showFormBtn);

            } else {

                spanMessage.textContent = messages[2] + backRes;
                
                var spanMessage2 = document.createElement("span");
                spanMessage2.textContent = "You will be redirected to the home page in 5 seconds..."
    
                homePageBtn.disabled = true;
                customerBtn.disabled = true;
                signInAdminBtn.disabled =  true;
                
        
                formAdm.appendChild(spanMessage);
    
                formAdm.appendChild(document.createElement("br"));
    
                formAdm.appendChild(spanMessage2);

                setTimeout(() => {
                    window.location.href = "../Home/adminPage.html?backRes=" + encodeURIComponent(backRes);
                }, 5000);                

            }

        }
    }

}

function reappearElements(form, elements) {
    while (form.firstChild) {
        form.removeChild(form.firstChild);
    }

    elements.forEach(function(element) {
        form.appendChild(element);
    });
}

function createBookButton() {

    const searchDiv = document.querySelector('.status');
    searchDiv.style.height = "200px";

    const bookBtn = document.createElement('button');
    bookBtn.id = "homepageBtn";
    bookBtn.textContent = "Press here to book!";

    searchDiv.append(bookBtn);

    // meaning visitor hasnt singed in or has created an account
    if (window.location.search === "") {    
        bookBtn.addEventListener('click', function() {
            alert("You need to be Signed In first in order to book a flight!");
        });
    } else {
        bookBtn.addEventListener('click', function() {
            const btnParams = new URLSearchParams(window.location.search);

            const paramArrString = btnParams.get('logged');
            const paramArr = JSON.parse(paramArrString);

            const surname = paramArr[1];
            const email = paramArr[2];

            var requestData = {
                type: "bookPassenger",
                surname: surname,
                email: email
            };

            console.log(requestData);

            $.post('../Forms/back_end/backEnd.php', requestData, function(response) {
                console.log(response.message);

                if (response.message) {
                    showReply("sucBook", "search");
                } else {
                    showReply("failBook", "search");
                }
            });
        });
    }
}
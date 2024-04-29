<?php

    declare(strict_types=1); // using this php enables a strict mode in which data types are checked

    spl_autoload_register(function ($class) {
        require __DIR__ . "/$class.php";
    }); // autoloader for requiring files that have the same name as the class inside them

    include 'get_env.php';

    set_exception_handler("ErrorHandler::handleException"); 


    // header("Content-type: application/json; charset=UTF-8"); 
    $response = array(
        "status" => "hello",
        "message" => "hello front"
    );


// ------------------------------------------------------------------------------------------------------------------------


    $request_method = $_SERVER['REQUEST_METHOD'];
    $db_Data = get_env_data('db');
    
    // ------------------------------------------------------------------------------------------------------------------------
    // Setting up connection with database
    
    $dbObj = new ConnectionDatabase($db_Data); // PDO type variable used for sending queries to the DB

    $checkConn = $dbObj->checkConn(); 


    // ------------------------------------------------------------------------------------------------------------------------
    // Testing if PDO-type variable is working
    // $sql = "SELECT * FROM users";

    // $stmt = $conn->prepare($sql);
    // $stmt->execute();

    // $response["message"] = $stmt->fetchAll(PDO::FETCH_ASSOC);


    if ($checkConn) {
        $response["status"] = "success";
        $response["message"] = "successfully connected to DB";
    } else{
        $response["status"] = "error";
        $response["message"] = "could NOT connect to DB";
    }

    // ------------------------------------------------------------------------------------------------------------------------
    // ACTUAL HTTP REQUEST HANDLING


    // Check if the request method is POST
    if ($request_method === 'POST' && $checkConn) {

        $actionType = $_POST['type'];

        if ($actionType == "customerRegister") {
            // in here there will be code that checks specifically credentials from the customer form

            // surname, name, email, password, address, phone
            $registerCred = [ $_POST['userSurnameR'],  $_POST['userNameR'], $_POST['userEmailR'], $_POST['userPassR'], $_POST['userAddressR'], $_POST['userPhoneR']];

            $validation = new ValidationFunctions(); // this object will be used to validate the data that is passed 
            

            $validatedArr = $validation->validateArray($registerCred);
            
            if ($validatedArr === true) {

                $insertion = $dbObj->insert_into_users($registerCred);
                
                if ($insertion) {
                    $response["status"] = "sucIns";
                    $response["message"] = "Registered Successfully!";
                } else {
                    $response["status"] = "errIns";
                    $response["message"] = "Problem inserting to DB";
                }

            } else {

                $response["status"] = "credEr";
                $response["message"] = [];

                foreach ($validatedArr as $subArr) {
                    $response["message"][] = [$subArr];
                }
            }

        } else {

            if ($actionType == "customerLogin") {
                $emailL = $_POST['userEmailL'];
                $passL = $_POST['userPassL'];

                $loginResponse = $dbObj->checkLogin($emailL, $passL, "user"); 

            } else if ($actionType == "adminLogin") {
                $emailAdmin = $_POST['adminEmail'];
                $passAdmin = $_POST['adminPassword'];

                $loginResponse = $dbObj->checkLogin($emailAdmin, $passAdmin, "admin"); 
            }

            if ($loginResponse == false) {
                // no records found with the email given, or invalid password
                $response["status"] = "error";
                $response["message"] = "logErr";
            } else {
                // valid credentials, $res = surname of user
                $response["status"] = "success";
                $response["message"] = $loginResponse;
            }
        }

    } else if ($request_method === 'GET' && $checkConn) {

        $actionType = $_GET['type'];

        if ($actionType == "table") {
            $tableType = $_GET['data'];

            $queryResult = $dbObj->getAll($tableType);;

            foreach ($queryResult as &$row) {
                if ($row['password']) {
                    unset($row['password']);
                }
            }

            $response["message"] = $queryResult;

        } else if ($actionType == "searchFlight") {

            $flightQuery = [$_GET['fromPlace'], $_GET['toPlace'], $_GET['departureDate'], $_GET['returnDate']];
            $response["status"] = "success";
            $response["message"] = "I got the thingies!";

            $results = $dbObj->getFlights($flightQuery);

            $response["message"] = $results;
        } else if ($actionType == "getSpecific") {

            $idToGet = $_GET['id'];
            $tableType = $_GET['table'];

            $queryResult = $dbObj->getSpecific($idToGet, $tableType);

            foreach ($queryResult as &$row) {
                if ($row['password']) {
                    unset($row['password']);
                }
            }

            $response["message"] = $queryResult;
        }

    } else {
        $response["status"] = "error";
        $response["message"] = "there was an error connecting to the database. Null returned from the variable that is supposed to hold the connection";
    }

    
    header("Content-type: application/json; charset=UTF-8"); 
    echo json_encode($response);
    exit;

?>
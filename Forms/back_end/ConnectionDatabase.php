<?php
    class ConnectionDatabase {
        private ?PDO $db_conn = null;

        // constructor function that is called by default when a class object is made
        // this function calls the connectToDatabase() function in order to establish a connection with the database
        public function __construct(array $data) {
            $this->connectToDatabase($data);
        }

//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

        // function that is called from the constructor function and it establishes and creates a PDO object
        // which is used for all sorts of operations with the database
        private function connectToDatabase($data) : void { 
            $dsn = "mysql:host={$data[0]}; dbname={$data[3]}; charset=utf8";
    
            try {
                $this->db_conn = new PDO($dsn, $data[1], $data[2]);
            } catch (Exception $e) {
                $this->db_conn = null;
            }
        }

//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

        // this function is used to check whether a connection with the database has been established or not
        public function checkConn(): bool { //
            if ($this->db_conn == null) {
                return false; 
            } else {
                return true;
            }
        }
        
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function used to insert a user to the database, this is used when a register process of a customer is happening at the front
        public function insertIntoUsers(array $infoToAdd): bool {

            $sql = "INSERT INTO user (surname, name, email, password, address, phone) VALUES (?, ?, ?, ?, ?, ?)";

            $stmt = $this->db_conn->prepare($sql);

            foreach ($infoToAdd as $key => $value) {
                $stmt->bindValue($key + 1, $value, PDO::PARAM_STR);
            }

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return true;
            } else {
                return false;
            }
        }

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function that checks the login credentials a user has given at the front
        public function checkLogin($email, $pass, $name): bool | string {
            $sql = "SELECT email, password, surname FROM $name WHERE email = ?";
            
            $stmt = $this->db_conn->prepare($sql);
            
            $stmt->bindValue(1, $email, PDO::PARAM_STR);

            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);


            if ($row === false) {
                return false;
            } else {
                // Row found, check password
                if ($row["password"] == $pass) {
                    // Passwords match, return the surname
                    return $row["surname"];
                } else {
                    return false;
                }
            }
        }
        
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function that gets all flights, this is used on the search feature
        public function getFlights(array $flightQuery): array {

            $sql = "SELECT city_id FROM city WHERE name IN (?, ?);";

            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $flightQuery[0], PDO::PARAM_STR);
            $stmt->bindValue(2, $flightQuery[1], PDO::PARAM_STR);

            $stmt->execute();

            $cityIds = []; // Array to store city IDs

            // Fetch all city IDs
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $cityIds[] = $row['city_id'];
            }

            // Prepare the second query
            $sql = "SELECT * FROM flight WHERE origin_id = ? AND dest_id = ? AND date = ?";
            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $cityIds[0], PDO::PARAM_INT);
            $stmt->bindValue(2, $cityIds[1], PDO::PARAM_INT);
            $stmt->bindValue(3, $flightQuery[2], PDO::PARAM_STR);

            $stmt->execute();

            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $results;
        }


// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function that is used on the table view page of the admin's type user
        // it uses a number of inter-connected queries in order to retrieve the correct data
        // in the correct format while alsp taking into consideration all the foreign key constraints inside the database
        public function getAll(string $name): array {
            if ($name == "pass_flight") {
                $sql = "SELECT 
                            pf.pass_id,
                            p.surname,
                            p.name,
                            f.flightNum,
                            f.date,
                            origin_city.name AS origin_city,
                            dest_city.name AS dest_city
                        FROM 
                            pass_flight pf
                        JOIN 
                            passenger p ON pf.pass_id = p.pass_id
                        JOIN 
                            flight f ON pf.flightNum = f.flightNum
                        JOIN 
                            city origin_city ON f.origin_id = origin_city.city_id
                        JOIN 
                            city dest_city ON f.dest_id = dest_city.city_id;
                        ";
            } else if ($name == "flight") {
                $sql = "SELECT 
                            f.flight_id,
                            f.flightNum,
                            f.date,
                            f.dep_time,
                            f.arr_time,
                            origin_city.name AS origin_city,
                            dest_city.name AS dest_city,
                            f.serNum
                        FROM 
                            flight f
                        JOIN 
                            city origin_city ON f.origin_id = origin_city.city_id
                        JOIN 
                            city dest_city ON f.dest_id = dest_city.city_id;
                        ";
            } else if ($name == "flight_crew") {
                $sql = "SELECT 
                            fc.flightNum,
                            s.empNum,
                            s.surname,
                            s.name,
                            fc.role
                        FROM 
                            flight_crew fc
                        JOIN 
                            staff s ON fc.empNum = s.empNum;
                        ";
            } else if ($name == "pilot_valid") {
                $sql = "SELECT 
                            pv.serNum,
                            a.manufacturer,
                            pv.rating,
                            pv.empNum,
                            s.surname,
                            s.name
                        FROM 
                            pilot_valid pv
                        JOIN 
                            airplane a ON pv.serNum = a.serNum
                        JOIN 
                            staff s ON pv.empNum = s.empNum;
                        ";
            } else if ($name == "inter_stop") {
                $sql = "SELECT 
                            ist.flightNum,
                            f.date,
                            origin_city.name AS origin_city,
                            city.name AS inter_stop_city,
                            dest_city.name AS dest_city
                        FROM 
                            inter_stop ist
                        JOIN 
                            flight f ON ist.flightNum = f.flightNum
                        JOIN 
                            city origin_city ON f.origin_id = origin_city.city_id
                        JOIN 
                            city dest_city ON f.dest_id = dest_city.city_id
                        JOIN 
                            city ON ist.city_id = city.city_id;
                        ";
            } else {
                $sql = "SELECT * FROM $name";
            }

            $stmt = $this->db_conn->prepare($sql);

            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $result;
        }

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function used on the admin's update page in order to get a specific record
        // based on the type of the table the appropriate query is made and sent to the database
        public function getSpecific(array $idArr, string $tableName): array {

            $idFirst = $idArr[0];

            if (count($idArr) > 1) {
                $idSecond = $idArr[1];
            }

            if ($tableName == "passenger") {
                $idName = "pass_id";
            } else if ($tableName == "flight") {
                $idName = "flight_id";
            } else if ($tableName == "staff") {
                $idName = "staff_id";
            } else if ($tableName == "airplane") {
                $idName = "plane_id";
            } else if ($tableName == "city") {
                $idName = "city_id";

// --------------------------------------------------------------------------------------------------------

            } else {

                if ($tableName == "pass_flight") {
                    $sql = "SELECT 
                            pf.pass_id,
                            p.surname,
                            p.name,
                            f.flightNum,
                            f.date,
                            origin_city.name AS origin_city,
                            dest_city.name AS dest_city
                        FROM 
                            pass_flight pf
                        JOIN 
                            passenger p ON pf.pass_id = p.pass_id
                        JOIN 
                            flight f ON pf.flightNum = f.flightNum
                        JOIN 
                            city origin_city ON f.origin_id = origin_city.city_id
                        JOIN 
                            city dest_city ON f.dest_id = dest_city.city_id
                        WHERE pf.pass_id = ?;
                        ";

                    $stmt = $this->db_conn->prepare($sql);

                    $stmt->bindValue(1, $idFirst, PDO::PARAM_INT);

                } else if ($tableName == "flight_crew") {
                    $sql = "SELECT 
                                fc.flightNum,
                                s.empNum,
                                s.surname,
                                s.name,
                                fc.role
                            FROM 
                                flight_crew fc
                            JOIN 
                                staff s ON fc.empNum = s.empNum
                            WHERE fc.flightNum = ? AND fc.empNum = ?;
                            ";
                    $stmt = $this->db_conn->prepare($sql);

                    $stmt->bindValue(1, $idFirst, PDO::PARAM_INT);
                    $stmt->bindValue(2, $idSecond, PDO::PARAM_INT);

                } else if ($tableName == "pilot_valid") {
                    $sql = "SELECT 
                                pv.serNum,
                                a.manufacturer,
                                pv.rating,
                                pv.empNum,
                                s.surname,
                                s.name
                            FROM 
                                pilot_valid pv
                            JOIN 
                                airplane a ON pv.serNum = a.serNum
                            JOIN 
                                staff s ON pv.empNum = s.empNum
                            WHERE pv.serNum = ?;
                            ";

                    $stmt = $this->db_conn->prepare($sql);

                    $stmt->bindValue(1, $idFirst, PDO::PARAM_STR);
                    
                } else if ($tableName == "inter_stop") {
                    $sql = "SELECT 
                                ist.flightNum,
                                f.date,
                                origin_city.name AS origin_city,
                                city.name AS inter_stop_city,
                                dest_city.name AS dest_city
                            FROM 
                                inter_stop ist
                            JOIN 
                                flight f ON ist.flightNum = f.flightNum
                            JOIN 
                                city origin_city ON f.origin_id = origin_city.city_id
                            JOIN 
                                city dest_city ON f.dest_id = dest_city.city_id
                            JOIN 
                                city ON ist.city_id = city.city_id
                            WHERE ist.flightNum = ?
                            ";

                    $stmt = $this->db_conn->prepare($sql);

                    $stmt->bindValue(1, $idFirst, PDO::PARAM_STR);
                }

                $stmt->execute();

                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                return $result;
            }

// --------------------------------------------------------------------------------------------------------


            $sql = "SELECT * FROM $tableName WHERE $idName = ?";

            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $idFirst, PDO::PARAM_INT);

            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $result;
        }


// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // this function is used on the update process of the page
        // i followed this approach in which columns are selected based on the table name
        // and then through using that AND the data passed from the front, a dynamic and correctly-formatted
        // sql query command is made to be sent to the database
        public function updateTable(array $data, string $tableName): bool {
            $sql = "SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name = ?
                    LIMIT 0, 25;
                    ";

            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $tableName, PDO::PARAM_STR);

            $stmt->execute();

            $columnNames = $stmt->fetchAll(PDO::FETCH_ASSOC); // this will have the same number of elements as the $data array

// --------------------------------------------------------------------------------------------------------

            $setClauses = [];

            $columns = array_slice($columnNames, 1);

            $filteredColumns = array_filter($columns, function($column) {
                return $column['column_name'] !== 'password';
            });
            
            $columns = array_values($filteredColumns);
            $values = array_slice($data, 1);

            $setClauses = [];

            foreach ($columns as $index => $column) {
                $setClauses[] = $column['column_name'] . ' = :value' . $index;
            }
            
            $setClause = implode(', ', $setClauses);            

            $idCol = $columnNames[0]['column_name'];

            // Construct the SQL update query
            $sql = "UPDATE $tableName SET $setClause WHERE $idCol = :idVal;";

            $stmt = $this->db_conn->prepare($sql);

            foreach ($values as $index => $value) {
                $stmt->bindValue(':value' . $index, $value);
            }

            $stmt->bindValue(':idVal', $data[0], PDO::PARAM_INT);

            $stmt->execute();

            $rowsChanged = $stmt->rowCount();

            if ($rowsChanged > 0) {
                return true;
            } else {
                return false;
            }
        }

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function used in order to delete a record, this is used when the admin presses the "DELETE" button on a record
        // on the table view page
        public function deleteRec(array $id, string $tableName): string {
            $sql = "SELECT column_name
            FROM information_schema.columns
            WHERE table_name = ?
            LIMIT 0, 25;
            ";

            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $tableName, PDO::PARAM_STR);

            $stmt->execute();

            $columnNames = $stmt->fetchAll(PDO::FETCH_ASSOC); // this will have the same number of elements as the $data array

            $sql = "DELETE FROM $tableName
            WHERE {$columnNames[0]['column_name']} = ?";

            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $id[0], PDO::PARAM_STR);

            try {
                $stmt->execute();
                return true;
            } catch (Exception $e) {
                return false;
            }
        }

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

        // function used for the case when a passenger has successfully logged in or registered, a flight has successfully been found
        // and the book flight button is pressed at the front
        // this function gets the user's details and basically tranfers them to the passenger table
        public function bookPassenger(string $surname, string $email): bool {

            $sql = "SELECT * FROM passenger WHERE surname = ? AND email = ?";
            $stmt = $this->db_conn->prepare($sql);
            
            $stmt->bindValue(1, $surname, PDO::PARAM_STR);
            $stmt->bindValue(2, $email, PDO::PARAM_STR);

            $stmt->execute();

            $userDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($userDetails) {
                return false;
            } else {

                $sql = "SELECT * FROM user WHERE surname = ? AND email = ?";

                $stmt = $this->db_conn->prepare($sql);
                
                $stmt->bindValue(1, $surname, PDO::PARAM_STR);
                $stmt->bindValue(2, $email, PDO::PARAM_STR);
    
                $stmt->execute();
    
                $userDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    
                $sql = "INSERT INTO passenger (pass_id, surname, name, email, password, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
                $stmt = $this->db_conn->prepare($sql);
    
                foreach ($userDetails as $user) {
                    $stmt->bindValue(1, $user['user_id'], PDO::PARAM_INT);
                    $stmt->bindValue(2, $user['surname'], PDO::PARAM_STR);
                    $stmt->bindValue(3, $user['name'], PDO::PARAM_STR);
                    $stmt->bindValue(4, $user['email'], PDO::PARAM_STR);
                    $stmt->bindValue(5, $user['password'], PDO::PARAM_STR);
                    $stmt->bindValue(6, $user['address'], PDO::PARAM_STR);
                    $stmt->bindValue(7, $user['phone'], PDO::PARAM_STR);
                    $stmt->execute();
                }
    
            
                // Check if any rows were inserted
                return $stmt->rowCount() > 0;
            }
        }

           

    }

?>
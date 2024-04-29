<?php
    class ConnectionDatabase {
        private ?PDO $db_conn = null;

        public function __construct(array $data) {
            $this->connect_to_database($data);
        }

        // Database Functions for DB Operations

        private function connect_to_database($data) : void { 
            $dsn = "mysql:host={$data[0]}; dbname={$data[3]}; charset=utf8";
    
            try {
                $this->db_conn = new PDO($dsn, $data[1], $data[2]);
            } catch (Exception $e) {
                $this->db_conn = null;
            }
        }

        // using a getter function because the PDO object is a private property, for now (21/04) i will be using this function in the main
        // backEnd.php file, but later this function might be used from another class for a more dynamic and secure approach
        public function checkConn(): bool { // function can return either nullable-type or pdo-type data
            if ($this->db_conn == null) {
                return false; 
            } else {
                return true;
            }
        }

        public function insert_into_users(array $infoToAdd): bool {

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

        public function checkLogin($email, $pass, $name): bool | string {
            // Use prepared statement to prevent SQL injection
            $sql = "SELECT email, password, surname FROM $name WHERE email = ?";
            
            $stmt = $this->db_conn->prepare($sql);
            
            $stmt->bindValue(1, $email, PDO::PARAM_STR);

            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);


            if ($row === false) {
                // No rows found, return 'rec'
                return false;
            } else {
                // Row found, check password
                if ($row["password"] == $pass) {
                    // Passwords match, return the surname
                    return $row["surname"];
                } else {
                    // Passwords don't match, return 'inv'
                    return false;
                }
            }
        }

        public function getFlights($flightQuery): array {
            // from, to, depDate, returnDate
            $sql = "SELECT * FROM flight WHERE origin = ? AND dest = ? AND date = ?";

            $stmt = $this->db_conn->prepare($sql);

            $stmt->bindValue(1, $flightQuery[0], PDO::PARAM_STR);
            $stmt->bindValue(2, $flightQuery[1], PDO::PARAM_STR);
            $stmt->bindValue(3, $flightQuery[2], PDO::PARAM_STR);

            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $result;

        }

        public function getAll($name): array {
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
    }
?>
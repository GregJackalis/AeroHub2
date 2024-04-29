<?php

    class ValidationFunctions {

        public function validateArray(array $strData): bool | array {
            
            // surname, name, email, password, address, phone
            $validData = [
                $this->setup_data($strData[0]), // surname
                $this->setup_data($strData[1]), // name
                $this->setup_data($strData[2]), // email, doesn't affect @ symbol and others on emails
                $this->setup_data($strData[3]), // password
                $this->setup_data($strData[4]), // address, doesn't affect dots and spaces on the addresses
                $this->setup_data($strData[5])  // phone
            ];
            
            $isValid = [];
            
            // Define checking functions and their corresponding indices
            $checkingFunctions = [
                'checking_username',
                'checking_username',
                'checking_email',
                'checking_password',
                'emptyCheck',
                'checking_tel'
            ];
            
            // Iterate over validData and checkingFunctions simultaneously
            for ($i = 0; $i < count($validData); $i++) {
                $isValid[$i] = [
                    $validData[$i],
                    ($checkingFunctions[$i] !== '') ? $this->{$checkingFunctions[$i]}($validData[$i]) : null
                ];
            }

            if ($this->checkArray($isValid)) {
                return true;
            } else {
                return $isValid;
            }    
        }

        private function checkArray(array $arr): bool {
            foreach ($arr as $data) {
                if ($data[1] === false) {
                    return false;
                }
            }

            return true;
        }

        private function setup_data(string $data): string {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

        private function emptyCheck(string $variable): bool {
            if (empty($variable)) {
                return false;
            } else {
                return true;
            }
        }
    
        
    // ------------------------------------------------------------------------------------------------------------------------


        // VALIDATION FUNCTIONS 
        private function checking_email(string $email_value): bool{
            if (empty($email_value)) {
                return false;
            } elseif (!filter_var($email_value, FILTER_VALIDATE_EMAIL)) {
                return false;
            } else {
                return true;
            }
            // need to also add the case where the email is checked for whether it already exists in the database
        }

        private function checking_tel(string $tel): bool {
            $intTel = (int)$tel;

            if ((string)$intTel == $tel) {
                return true;
            } else {
                return false;
            }
        }
    
        private function checking_username(string $username_value): bool {
            if (empty($username_value)) {
                return false;
            } elseif (!preg_match("/^[a-zA-Z]*$/", $username_value)) {
                return false;
            } else {
                return true;
            }
            // just like the email checking function, in the future i will need to add an if statement
            // for the case the username is already used by another user (this will be done with query
            // of course)
        }
    
        private function checking_password(string $password_value): bool{
            $uppercase = preg_match('@[A-Z]@', $password_value);
            $lowercase = preg_match('@[a-z]@', $password_value);
            $number = preg_match('@[0-9]@', $password_value);
            $specialChars = preg_match('@[^\w]@', $password_value);
    
            if (!$uppercase || !$lowercase || !$number || !$specialChars || strlen($password_value) < 8) {
                // 'Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.';
                return false;
            } else {
                return true;
            }
        }

    }
    
    
?>
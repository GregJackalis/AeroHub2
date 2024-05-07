<?php

    class ValidationFunctions {

        // function that uses all of the private functions in this class in order to correctly validate credentials
        // and data in general given by users on the front end
        public function validateArray(array $strData): bool | array {
            
            // surname, name, email, password, address, phone
            $validData = [
                $this->setupData($strData[0]), // surname
                $this->setupData($strData[1]), // name
                $this->setupData($strData[2]), // email, doesn't affect @ symbol and others on emails
                $this->setupData($strData[3]), // password
                $this->setupData($strData[4]), // address, doesn't affect dots and spaces on the addresses
                $this->setupData($strData[5])  // phone
            ];
            
            $isValid = [];
            
            // Define checking functions and their corresponding indices
            $checkingFunctions = [
                'checkingUsername',
                'checkingUsername',
                'checkingEmail',
                'checkingPassword',
                'emptyCheck',
                'checkingTel'
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

        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------

        // based whether a validation check returned false, the array sent to this function checks if a false value is included
        // and based on the result of this check an appropriate response is made
        private function checkArray(array $arr): bool {
            foreach ($arr as $data) {
                if ($data[1] === false) {
                    return false;
                }
            }

            return true;
        }

        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------

        // function that sets up data by triming them and removing any special characters
        private function setupData(string $data): string {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------

        // function that checks if a value is empty
        private function emptyCheck(string $variable): bool {
            if (empty($variable)) {
                return false;
            } else {
                return true;
            }
        }
        
    // ------------------------------------------------------------------------------------------------------------------------


        // VALIDATION FUNCTIONS 

        // function that checks if a value is of email type
        private function checkingEmail(string $email_value): bool{
            if (empty($email_value)) {
                return false;
            } elseif (!filter_var($email_value, FILTER_VALIDATE_EMAIL)) {
                return false;
            } else {
                return true;
            }
            // need to also add the case where the email is checked for whether it already exists in the database
        }

        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------

        // function that checks if a value can be translated to an int, so if its possible to be saved as a telephone number
        private function checkingTel(string $tel): bool {
            $intTel = (int)$tel;

            if ((string)$intTel == $tel) {
                return true;
            } else {
                return false;
            }
        }
    
        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------

        // with the usage of regex, values are checked in here to see if it matches the specified format
        // me personally I haven't used any numbers or underscores so that the users won't give any strange un-official names
        // or nicknames
        private function checkingUsername(string $username_value): bool {
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
    
        //------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------
        
        // function that checks if the password given has at least one uppercase, one lowercase, one number, one special Character,
        // and is 8 characters long at least all together
        private function checkingPassword(string $password_value): bool{
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
<?php

class ErrorHandler {
    public static function handleException(Throwable $exception): array {
        // this function will be used in order to translate the exception that is thrown (thus the Throwable data type)
        // from HTML code to json format

        // http_response_code(500); // even though postman shows this automatically, it is a good practice to define it
        
        header("Content-type: application/json; charset=UTF-8"); 
        echo json_encode ([
            "code" => $exception->getCode(),
            "message" => $exception->getMessage(),
            "file" => $exception->getFile(),
            "line" => $exception->getLine()
        ]); // all of the above methods are built-in on the Throwable object
        exit;
        
    }
}

?>
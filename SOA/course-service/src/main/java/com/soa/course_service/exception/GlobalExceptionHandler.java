package com.soa.course_service.exception;

import com.soa.course_service.dto.RestResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = BadRequestException.class)
    public ResponseEntity<RestResponse<Object>> handleBadRequestException(
            BadRequestException ex) {

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(ex.getMessage());
        res.setMessage("BadRequestException");
        res.setData(null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<RestResponse<Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex) {

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.NOT_FOUND.value()); // 404
        res.setError(ex.getMessage());
        res.setMessage("ResourceNotFoundException");
        res.setData(null);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<RestResponse<Object>> handleAccessDeniedException(
            AccessDeniedException ex) {

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.FORBIDDEN.value()); // 403
        res.setError(ex.getMessage()); // Thông báo lỗi (VD: "Access Denied")
        res.setMessage("AccessDeniedException");
        res.setData(null);

        // Trả về đúng status 403
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }

    @ExceptionHandler(value = IdInvalidException.class)
    public ResponseEntity<RestResponse<Object>> handleIdException(IdInvalidException ex) {

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value()); // 400
        res.setError(ex.getMessage());
        res.setMessage("IdInvalidException");
        res.setData(null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<RestResponse<Object>> handleGeneralException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()); // 500
        res.setError(ex.getMessage());
        res.setMessage("InternalServerError");
        res.setData(null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }

}
package com.soa.user_service.exception;

public class IdInvalidException extends RuntimeException {
    public IdInvalidException(String message) {
        super(message);
    }
}
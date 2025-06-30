package com.birthdayapp.exception;

public class BirthdayNotFoundException extends RuntimeException {
    public BirthdayNotFoundException(String id) {
        super("Birthday not found with id: " + id);
    }
    
    public BirthdayNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
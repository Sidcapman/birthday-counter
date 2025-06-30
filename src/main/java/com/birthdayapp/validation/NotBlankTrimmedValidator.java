package com.birthdayapp.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NotBlankTrimmedValidator implements ConstraintValidator<NotBlankTrimmed, String> {

    @Override
    public void initialize(NotBlankTrimmed constraintAnnotation) {
        
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && !value.trim().isEmpty();
    }
}
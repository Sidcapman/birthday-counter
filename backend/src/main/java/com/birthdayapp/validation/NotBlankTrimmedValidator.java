package com.birthdayapp.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NotBlankTrimmedValidator implements ConstraintValidator<NotBlankTrimmed, String> {

    @Override
    public void initialize(NotBlankTrimmed constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && !value.trim().isEmpty();
    }
}
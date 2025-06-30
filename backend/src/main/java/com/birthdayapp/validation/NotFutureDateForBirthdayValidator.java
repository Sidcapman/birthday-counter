package com.birthdayapp.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class NotFutureDateForBirthdayValidator implements ConstraintValidator<NotFutureDateForBirthday, LocalDate> {

    @Override
    public void initialize(NotFutureDateForBirthday constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext context) {
        if (date == null) {
            return true; // Let @NotNull handle null validation
        }
        
        LocalDate today = LocalDate.now();
        return !date.isAfter(today);
    }
}
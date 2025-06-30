package com.birthdayapp.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NotBlankTrimmedValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotBlankTrimmed {
    String message() default "Field cannot be empty or contain only whitespace";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
package com.birthdayapp.service;

import com.birthdayapp.dto.BirthdayResponse;
import com.birthdayapp.dto.CreateBirthdayRequest;
import com.birthdayapp.dto.UpdateBirthdayRequest;
import com.birthdayapp.exception.BirthdayNotFoundException;
import com.birthdayapp.exception.ValidationException;
import com.birthdayapp.model.Birthday;
import com.birthdayapp.repository.BirthdayRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BirthdayService {

    private static final Logger logger = LoggerFactory.getLogger(BirthdayService.class);

    @Autowired
    private BirthdayRepository birthdayRepository;

    public List<BirthdayResponse> getAllBirthdays() {
        logger.info("Fetching all birthdays");
        List<Birthday> birthdays = birthdayRepository.findAll();
        return birthdays.stream()
                .map(BirthdayResponse::new)
                .sorted((a, b) -> Integer.compare(a.getDaysUntilNext(), b.getDaysUntilNext()))
                .collect(Collectors.toList());
    }

    public List<BirthdayResponse> getBirthdaysByEventType(Birthday.EventType eventType) {
        logger.info("Fetching birthdays by event type: {}", eventType);
        List<Birthday> birthdays = birthdayRepository.findByEventType(eventType);
        return birthdays.stream()
                .map(BirthdayResponse::new)
                .sorted((a, b) -> Integer.compare(a.getDaysUntilNext(), b.getDaysUntilNext()))
                .collect(Collectors.toList());
    }

    public List<BirthdayResponse> getUpcomingBirthdays(int days) {
        logger.info("Fetching upcoming birthdays for next {} days", days);
        List<Birthday> birthdays = birthdayRepository.findAll();
        return birthdays.stream()
                .map(BirthdayResponse::new)
                .filter(birthday -> birthday.getDaysUntilNext() != null && birthday.getDaysUntilNext() <= days)
                .sorted((a, b) -> Integer.compare(a.getDaysUntilNext(), b.getDaysUntilNext()))
                .collect(Collectors.toList());
    }

    public int calculateDaysUntilNextBirthday(LocalDate birthdayDate) {
        if (birthdayDate == null) return 0;
        
        LocalDate today = LocalDate.now();
        LocalDate nextBirthday = birthdayDate.withYear(today.getYear());
        
        // If today is the birthday, return 0
        if (nextBirthday.isEqual(today)) {
            return 0;
        }
        
        // If birthday has passed this year, get next year's birthday
        if (nextBirthday.isBefore(today)) {
            nextBirthday = nextBirthday.plusYears(1);
        }
        
        // Handle leap year edge case for Feb 29
        if (birthdayDate.getMonth().getValue() == 2 && birthdayDate.getDayOfMonth() == 29) {
            if (nextBirthday.getYear() % 4 != 0 || (nextBirthday.getYear() % 100 == 0 && nextBirthday.getYear() % 400 != 0)) {
                nextBirthday = LocalDate.of(nextBirthday.getYear(), 2, 28);
            }
        }
        
        return (int) today.until(nextBirthday).getDays();
    }

    public int calculateAge(LocalDate birthdayDate) {
        if (birthdayDate == null) return 0;
        
        LocalDate today = LocalDate.now();
        int age = today.getYear() - birthdayDate.getYear();
        
        // Check if birthday hasn't occurred yet this year
        if (today.getDayOfYear() < birthdayDate.withYear(today.getYear()).getDayOfYear()) {
            age--;
        }
        
        return Math.max(0, age);
    }

    public BirthdayResponse getBirthdayById(String id) {
        logger.info("Fetching birthday with ID: {}", id);
        validateId(id);
        
        Birthday birthday = birthdayRepository.findById(id)
                .orElseThrow(() -> new BirthdayNotFoundException(id));
        
        return new BirthdayResponse(birthday);
    }

    public BirthdayResponse createBirthday(CreateBirthdayRequest request) {
        logger.info("Creating new birthday for: {}", request.getName());
        validateCreateRequest(request);
        
        Birthday birthday = new Birthday();
        birthday.setName(request.getName());
        birthday.setDate(request.getDate());
        birthday.setReminderType(request.getReminderType());
        birthday.setRepeatType(request.getRepeatType());
        birthday.setEventType(request.getEventType());
        birthday.setShowPreference(request.getShowPreference());
        birthday.setShowAge(request.getShowAge());
        
        Birthday savedBirthday = birthdayRepository.save(birthday);
        logger.info("Created birthday with ID: {}", savedBirthday.getId());
        
        return new BirthdayResponse(savedBirthday);
    }

    public BirthdayResponse updateBirthday(String id, UpdateBirthdayRequest request) {
        logger.info("Updating birthday with ID: {}", id);
        validateId(id);
        validateUpdateRequest(request);
        
        Birthday existingBirthday = birthdayRepository.findById(id)
                .orElseThrow(() -> new BirthdayNotFoundException(id));
        
        updateBirthdayFields(existingBirthday, request);
        existingBirthday.updateTimestamp();
        
        Birthday updatedBirthday = birthdayRepository.save(existingBirthday);
        logger.info("Updated birthday with ID: {}", updatedBirthday.getId());
        
        return new BirthdayResponse(updatedBirthday);
    }

    public void deleteBirthday(String id) {
        logger.info("Deleting birthday with ID: {}", id);
        validateId(id);
        
        if (!birthdayRepository.existsById(id)) {
            throw new BirthdayNotFoundException(id);
        }
        
        birthdayRepository.deleteById(id);
        logger.info("Deleted birthday with ID: {}", id);
    }

    public List<BirthdayResponse> searchBirthdaysByName(String name) {
        logger.info("Searching birthdays by name: {}", name);
        if (name == null || name.trim().isEmpty()) {
            throw new ValidationException("Search term cannot be empty");
        }
        
        List<Birthday> birthdays = birthdayRepository.findByNameContainingIgnoreCase(name.trim());
        return birthdays.stream()
                .map(BirthdayResponse::new)
                .collect(Collectors.toList());
    }


    private void validateId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new ValidationException("ID cannot be null or empty");
        }
    }

    private void validateCreateRequest(CreateBirthdayRequest request) {
        if (request == null) {
            throw new ValidationException("Request cannot be null");
        }
        
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ValidationException("Name is required");
        }
        
        if (request.getDate() == null) {
            throw new ValidationException("Date is required");
        }
        
        if (request.getDate().isAfter(LocalDate.now().plusYears(150))) {
            throw new ValidationException("Date cannot be more than 150 years in the future");
        }
        
        if (request.getDate().isBefore(LocalDate.now().minusYears(150))) {
            throw new ValidationException("Date cannot be more than 150 years in the past");
        }
        
        checkForDuplicateBirthday(request.getName(), request.getDate());
    }

    private void validateUpdateRequest(UpdateBirthdayRequest request) {
        if (request == null) {
            throw new ValidationException("Request cannot be null");
        }
        
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ValidationException("Name is required");
        }
        
        if (request.getDate() != null) {
            if (request.getDate().isAfter(LocalDate.now().plusYears(150))) {
                throw new ValidationException("Date cannot be more than 150 years in the future");
            }
            
            if (request.getDate().isBefore(LocalDate.now().minusYears(150))) {
                throw new ValidationException("Date cannot be more than 150 years in the past");
            }
        }
    }

    private void checkForDuplicateBirthday(String name, LocalDate date) {
        Optional<Birthday> existingBirthday = birthdayRepository.findByNameAndDate(name.trim(), date);
        if (existingBirthday.isPresent()) {
            throw new ValidationException("A birthday with the same name and date already exists");
        }
    }

    private void updateBirthdayFields(Birthday existingBirthday, UpdateBirthdayRequest request) {
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            existingBirthday.setName(request.getName().trim());
        }
        
        if (request.getDate() != null) {
            existingBirthday.setDate(request.getDate());
        }
        
        if (request.getReminderType() != null) {
            existingBirthday.setReminderType(request.getReminderType());
        }
        
        if (request.getRepeatType() != null) {
            existingBirthday.setRepeatType(request.getRepeatType());
        }
        
        if (request.getEventType() != null) {
            existingBirthday.setEventType(request.getEventType());
        }
        
        if (request.getShowPreference() != null) {
            existingBirthday.setShowPreference(request.getShowPreference());
        }
        
        if (request.getShowAge() != null) {
            existingBirthday.setShowAge(request.getShowAge());
        }
    }
}
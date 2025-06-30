package com.birthdayapp.controller;

import com.birthdayapp.dto.BirthdayResponse;
import com.birthdayapp.dto.CreateBirthdayRequest;
import com.birthdayapp.dto.UpdateBirthdayRequest;
import com.birthdayapp.model.Birthday;
import com.birthdayapp.service.BirthdayService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/birthdays")
@CrossOrigin(origins = "http://localhost:3000")
public class BirthdayController {

    private static final Logger logger = LoggerFactory.getLogger(BirthdayController.class);

    @Autowired
    private BirthdayService birthdayService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBirthdays(
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) Integer daysAhead) {
        logger.info("GET /api/birthdays - Fetching birthdays with filters: eventType={}, daysAhead={}", eventType, daysAhead);
        
        List<BirthdayResponse> birthdays;
        
        if (daysAhead != null) {
            birthdays = birthdayService.getUpcomingBirthdays(daysAhead);
        } else if (eventType != null) {
            Birthday.EventType type = Birthday.EventType.valueOf(eventType.toUpperCase());
            birthdays = birthdayService.getBirthdaysByEventType(type);
        } else {
            birthdays = birthdayService.getAllBirthdays();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Birthdays retrieved successfully");
        response.put("data", birthdays);
        response.put("count", birthdays.size());
        
        logger.info("Retrieved {} birthdays", birthdays.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBirthday(@Valid @RequestBody CreateBirthdayRequest request) {
        logger.info("POST /api/birthdays - Creating birthday for: {}", request.getName());
        
        BirthdayResponse createdBirthday = birthdayService.createBirthday(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Birthday created successfully");
        response.put("data", createdBirthday);
        
        logger.info("Created birthday with ID: {}", createdBirthday.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBirthdayById(@PathVariable String id) {
        logger.info("GET /api/birthdays/{} - Fetching birthday by ID", id);
        
        BirthdayResponse birthday = birthdayService.getBirthdayById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Birthday retrieved successfully");
        response.put("data", birthday);
        
        logger.info("Retrieved birthday: {}", birthday.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBirthday(
            @PathVariable String id, 
            @Valid @RequestBody UpdateBirthdayRequest request) {
        logger.info("PUT /api/birthdays/{} - Updating birthday", id);
        
        BirthdayResponse updatedBirthday = birthdayService.updateBirthday(id, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Birthday updated successfully");
        response.put("data", updatedBirthday);
        
        logger.info("Updated birthday: {}", updatedBirthday.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBirthday(@PathVariable String id) {
        logger.info("DELETE /api/birthdays/{} - Deleting birthday", id);
        
        birthdayService.deleteBirthday(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Birthday deleted successfully");
        response.put("id", id);
        
        logger.info("Deleted birthday with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchBirthdays(@RequestParam String name) {
        logger.info("GET /api/birthdays/search - Searching birthdays by name: {}", name);
        
        List<BirthdayResponse> birthdays = birthdayService.searchBirthdaysByName(name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Search completed successfully");
        response.put("data", birthdays);
        response.put("count", birthdays.size());
        response.put("searchTerm", name);
        
        logger.info("Found {} birthdays matching: {}", birthdays.size(), name);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event-type/{eventType}")
    public ResponseEntity<Map<String, Object>> getBirthdaysByEventType(@PathVariable Birthday.EventType eventType) {
        logger.info("GET /api/birthdays/event-type/{} - Fetching birthdays by event type", eventType);
        
        List<BirthdayResponse> birthdays = birthdayService.getBirthdaysByEventType(eventType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Birthdays retrieved successfully");
        response.put("data", birthdays);
        response.put("count", birthdays.size());
        response.put("eventType", eventType);
        
        logger.info("Found {} birthdays of type: {}", birthdays.size(), eventType);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Map<String, Object>> getUpcomingBirthdays(
            @RequestParam(defaultValue = "30") int days) {
        logger.info("GET /api/birthdays/upcoming - Fetching upcoming birthdays for {} days", days);
        
        List<BirthdayResponse> birthdays = birthdayService.getUpcomingBirthdays(days);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Upcoming birthdays retrieved successfully");
        response.put("data", birthdays);
        response.put("count", birthdays.size());
        response.put("daysAhead", days);
        
        logger.info("Found {} upcoming birthdays in next {} days", birthdays.size(), days);
        return ResponseEntity.ok(response);
    }
}
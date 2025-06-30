package com.birthdayapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/database")
public class DatabaseController {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseController.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            mongoTemplate.getCollection("test").estimatedDocumentCount();
            response.put("status", "connected");
            response.put("database", mongoTemplate.getDb().getName());
            response.put("message", "Database connection is healthy");
            
            logger.info("Database status check: connected");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "disconnected");
            response.put("error", e.getMessage());
            response.put("message", "Database connection failed");
            
            logger.error("Database status check failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long startTime = System.currentTimeMillis();
            mongoTemplate.getCollection("test").estimatedDocumentCount();
            long endTime = System.currentTimeMillis();
            
            response.put("status", "success");
            response.put("database", mongoTemplate.getDb().getName());
            response.put("responseTime", (endTime - startTime) + "ms");
            response.put("message", "MongoDB ping successful");
            
            logger.info("Database ping successful - Response time: {}ms", (endTime - startTime));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "failed");
            response.put("error", e.getMessage());
            response.put("message", "MongoDB ping failed");
            
            logger.error("Database ping failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
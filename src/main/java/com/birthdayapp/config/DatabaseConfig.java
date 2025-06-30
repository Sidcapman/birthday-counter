package com.birthdayapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void validateConnection() {
        try {
            mongoTemplate.getCollection("test").estimatedDocumentCount();
            logger.info("Successfully connected to MongoDB database: {}", mongoTemplate.getDb().getName());
        } catch (Exception e) {
            logger.error("Failed to connect to MongoDB: {}", e.getMessage());
        }
    }

    public boolean isConnected() {
        try {
            mongoTemplate.getCollection("test").estimatedDocumentCount();
            return true;
        } catch (Exception e) {
            logger.error("Database connection check failed: {}", e.getMessage());
            return false;
        }
    }
}
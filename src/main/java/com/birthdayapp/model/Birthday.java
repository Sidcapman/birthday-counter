package com.birthdayapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.birthdayapp.validation.NotBlankTrimmed;
import com.birthdayapp.validation.NotFutureDateForBirthday;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "birthdays")
public class Birthday {
    
    @Id
    private String id;
    
    @NotBlankTrimmed(message = "Name cannot be empty or contain only whitespace")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;
    
    @NotNull(message = "Date is required")
    @NotFutureDateForBirthday(message = "Birthday date cannot be in the future")
    private LocalDate date;
    
    @NotNull(message = "Reminder type is required")
    private ReminderType reminderType;
    
    @NotNull(message = "Repeat type is required")
    private RepeatType repeatType;
    
    @NotNull(message = "Event type is required")
    private EventType eventType;
    
    @NotNull(message = "Show preference is required")
    private ShowPreference showPreference;
    
    @NotNull(message = "Show age preference is required")
    private Boolean showAge;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    public enum ReminderType {
        NONE, SAME_DAY, ONE_DAY_BEFORE, ONE_WEEK_BEFORE, CUSTOM
    }

    public enum RepeatType {
        NEVER, YEARLY, MONTHLY, WEEKLY
    }

    public enum EventType {
        BIRTHDAY, ANNIVERSARY, HOLIDAY, OTHER
    }

    public enum ShowPreference {
        PUBLIC, PRIVATE, FRIENDS_ONLY
    }

    public Birthday() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public ReminderType getReminderType() {
        return reminderType;
    }

    public void setReminderType(ReminderType reminderType) {
        this.reminderType = reminderType;
    }

    public RepeatType getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(RepeatType repeatType) {
        this.repeatType = repeatType;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public ShowPreference getShowPreference() {
        return showPreference;
    }

    public void setShowPreference(ShowPreference showPreference) {
        this.showPreference = showPreference;
    }

    public Boolean getShowAge() {
        return showAge;
    }

    public void setShowAge(Boolean showAge) {
        this.showAge = showAge;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
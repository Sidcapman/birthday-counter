package com.birthdayapp.dto;

import com.birthdayapp.model.Birthday;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class UpdateBirthdayRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private LocalDate date;
    
    private Birthday.ReminderType reminderType;
    
    private Birthday.RepeatType repeatType;
    
    private Birthday.EventType eventType;
    
    private Birthday.ShowPreference showPreference;
    
    private Boolean showAge;

    public UpdateBirthdayRequest() {}

    public UpdateBirthdayRequest(String name, LocalDate date, Birthday.ReminderType reminderType, 
                               Birthday.RepeatType repeatType, Birthday.EventType eventType, 
                               Birthday.ShowPreference showPreference, Boolean showAge) {
        this.name = name;
        this.date = date;
        this.reminderType = reminderType;
        this.repeatType = repeatType;
        this.eventType = eventType;
        this.showPreference = showPreference;
        this.showAge = showAge;
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

    public Birthday.ReminderType getReminderType() {
        return reminderType;
    }

    public void setReminderType(Birthday.ReminderType reminderType) {
        this.reminderType = reminderType;
    }

    public Birthday.RepeatType getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(Birthday.RepeatType repeatType) {
        this.repeatType = repeatType;
    }

    public Birthday.EventType getEventType() {
        return eventType;
    }

    public void setEventType(Birthday.EventType eventType) {
        this.eventType = eventType;
    }

    public Birthday.ShowPreference getShowPreference() {
        return showPreference;
    }

    public void setShowPreference(Birthday.ShowPreference showPreference) {
        this.showPreference = showPreference;
    }

    public Boolean getShowAge() {
        return showAge;
    }

    public void setShowAge(Boolean showAge) {
        this.showAge = showAge;
    }
}
package com.birthdayapp.dto;

import com.birthdayapp.model.Birthday;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BirthdayResponse {
    
    private String id;
    private String name;
    private LocalDate date;
    private Birthday.ReminderType reminderType;
    private Birthday.RepeatType repeatType;
    private Birthday.EventType eventType;
    private Birthday.ShowPreference showPreference;
    private Boolean showAge;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer daysUntilNext;
    private Integer age;

    public BirthdayResponse() {}

    public BirthdayResponse(Birthday birthday) {
        this.id = birthday.getId();
        this.name = birthday.getName();
        this.date = birthday.getDate();
        this.reminderType = birthday.getReminderType();
        this.repeatType = birthday.getRepeatType();
        this.eventType = birthday.getEventType();
        this.showPreference = birthday.getShowPreference();
        this.showAge = birthday.getShowAge();
        this.createdAt = birthday.getCreatedAt();
        this.updatedAt = birthday.getUpdatedAt();
        this.daysUntilNext = calculateDaysUntilNext(birthday.getDate());
        this.age = calculateAge(birthday.getDate());
    }

    private Integer calculateDaysUntilNext(LocalDate birthdayDate) {
        if (birthdayDate == null) return null;
        
        LocalDate today = LocalDate.now();
        System.out.println("today data"+ today);
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
        System.out.println(nextBirthday.toString());

        int years = today.until(nextBirthday).getYears();
        int months = today.until(nextBirthday).getMonths();
        int days = today.until(nextBirthday).getDays();
        
        // Convert years and months to days
        int totalDays = (years * 365) + (months * 30) + days;
        
        System.out.println("Years: " + years + ", Months: " + months + ", Days: " + days);
        System.out.println("Total Days: " + totalDays);
        
        return totalDays;
    }

    private Integer calculateAge(LocalDate birthdayDate) {
        if (birthdayDate == null) return null;
        
        LocalDate today = LocalDate.now();
        return today.getYear() - birthdayDate.getYear() - 
               (today.getDayOfYear() < birthdayDate.getDayOfYear() ? 1 : 0);
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

    public Integer getDaysUntilNext() {
        return daysUntilNext;
    }

    public void setDaysUntilNext(Integer daysUntilNext) {
        this.daysUntilNext = daysUntilNext;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
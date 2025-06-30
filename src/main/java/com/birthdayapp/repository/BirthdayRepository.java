package com.birthdayapp.repository;

import com.birthdayapp.model.Birthday;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BirthdayRepository extends MongoRepository<Birthday, String> {
    
    List<Birthday> findByNameContainingIgnoreCase(String name);
    
    List<Birthday> findByEventType(Birthday.EventType eventType);
    
    List<Birthday> findByDate(LocalDate date);
    
    @Query("{ 'date': { $gte: ?0, $lte: ?1 } }")
    List<Birthday> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Birthday> findByNameRegex(String namePattern);
    
    List<Birthday> findByReminderType(Birthday.ReminderType reminderType);
    
    List<Birthday> findByRepeatType(Birthday.RepeatType repeatType);
    
    List<Birthday> findByShowPreference(Birthday.ShowPreference showPreference);
    
    @Query("{ $expr: { $eq: [{ $dayOfMonth: '$date' }, { $dayOfMonth: ?0 }] } }")
    List<Birthday> findByDayOfMonth(LocalDate date);
    
    @Query("{ $expr: { $and: [{ $eq: [{ $month: '$date' }, { $month: ?0 }] }, { $eq: [{ $dayOfMonth: '$date' }, { $dayOfMonth: ?0 }] }] } }")
    List<Birthday> findByMonthAndDay(LocalDate date);
    
    Optional<Birthday> findByNameAndDate(String name, LocalDate date);
    
    long countByEventType(Birthday.EventType eventType);
    
    @Query(value = "{ 'date': { $gte: ?0, $lte: ?1 } }", sort = "{ 'date': 1 }")
    List<Birthday> findUpcomingBirthdays(LocalDate startDate, LocalDate endDate);
}
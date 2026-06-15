package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"
)

func seedTransactions(db *sql.DB, employeeIds []string, roomIds []string) {
	log.Println("Seeding Transactions...")

	if len(employeeIds) == 0 || len(roomIds) == 0 {
		log.Println("Skipping Transactions seeder due to missing employees or rooms")
		return
	}

	statuses := []string{"pending", "accepted", "declined"}

	for i := 0; i < 10; i++ {
		eId := employeeIds[i%len(employeeIds)]
		rId := roomIds[i%len(roomIds)]

		startTime := time.Now().AddDate(0, 0, i+1)
		endTime := startTime.Add(2 * time.Hour)
		status := statuses[i%len(statuses)]

		_, err := db.Exec(`
			INSERT INTO transactions(employee_id, room_id, description, status, start_time, end_time, updated_at) 
			VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP);
		`, eId, rId, fmt.Sprintf("Meeting penting %d", i+1), status, startTime, endTime)

		if err != nil {
			log.Printf("Warning: Failed to insert transaction: %v", err)
		}
	}
}

package main

import (
	"database/sql"
	"log"

	"github.com/brianvoe/gofakeit/v6"
)

func seedRooms(db *sql.DB) []string {
	log.Println("Seeding Rooms...")

	var insertedIds []string
	roomTypes := []string{"Meeting", "Conference", "Interview", "Event", "Training"}
	statuses := []string{"available", "booked", "unavailable"}

	for i := 0; i < 1000; i++ {
		name := gofakeit.Company() + " Room"
		roomType := roomTypes[gofakeit.Number(0, len(roomTypes)-1)]
		capacity := gofakeit.Number(4, 100)
		status := statuses[gofakeit.Number(0, len(statuses)-1)]

		var id string
		err := db.QueryRow(`
			INSERT INTO rooms(name, room_type, capacity, status, updated_at) 
			VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) 
			RETURNING id;
		`, name, roomType, capacity, status).Scan(&id)

		if err != nil {
			log.Printf("Warning: Failed to insert room %s: %v", name, err)
		} else {
			insertedIds = append(insertedIds, id)
		}
	}
	return insertedIds
}

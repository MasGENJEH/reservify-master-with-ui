package main

import (
	"database/sql"
	"log"
)

func seedRooms(db *sql.DB) []string {
	log.Println("Seeding Rooms...")

	rooms := []struct {
		Name     string
		Type     string
		Capacity int
		Status   string
	}{
		{"Meeting Room A", "Meeting", 10, "available"},
		{"Meeting Room B", "Meeting", 8, "available"},
		{"Meeting Room C", "Meeting", 12, "available"},
		{"Conference Hall 1", "Conference", 50, "available"},
		{"Conference Hall 2", "Conference", 100, "available"},
		{"Interview Room 1", "Interview", 4, "available"},
		{"Interview Room 2", "Interview", 4, "available"},
		{"Auditorium", "Event", 200, "available"},
		{"Training Room A", "Training", 30, "available"},
		{"Training Room B", "Training", 30, "available"},
	}

	var insertedIds []string
	for _, room := range rooms {
		var id string
		err := db.QueryRow(`
			INSERT INTO rooms(name, room_type, capacity, status, updated_at) 
			VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) 
			RETURNING id;
		`, room.Name, room.Type, room.Capacity, room.Status).Scan(&id)

		if err != nil {
			log.Printf("Warning: Failed to insert room %s: %v", room.Name, err)
		} else {
			insertedIds = append(insertedIds, id)
		}
	}
	return insertedIds
}

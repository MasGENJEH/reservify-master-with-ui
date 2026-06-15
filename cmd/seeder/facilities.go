package main

import (
	"database/sql"
	"log"
)

func seedFacilities(db *sql.DB) []string {
	log.Println("Seeding Facilities...")

	facilities := []struct {
		Name     string
		Quantity int
	}{
		{"Projector", 5},
		{"Whiteboard", 10},
		{"Speaker System", 3},
		{"Video Conference Cam", 4},
		{"HDMI Cable", 20},
		{"Air Conditioner", 15},
		{"Office Chair", 50},
		{"Meeting Table", 10},
		{"Water Dispenser", 5},
		{"Coffee Machine", 2},
	}

	var insertedIds []string
	for _, fac := range facilities {
		var id string
		err := db.QueryRow(`
			INSERT INTO facilities(name, quantity, updated_at) 
			VALUES($1, $2, CURRENT_TIMESTAMP) 
			RETURNING id;
		`, fac.Name, fac.Quantity).Scan(&id)

		if err != nil {
			log.Printf("Warning: Failed to insert facility %s: %v", fac.Name, err)
		} else {
			insertedIds = append(insertedIds, id)
		}
	}
	return insertedIds
}

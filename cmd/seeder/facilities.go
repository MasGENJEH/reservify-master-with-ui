package main

import (
	"database/sql"
	"log"

	"github.com/brianvoe/gofakeit/v6"
)

func seedFacilities(db *sql.DB) []string {
	log.Println("Seeding Facilities...")

	var insertedIds []string

	// Ensure some standard facilities
	standardFacs := []string{"Projector", "Whiteboard", "TV Monitor", "Sound System", "Video Conference Kit"}
	for _, fName := range standardFacs {
		var id string
		err := db.QueryRow(`
			INSERT INTO facilities(name, quantity, updated_at) 
			VALUES($1, $2, CURRENT_TIMESTAMP) 
			RETURNING id;
		`, fName, gofakeit.Number(1, 20)).Scan(&id)
		if err == nil {
			insertedIds = append(insertedIds, id)
		}
	}

	for i := 0; i < 1000; i++ {
		name := gofakeit.Noun() + " " + gofakeit.Color()
		quantity := gofakeit.Number(1, 50)

		var id string
		err := db.QueryRow(`
			INSERT INTO facilities(name, quantity, updated_at) 
			VALUES($1, $2, CURRENT_TIMESTAMP) 
			RETURNING id;
		`, name, quantity).Scan(&id)

		if err != nil {
			log.Printf("Warning: Failed to insert facility %s: %v", name, err)
		} else {
			insertedIds = append(insertedIds, id)
		}
	}
	return insertedIds
}

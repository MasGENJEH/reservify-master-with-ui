package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
)

func seedRoomFacilities(db *sql.DB, roomIds []string, facilityIds []string) {
	log.Println("Seeding Room Facilities...")

	if len(roomIds) == 0 || len(facilityIds) == 0 {
		log.Println("Skipping Room Facilities seeder due to missing rooms or facilities")
		return
	}

	for i := 0; i < 10; i++ {
		rId := roomIds[i%len(roomIds)]
		fId := facilityIds[i%len(facilityIds)]
		quantity := rand.Intn(3) + 1

		_, err := db.Exec(`
			INSERT INTO trx_room_facility(room_id, facility_id, quantity, description, updated_at) 
			VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP);
		`, rId, fId, quantity, fmt.Sprintf("Fasilitas seeder %d", i+1))

		if err != nil {
			log.Printf("Warning: Failed to insert room facility: %v", err)
		}
	}
}

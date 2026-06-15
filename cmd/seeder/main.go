package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"time"

	"booking-room-app/config"
	_ "github.com/lib/pq"
)

func main() {
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.Name)
	
	db, err := sql.Open(cfg.Driver, dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Successfully connected to database. Starting seeder...")

	rand.Seed(time.Now().UnixNano())

	// 1. Seed Employees
	employeeIds := seedEmployees(db)
	
	// 2. Seed Facilities
	facilityIds := seedFacilities(db)
	
	// 3. Seed Rooms
	roomIds := seedRooms(db)
	
	// 4. Seed Room Facilities
	seedRoomFacilities(db, roomIds, facilityIds)
	
	// 5. Seed Transactions
	seedTransactions(db, employeeIds, roomIds)

	log.Println("Seeder executed successfully! 10 data items for each table have been inserted.")
}



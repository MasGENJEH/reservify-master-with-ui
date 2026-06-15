package main

import (
	"booking-room-app/config"
	"database/sql"
	"log"
	"os"
	"strings"

	_ "github.com/lib/pq"
)

func main() {
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	dsn := "host=" + cfg.Host + " port=" + cfg.Port + " user=" + cfg.User + " password=" + cfg.Password + " dbname=" + cfg.Name + " sslmode=disable"
	db, err := sql.Open(cfg.Driver, dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database (Make sure database '%s' is created manually first): %v", cfg.Name, err)
	}

	log.Println("Reading SQL migration file...")
	sqlBytes, err := os.ReadFile("assets/booking-room-db.sql")
	if err != nil {
		log.Fatalf("Failed to read SQL file: %v", err)
	}

	sqlString := string(sqlBytes)
	
	// Remove the CREATE DATABASE statement because we are already connected to it
	// and PostgreSQL doesn't allow CREATE DATABASE inside a transaction block 
	// or when already connected to the target database in most cases.
	sqlString = strings.ReplaceAll(sqlString, "CREATE DATABASE booking_room_db;", "")

	log.Println("Executing migration queries...")
	
	// Executing the entire script at once
	_, err = db.Exec(sqlString)
	if err != nil {
		// If it fails, it might be because the tables/types already exist.
		log.Fatalf("Failed to execute migration. Note: if types already exist, this will fail. Error: %v", err)
	}

	log.Println("Migration completed successfully! All tables and extensions have been created.")
}

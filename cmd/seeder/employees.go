package main

import (
	"database/sql"
	"log"
)

func seedEmployees(db *sql.DB) []string {
	log.Println("Seeding Employees...")

	employees := []struct {
		Name     string
		Username string
		Password string
		Role     string
		Division string
		Position string
		Contact  string
	}{
		{"Admin User", "admin", "password123", "admin", "IT", "System Administrator", "081234567890"},
		{"General Affairs", "ga_user", "password123", "ga", "Operations", "GA Officer", "081234567891"},
		{"Employee 1", "employee1", "password123", "employee", "Marketing", "Staff", "081234567892"},
		{"Employee 2", "employee2", "password123", "employee", "Finance", "Staff", "081234567893"},
		{"Employee 3", "employee3", "password123", "employee", "HR", "Staff", "081234567894"},
		{"Employee 4", "employee4", "password123", "employee", "IT", "Developer", "081234567895"},
		{"Employee 5", "employee5", "password123", "employee", "Marketing", "Manager", "081234567896"},
		{"Employee 6", "employee6", "password123", "employee", "Finance", "Manager", "081234567897"},
		{"Employee 7", "employee7", "password123", "employee", "Operations", "Staff", "081234567898"},
		{"Employee 8", "employee8", "password123", "employee", "IT", "QA", "081234567899"},
	}

	var insertedIds []string
	for _, emp := range employees {
		var id string
		// using raw query from config but modified to not use time.Now() from go, let DB handle CURRENT_TIMESTAMP
		err := db.QueryRow(`
			INSERT INTO employees(name, username, password, role, division, position, contact, updated_at) 
			VALUES($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7, CURRENT_TIMESTAMP) 
			ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name 
			RETURNING id;
		`, emp.Name, emp.Username, emp.Password, emp.Role, emp.Division, emp.Position, emp.Contact).Scan(&id)

		if err != nil {
			log.Printf("Warning: Failed to insert employee %s (maybe already exists): %v", emp.Username, err)
			// if already exists, try to get the ID
			_ = db.QueryRow("SELECT id FROM employees WHERE username = $1", emp.Username).Scan(&id)
		}

		if id != "" {
			insertedIds = append(insertedIds, id)
		}
	}
	return insertedIds
}

package main

import (
	"database/sql"
	"log"

	"github.com/brianvoe/gofakeit/v6"
)

func seedEmployees(db *sql.DB) []string {
	log.Println("Seeding Employees...")

	var insertedIds []string

	// Maintain admin and ga for login purposes
	adminEmp := struct {
		Name, Username, Password, Role, Division, Position, Contact string
	}{"Admin User", "admin", "password123", "admin", "IT", "System Administrator", "081234567890"}
	gaEmp := struct {
		Name, Username, Password, Role, Division, Position, Contact string
	}{"General Affairs", "ga_user", "password123", "ga", "Operations", "GA Officer", "081234567891"}

	basicEmployees := []struct{Name, Username, Password, Role, Division, Position, Contact string}{adminEmp, gaEmp}
	
	for _, emp := range basicEmployees {
		var id string
		err := db.QueryRow(`
			INSERT INTO employees(name, username, password, role, division, position, contact, updated_at) 
			VALUES($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7, CURRENT_TIMESTAMP) 
			ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name 
			RETURNING id;
		`, emp.Name, emp.Username, emp.Password, emp.Role, emp.Division, emp.Position, emp.Contact).Scan(&id)

		if err != nil {
			_ = db.QueryRow("SELECT id FROM employees WHERE username = $1", emp.Username).Scan(&id)
		}
		if id != "" {
			insertedIds = append(insertedIds, id)
		}
	}

	// Fake employees
	roles := []string{"employee", "employee", "employee", "admin", "ga"}
	divisions := []string{"IT", "HR", "Finance", "Marketing", "Operations"}

	for i := 0; i < 1000; i++ {
		name := gofakeit.Name()
		username := gofakeit.Username()
		password := "password123"
		role := roles[gofakeit.Number(0, len(roles)-1)]
		division := divisions[gofakeit.Number(0, len(divisions)-1)]
		position := gofakeit.JobTitle()
		contact := gofakeit.Phone()

		var id string
		err := db.QueryRow(`
			INSERT INTO employees(name, username, password, role, division, position, contact, updated_at) 
			VALUES($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7, CURRENT_TIMESTAMP) 
			ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name 
			RETURNING id;
		`, name, username, password, role, division, position, contact).Scan(&id)

		if err == nil && id != "" {
			insertedIds = append(insertedIds, id)
		}
	}

	return insertedIds
}

package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// user models here

// User struct
type User struct {
	gorm.Model        // this will add id, created_at, updated_at, deleted_at fields
	Name       string `json:"name"`
	Email      string `json:"email" gorm:"unique"`
	Password   string `json:"password"`
}

// function for password hashing
func (u *User) HashedPassword(password string) error {
	// hash password here
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}
	u.Password = string(bytes)
	return nil
}

// function for password verification
func (u *User) VerifyPassword(providedPassword string) error {
	// verify password here
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}

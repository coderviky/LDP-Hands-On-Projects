package models

// rules databse table model

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Rule struct
type Rule struct {
	gorm.Model // this will add id, created_at, updated_at, deleted_at fields

	// rule fields here
	Name     string         `json:"name"`
	RuleText string         `json:"rule_text" gorm:"unique"`
	RuleJson datatypes.JSON `json:"rule_json"` // ast of rule as json

	// user id foreign key on User table
	UserID uint `json:"user_id"`
	User   User
}

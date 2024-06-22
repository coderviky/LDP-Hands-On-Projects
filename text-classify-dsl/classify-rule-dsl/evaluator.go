package dsl

import (
	"fmt"
	"strconv"
	"strings"
)

// return value of the evaluation
type Value struct {
	Bool   bool
	Number int
	Type   ValueType
}

// value type of value struct
type ValueType int

// const values for value type
const (
	BoolType ValueType = iota
	NumberType
)

// Evaluate the AST node
func Evaluate(node *ASTNode, text string) (Value, error) {
	switch node.Type { // check the node type
	case NodeNumber:
		num, err := strconv.Atoi(node.Value)
		if err != nil {
			return Value{}, err
		}
		return Value{Number: num, Type: NumberType}, nil
	case NodeString: // only count function required string node -> so return error
		return Value{}, fmt.Errorf("unexpected string node")
	case NodeFunction: // evaluate function - count, max, min
		return evaluateFunction(node, text)
	case NodeComparison: // evaluate comparison - ==, !=, <, >, <=, >=
		return evaluateComparison(node, text)
	case NodeExpression: // evaluate expression
		return evaluatEexpression(node, text)
	default:
		return Value{}, fmt.Errorf("unknown node type")
	}
}

// evaluate function node - count, max, min
func evaluateFunction(node *ASTNode, text string) (Value, error) {
	switch node.Value {
	case "count":
		// count function should have only one child
		if len(node.Children) != 1 || node.Children[0].Type != NodeString {
			return Value{}, fmt.Errorf("invalid count function")
		}
		substr := node.Children[0].Value // get the substring to count
		count := strings.Count(text, substr)
		return Value{Number: count, Type: NumberType}, nil
	case "max":
		return evaluateMaxOrMinFunction(node, text, "max") // evaluate max function
	case "min":
		return evaluateMaxOrMinFunction(node, text, "min") // evaluate min function
	default:
		return Value{}, fmt.Errorf("unknown function: %s", node.Value)
	}
}

// evaluate comparison node - ==, !=, <, >, <=, >=
func evaluateComparison(node *ASTNode, text string) (Value, error) {
	left, err := Evaluate(node.Children[0], text)
	if err != nil {
		return Value{}, err
	}
	right, err := Evaluate(node.Children[1], text)
	if err != nil {
		return Value{}, err
	}
	// comparison requires number types
	if left.Type != NumberType || right.Type != NumberType {
		return Value{}, fmt.Errorf("comparison requires number types")
	}
	// evaluate the comparison
	switch node.Value {
	case "==":
		return Value{Bool: left.Number == right.Number, Type: BoolType}, nil
	case "!=":
		return Value{Bool: left.Number != right.Number, Type: BoolType}, nil
	case "<":
		return Value{Bool: left.Number < right.Number, Type: BoolType}, nil
	case ">":
		return Value{Bool: left.Number > right.Number, Type: BoolType}, nil
	case "<=":
		return Value{Bool: left.Number <= right.Number, Type: BoolType}, nil
	case ">=":
		return Value{Bool: left.Number >= right.Number, Type: BoolType}, nil
	default:
		return Value{}, fmt.Errorf("unknown operator: %s", node.Value)
	}
}

// evaluate expression node - +, -, *, /
func evaluatEexpression(node *ASTNode, text string) (Value, error) {
	left, err := Evaluate(node.Children[0], text)
	if err != nil {
		return Value{}, err
	}
	right, err := Evaluate(node.Children[1], text)
	if err != nil {
		return Value{}, err
	}
	// arithmetic requires number types
	if left.Type != NumberType || right.Type != NumberType {
		return Value{}, fmt.Errorf("arithmetic requires number types")
	}
	// evaluate the arithmetic
	switch node.Value {
	case "+":
		return Value{Number: left.Number + right.Number, Type: NumberType}, nil
	case "-":
		return Value{Number: left.Number - right.Number, Type: NumberType}, nil
	case "*":
		return Value{Number: left.Number * right.Number, Type: NumberType}, nil
	case "/":
		if right.Number == 0 {
			return Value{}, fmt.Errorf("division by zero")
		}
		return Value{Number: left.Number / right.Number, Type: NumberType}, nil
	default:
		return Value{}, fmt.Errorf("unknown operator: %s", node.Value)
	}
}

// evaluate max or min function based on the function type
func evaluateMaxOrMinFunction(node *ASTNode, text string, function_type string) (Value, error) {
	if len(node.Children) != 2 {
		return Value{}, fmt.Errorf("invalid %v function", function_type)
	}
	left, err := Evaluate(node.Children[0], text)
	if err != nil {
		return Value{}, err
	}
	right, err := Evaluate(node.Children[1], text)
	if err != nil {
		return Value{}, err
	}
	// max, min function requires number types
	if left.Type != NumberType || right.Type != NumberType {
		return Value{}, fmt.Errorf("%v function arguments must be numbers", function_type)
	}
	// evaluate the max or min function
	val := left.Number
	switch function_type {
	case "max":
		if right.Number > val {
			val = right.Number
		}
	case "min":
		if right.Number < val {
			val = right.Number
		}
	default:
		return Value{}, fmt.Errorf("unknown function: %s", function_type)
	}
	// return the result
	return Value{Number: val, Type: NumberType}, nil
}

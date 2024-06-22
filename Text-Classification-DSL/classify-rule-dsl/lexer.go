package dsl

import (
	"fmt"
	"strings"
	"unicode"
)

// Token definitions
type TokenType string

// constant tokens types
const (
	TokenEOF = "EOF"
	// expression comp_op expression
	TokenComparatorOperator = "ComparatorOperator" // == != < > <= >=

	// expression : expression op expression | count("string") | max(expression, expression) | number
	TokenParenClose = "ParenClose"
	TokenParenOpen  = "ParenOpen"

	TokenCountFunction = "Count"
	TokenString        = "String"

	TokenMaxFunction = "Max"
	TokenMinFunction = "Min"
	TokenComma       = "Comma"

	// TokenOperator // + - * /
	TokenPlus     = "Plus"
	TokenMinus    = "Minus"
	TokenAsterisk = "Asterisk"
	TokenSlash    = "Slash"

	TokenNumber = "Number"
)

type Token struct {
	Type  TokenType
	Value string
}

// Lexer
func isWhitespace(ch rune) bool {
	return unicode.IsSpace(ch)
}

func isDigit(ch rune) bool {
	return unicode.IsDigit(ch)
}

func isLetter(ch rune) bool {
	return unicode.IsLetter(ch)
}

func isComparatorOperator(ch rune) bool {
	return strings.ContainsRune("=<>!", ch)
}

// func isOperator(ch rune) bool {
// 	return strings.ContainsRune("+-*/", ch)
// }

func Lex(input string) ([]Token, error) {
	var tokens []Token
	var i int
	// until end of input
	for i < len(input) {
		ch := rune(input[i])
		if isWhitespace(ch) {
			i++
			continue
		}
		if isDigit(ch) {
			start := i
			// read until end of number
			for i < len(input) && isDigit(rune(input[i])) {
				i++
			}
			tokens = append(tokens, Token{Type: TokenNumber, Value: input[start:i]})
			continue
		}
		if isLetter(ch) { // check for function
			start := i
			// read until end of letter
			for i < len(input) && (isLetter(rune(input[i])) || isDigit(rune(input[i]))) {
				i++
			}
			// check for function type
			tokenstring := input[start:i]
			var functionType TokenType
			switch tokenstring {
			case "count":
				functionType = TokenCountFunction
			case "max":
				functionType = TokenMaxFunction
			case "min":
				functionType = TokenMinFunction
			default:
				return nil, fmt.Errorf("unexpected function: %s", tokenstring)
			}
			tokens = append(tokens, Token{Type: functionType, Value: tokenstring})
			continue
		}
		// json has issue with double quotes in string so using single quotes
		if ch == '\'' { // get string -
			start := i + 1
			i++
			// read until end of string
			for i < len(input) && rune(input[i]) != '\'' {
				i++
			}
			// check for unterminated string
			if i < len(input) {
				tokens = append(tokens, Token{Type: TokenString, Value: input[start:i]})
				i++
			} else {
				return nil, fmt.Errorf("unterminated string")
			}
			continue
		}
		if ch == ',' {
			tokens = append(tokens, Token{Type: TokenComma, Value: string(ch)})
			i++
			continue
		}
		if ch == '(' {
			tokens = append(tokens, Token{Type: TokenParenOpen, Value: string(ch)})
			i++
			continue
		}
		if ch == ')' {
			tokens = append(tokens, Token{Type: TokenParenClose, Value: string(ch)})
			i++
			continue
		}
		if isComparatorOperator(ch) {
			start := i
			// read until end of comparator operator
			for i < len(input) && isComparatorOperator(rune(input[i])) {
				i++
			}
			tokens = append(tokens, Token{Type: TokenComparatorOperator, Value: input[start:i]})
			continue
		}
		if ch == '+' {
			tokens = append(tokens, Token{Type: TokenPlus, Value: string(ch)})
			i++
			continue
		}
		if ch == '-' {
			tokens = append(tokens, Token{Type: TokenMinus, Value: string(ch)})
			i++
			continue
		}
		if ch == '*' {
			tokens = append(tokens, Token{Type: TokenAsterisk, Value: string(ch)})
			i++
			continue
		}
		if ch == '/' {
			tokens = append(tokens, Token{Type: TokenSlash, Value: string(ch)})
			i++
			continue
		}
		return nil, fmt.Errorf("unexpected character: %c", ch)
	}
	// add EOF token to end of all tokens
	tokens = append(tokens, Token{Type: TokenEOF, Value: ""})
	return tokens, nil
}

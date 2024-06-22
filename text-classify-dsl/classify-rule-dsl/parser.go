package dsl

import "fmt"

// NodeType is the type of the AST node
type NodeType string

// Node types constants
const (
	NodeComparison = "NodeComparison"
	NodeExpression = "NodeExpression"

	NodeNumber = "NodeNumber"

	NodeString   = "NodeString"
	NodeFunction = "NodeFunction"
)

// precedence constants
const (
	_ int = iota
	LOWEST
	EQUALS  // == LESSGREATER // > or <
	SUM     //+
	PRODUCT //*
	// PREFIX  //-Xor!X
	CALL // count("string") or max(expression, expression)
)

// operator precedence map
var precedences = map[TokenType]int{
	TokenPlus:               SUM,
	TokenMinus:              SUM,
	TokenAsterisk:           PRODUCT,
	TokenSlash:              PRODUCT,
	TokenComparatorOperator: EQUALS,
}

// ASTNode is the abstract syntax tree node
type ASTNode struct {
	Type     NodeType
	Value    string
	Children []*ASTNode
}

type Parser struct {
	tokens []Token
	pos    int
}

// return new parser
func NewParser(tokens []Token) *Parser {
	return &Parser{tokens: tokens}
}

// start parsing tokens
func (p *Parser) Parse() (*ASTNode, error) {
	node, err := p.parseComparison() // parse comparison as root node
	if err != nil {
		return nil, err
	}
	// check if there are more tokens
	if p.currentToken().Type != TokenEOF {
		return nil, fmt.Errorf("[Type != TokenEOF] unexpected token: %s", p.currentToken().Value)
	}
	return node, nil
}

// parse comparison
func (p *Parser) parseComparison() (*ASTNode, error) {
	// expression comparison_operator expression
	// fmt.Println("parseComparison()")

	left, err := p.parseExpression() // parse left side of comparison
	if err != nil {
		return nil, err
	}
	// check if next token is comparison operator
	if p.currentToken().Type == TokenComparatorOperator {
		operator := p.currentToken() // get comparison operator
		p.advance()
		right, err := p.parseExpression() // parse right side of comparison
		if err != nil {
			return nil, err
		}
		// create comparison node
		return &ASTNode{
			Type:  NodeComparison,
			Value: operator.Value,
			Children: []*ASTNode{
				left, right,
			},
		}, nil
	}

	// if no comparison operator found, return left node
	return left, nil
}

// parse expression using algorithm https://en.wikipedia.org/wiki/Operator-precedence_parser
/*
parse_expression()
    return parse_expression_1(parse_primary(), 0)
parse_expression_1(lhs, min_precedence)
    lookahead := peek next token
    while lookahead is a binary operator whose precedence is >= min_precedence
        op := lookahead
        advance to next token
        rhs := parse_primary ()
        lookahead := peek next token
        while lookahead is a binary operator whose precedence is greater
                 than op's, or a right-associative operator
                 whose precedence is equal to op's
            rhs := parse_expression_1 (rhs, precedence of op + (1 if lookahead precedence is greater, else 0))
            lookahead := peek next token
        lhs := the result of applying op with operands lhs and rhs
    return lhs
*/
func (p *Parser) parseExpression() (*ASTNode, error) {
	// fmt.Println("parseExpression()")
	// parse primary or left hand side
	lhs, err := p.parseTerm()
	if err != nil {
		// fmt.Println("parseExpression() error:", err)
		return nil, err
	}
	// parse next tokens in expression
	return p.parseExpression1(lhs, LOWEST)
}

// parse expression1
func (p *Parser) parseExpression1(lhs *ASTNode, minPrecedence int) (*ASTNode, error) {
	// fmt.Println("parseExpression1()", lhs, minPrecedence)
	lookahead := p.currentToken() // next token
	// check token type is binary operator and precedence is greater than min_precedence
	for isBinaryOperator(lookahead) && precedences[lookahead.Type] >= minPrecedence {
		operator := lookahead
		p.advance()
		right, err := p.parseTerm()
		if err != nil {
			return nil, err
		}
		lookahead = p.currentToken()
		// check if lookahead is binary operator and precedence is greater than operator precedence
		for isBinaryOperator(lookahead) && precedences[lookahead.Type] > precedences[operator.Type] {
			right, err = p.parseExpression1(right, precedences[lookahead.Type])
			if err != nil {
				return nil, err
			}
			lookahead = p.currentToken()
		}
		lhs = &ASTNode{
			Type:  NodeExpression,
			Value: operator.Value,
			Children: []*ASTNode{
				lhs, right,
			},
		}

	}
	return lhs, nil

}

func (p *Parser) parseTerm() (*ASTNode, error) {
	token := p.currentToken()
	// fmt.Println("parseTerm()", token)

	switch token.Type { // check token type
	case TokenNumber:
		p.advance() // go to next token
		return &ASTNode{Type: NodeNumber, Value: token.Value}, nil
	case TokenString:
		p.advance() // go to next token
		return &ASTNode{Type: NodeString, Value: token.Value}, nil
	case TokenCountFunction:
		return p.parseCountFunction() // parse count function
	case TokenMaxFunction:
		return p.parseMaxMinFunction() // parse max function
	case TokenMinFunction:
		return p.parseMaxMinFunction() // parse min function
	case TokenParenOpen:
		p.advance()
		node, err := p.parseExpression() // parse expression inside parenthesis
		if err != nil {
			return nil, err
		}
		// check if next token is closing parenthesis
		if p.currentToken().Type != TokenParenClose {
			return nil, fmt.Errorf("expected ')', found: %s", p.currentToken().Value)
		}
		p.advance()
		return node, nil
	default:
		return nil, fmt.Errorf("unexpected token: %s", token.Value)
	}
}

// parse count function
func (p *Parser) parseCountFunction() (*ASTNode, error) {
	// count ( toke.stgring )
	// token := p.currentToken()
	p.advance()
	if p.currentToken().Type != TokenParenOpen {
		return nil, fmt.Errorf("expected '(', found: %s", p.currentToken().Value)
	}
	p.advance()
	args := []*ASTNode{}

	// parse string
	if p.currentToken().Type != TokenString {
		return nil, fmt.Errorf("expected string, found: %s", p.currentToken().Value)
	}
	args = append(args, &ASTNode{
		Type:     NodeString,
		Value:    p.currentToken().Value,
		Children: nil,
	})

	// )
	p.advance()
	if p.currentToken().Type != TokenParenClose {
		return nil, fmt.Errorf("expected ')', found: %s", p.currentToken().Value)
	}
	p.advance() // go to next token
	return &ASTNode{
		Type:     NodeFunction,
		Value:    "count",
		Children: args,
	}, nil
}

// parse max function
func (p *Parser) parseMaxMinFunction() (*ASTNode, error) {
	// max ( expression, expression ) | min ( expression, expression )
	token := p.currentToken()
	p.advance() // get next token -> (
	if p.currentToken().Type != TokenParenOpen {
		return nil, fmt.Errorf("expected '(', found: %s", p.currentToken().Value)
	}
	p.advance()
	left, err := p.parseExpression()
	if err != nil {
		return nil, err
	}
	if p.currentToken().Type != TokenComma {
		return nil, fmt.Errorf("expected ',', found: %s", p.currentToken().Value)
	}
	p.advance()
	right, err := p.parseExpression()
	if err != nil {
		return nil, err
	}
	if p.currentToken().Type != TokenParenClose {
		return nil, fmt.Errorf("expected ')', found: %s", p.currentToken().Value)
	}
	p.advance()
	return &ASTNode{
		Type:  NodeFunction,
		Value: token.Value,
		Children: []*ASTNode{
			left, right,
		}, // left and right are expressions
	}, nil
}

// util Functions ----------------------------
// is toke ntype is binary operator
func isBinaryOperator(t Token) bool {
	return t.Type == TokenPlus || t.Type == TokenMinus || t.Type == TokenAsterisk || t.Type == TokenSlash
}

func (p *Parser) currentToken() Token {
	if p.pos >= len(p.tokens) {
		return Token{Type: TokenEOF, Value: ""}
	}
	return p.tokens[p.pos]
}

func (p *Parser) advance() {
	if p.pos < len(p.tokens) {
		p.pos++
	}
}

// --------------------------------------------

// func (p *Parser) parseFunction() (*ASTNode, error) {
// 	token := p.currentToken()
// 	p.advance()
// 	if p.currentToken().Type != TokenParenOpen {
// 		return nil, fmt.Errorf("expected '(', found: %s", p.currentToken().Value)
// 	}
// 	p.advance()
// 	args := []*ASTNode{}
// 	for p.currentToken().Type != TokenParenClose {
// 		arg, err := p.parseExpression()
// 		if err != nil {
// 			return nil, err
// 		}
// 		args = append(args, arg)
// 		if p.currentToken().Type == TokenComma {
// 			p.advance()
// 		} else if p.currentToken().Type != TokenParenClose {
// 			return nil, fmt.Errorf("expected ',' or ')', found: %s", p.currentToken().Value)
// 		}
// 	}
// 	if p.currentToken().Type != TokenParenClose {
// 		return nil, fmt.Errorf("expected ')', found: %s", p.currentToken().Value)
// 	}
// 	p.advance()
// 	return &ASTNode{
// 		Type:     NodeFunction,
// 		Value:    token.Value,
// 		Children: args,
// 	}, nil
// }

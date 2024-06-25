# Real-time Data Classification API Project

The Real-time Data Classification API is designed to process live data streams and classify them based on user-defined rules and also authenticate requests using JWT tokens. The API is built using [Go](https://go.dev/) and [Gin](https://gin-gonic.com/) framework and [PostgreSQL](https://www.postgresql.org/) as the database.

Lexer and parser components are implemented for a Domain Specific Language (DSL) for defining classification rules. The API also includes real-time data processing using WebSocket for live data streaming.

## Features

-   **JWT Authentication**:

    Secure endpoints with JWT tokens and signup and login endpoints.

-   **Database Integration**:

    PostgreSQL and GORM ORM for storing user-defined classification rules in db.

-   **Real-time Data Processing**:

    WebSocket for live data streaming with real-time data processing.

-   **User-Defined Classification Rules**:

    Created a DSL for defining and managing user-specific classification rules by developing lexer and parser. And Rule model for storing rules in the database with RuleJson field for storing ast converted json.

-   **API for Rule Management**:

    CRUD endpoints for managing classification rules by ensuring validation.

-   **Classification Engine**:

    Engine to apply user-defined rules to incoming data streams with minimal latency.

-   **Development Tools**:

    Utilize Go and Gin framework for API development by including development mode with live reloading using [`air`](https://github.com/air-verse/air) package.

## User Defined Classification Rules - DSL

The API supports user-defined classification rules using a Domain Specific Language (DSL). The DSL is defined as follows:

-   **Condition**: A condition is defined as a comparison between a expressions. A condition is a simple comparison. Example: `count('a') >= 10`.

-   **Expression**: An expression is combination of functions `COUNT('string')`, `max(expression,expression)`, `min(expression,expression)` and binary operators [`+,-,*,/`] and integers.
    Example: `count('aa') + max(count('b), 5) >= min(count('c'), 4)`.

-   **Grammar**: Grammer for the DSL is defined as follows:

    ```
    rule -> expression (">=" | "<=" | "==" | "!=") expression
    expression -> expression ("+" | "-") term | term
    term -> term ("*" | "/") factor | factor
    factor -> NUMBER | function
    function -> "count('STRING')" | "max(expression, expression)" | "min(expression, expression)"
    ```

## Installation

### Prerequisites

Before starting, ensure you have the following installed:

-   Go (1.16+)
-   PostgreSQL
-   `air` package for live reloading (optional)

### Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/survek/LDP-Hands-On-Projects
    cd Text-Classify-DSL
    ```

2. Install dependencies:

    ```sh
    go mod tidy
    ```

## Configuration

1.  Create a `.env` file in the root of the project and add the following environment variables:

    ```sh
        PGHOST=<host:port>
        PGDATABASE=<db-name>
        PGUSER=<username>
        PGPASSWORD=<password>
        SSLMODE=<sslmode>
        TIMEZONE=<tz>
        JWT_SECRET=<string>
    ```

-   Replace `<username>`, `<password>`, `<host:port>`, and `<db-name>` with your PostgreSQL database credentials
-   `JWT_SECRET` : Secret key for signing JWT token

## Usage

1.  To Start development server using following command:

-   Using air for live reloading:

    ```sh
    air
    ```

-   Or using `go run`:

    ```sh
    go run .
    ```

## Testing

To run tests, firstly create a test env file as `.env.test` (same as `.env` file) with testing db credentials in `test/` directory then run the following command:

```sh
go test ./test
```

## Project Structure

Project structure is as follows:

-   `config/`: Contains files for database connection, environment variables setup and JWT configuration for authentication.

-   `controller/`: Contains HTTP request handlers (controllers).

-   `classify-rule-dsl/`: Contains lexer and parser implementations for Domain Specific Language (DSL) for user-defined classification rules.

-   `middleware/`: Middleware functions, including JWT authentication middleware.

-   `models/`: Database models, including User and Rule models.

-   `.env`: Environment variables file.

-   `go.mod`: Go module file specifying dependencies.

-   `main.go`: Main entry point of the application.

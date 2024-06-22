# Expense Tracker Project

This project is a good solution for tracking personal expenses and incomes by providing detailed insights. This projectis is developed using [Fastify](https://fastify.dev/) for the API endpoints, [MongoDB](https://www.mongodb.com/) database & Mongoose for object data modeling and is written in TypeScript.

## Features

Following features are implemented in this project :

-   User registration and authentication and login using JWT tokens
-   Create, read, update, and delete expense and income transactions
-   API endpoint to get account data including balance, total expenses, total income, expense transactions, and income transactions by current or specific month and year
-   API endpoint for type-wise and category-wise transaction data for specific month and year
-   Fast and efficient API built with Fastify
-   Database management using MongoDB and Mongoose
-   Written in TypeScript for type-checking
-   Tests using Jest and Supertest
-   Github Actions for Testing

## Prerequisites

Following techstack required to run this project:

-   Node.js (v18.x or later)
-   npm (v10.x or later)
-   Mongodb database

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/survek/LDP-Hands-On-Projects
    cd Backend/Expense-Tracker
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root of the project and add the following environment variables:

    ```sh
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=secret12345
    ```

    - `MONGO_URI` : Connection string for your Mongodb database.
    - `JWT_SECRET` : Secret key for signing JWT token

## Usage

1.  To Start development server using following command:

    ```sh
    npm run dev
    ```

## Testing

To run the tests, run the following following command:

    npm run test

This will run the tests located in the `test/` directory.

## Project Structure

Project structure is as follows:

-   `src`: Contains the source code for the application.

    -   `index.ts`: Entry point for the Fastify server.

-   `.env`: Environment variables file.

-   `package.json`: Project configuration and dependencies.

-   `db`: Directory contains db connection functions file and models file

## API Endpoints

### POST /api/users/register

Creates a new user.

**Input:**

```json
{
    "name": "string",
    "email": "string",
    "password": "string"
}
```

**Output:**

```json
{
    "id": "string",
    "name": "string",
    "email": "string"
}
```

### POST /api/users/login

Login user and get JWT token.

**Input:**

```json
{
    "email": "string",
    "password": "string"
}
```

**Output:**

```json
{
    "token": "string"
}
```

### POST /api/transactions/

Create a new transaction.

**_Input_**: JWT token in Authorization header and Body

```json
{
    "date": "string",
    "amount": 0,
    "type": "income | expense",
    "category": "string",
    "description": "string"
}
```

**Output:**

```json
{
    "userId": "string",
    "_id": "string",
    "date": "string",
    "amount": 0,
    "type": "income | expense",
    "category": "string",
    "description": "string",
    "createdAt": "string",
    "updatedAt": "string"
}
```

### GET /api/transactions/:id

Get transaction by id.

**_Input_**: JWT token in Authorization header

**Output:** Same as above

### PUT /api/transactions/:id

Update transaction by id.

**_Input_**: JWT token in Authorization header and Body

```json
{
    "date": "string",
    "amount": 0,
    "type": "income | expense",
    "category": "string",
    "description": "string"
}
```

**Output:** Same as above

### DELETE /api/transactions/:id

Delete transaction by id.

**_Input_**: JWT token in Authorization header

**Output:**

```json
{
    "message": "Transaction {id} deleted successfully"
}
```

### GET /api/account/current-month

Get account data including balance, total expenses, total income, expense transactions, and income transactions by current month and year.

**_Input_**: JWT token in Authorization header

**Output:**

```json
{
    "userId": "string",
    "currentYear": 0,
    "currentMonth": 0,
    "balance": 0,
    "totalExpenses": 0,
    "totalIncome": 0,
    "expenseTransactions": [
        {
            "id": "string",
            "amount": 0,
            "category": "string",
            "description": "string",
            "date": "string"
        }
    ],
    "incomeTransactions": []
}
```

### GET /api/account/:year/:month

Same as above but for specific month and year.

### POST /api/account/:year/:month/:type

Get type-wise transaction data for specific month and year.

**_Input_**: JWT token in Authorization header

**Output:**

```json
{
    "userId": "string",
    "year": 0,
    "month": 0,
    "type": "string",
    "transactions": [
        {
            "id": "string",
            "amount": 0,
            "category": "string",
            "description": "string",
            "date": "string"
        }
    ]
}
```

### POST /api/account/:year/:month/:type/category-wise/

Get category-wise transaction data for specific month and year.

**_Input_**: JWT token in Authorization header

**Output:**

```json
{
    "userId": "string",
    "year": 0,
    "month": 0,
    "type": "string",
    "categoryWiseData": [
        {
            "category": "string",
            "totalAmount": 0
        }
    ]
}
```

# Solar News App API Documentation

Welcome to the Solar News App API documentation! Below, you'll find information on the available endpoints and their functionalities.

## Endpoints

### 1. `admin/sendOTPforEmail` [POST]

- **Description:** Sends an OTP for email verification for SignUp.
- **Request Body:**  { Email, Password }
- **Response:** Sends an OTP to the provided email address.
- **Note:**  Sends an Authenticate Email, Not Randomly Email
### 2. `admin/SignUp` [POST]

- **Description:** Signs up a new admin with OTP(Which has Sent On SignUp Email).
- **Request Body:** `` {
        "OTP":"788"
} ``


- **Response:** `` {
"message": "User Registered!!", 
token: token
} ``

### 3. `/login` [POST]

- **Description:** Logs in a user.
- **Request Body:** Includes user credentials for login.
- **Response:** Returns a JWT token upon successful login.

... (continue with the rest of the endpoints)

## Middleware

- **Authentication Middleware:** Ensures that all routes after it are only accessible with a valid JWT token. Used to protect routes that require authentication.

## Server

- **Port:** The server listens on the port specified by the `process.env.PORT` environment variable.
- **Connection:** Establishes connection to the MongoDB database.

Thank you for using the Solar News App API! If you have any questions or need further assistance, feel free to contact us.

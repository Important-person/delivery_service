# Delivery service
## Overview
Delivery service - API of simple delivery offer, with publication of ads and chats for discussion. Registered user can publish an ad, and other users can discuss and clarify any details about the product.

**Tools Used for Implementation:**
- The application is developed on the Node.js platform using the Express.js framework and the TypeScript language;
- User registration and authentication are handled using the Passport and Passport-Local libraries; the Express-Session library is used for managing session state between requests;
- Real-time chat functionality is implemented using the Socket.IO library;
- Data is stored in the non-relational database MongoDB; database interaction is facilitated by the Mongoose ODM.

## Installation and Launch
1.  Clone the repository
    - ```git clone git@github.com:Important-person/delivery_service.git```

2.  Install dependencies
    - ```npm install```
3.  Configure environment variables following the example in `.env-example`

4.  Build and launch the Docker containers
    - ```docker compose up --build``` - for production;
    - ```docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build``` - for development.

## Main Endpoints
1. **GET requests:**
   - `/api/advertisements` – get a list of advertisements based on filters;
   - `/api/advertisements/:id` – get details of a specific advertisement;

2. POST requests:
   - `/advertisements` – create an advertisement (authorized users only);
   - `/api/signup` – user registration;
   - `/api/signin` – user authentication;

3. DELETE request:
   - `/advertisements/:id` – delete an advertisement (only by its owner);

4. WebSocket events:
   - Server listens to:
     - `getHistory` – the server receives the recipient's ID and emits the `chatHistory` event;
     - `sendMessage` – the server receives the recipient's data and the message, then emits the `newMessage` event;
   - Server emits:
     - `chatHistory` – sends chat history to the client;
     - `newMessage` – sends a new message to the client;



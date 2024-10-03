# EcoEats

## Summary
EcoEats is a web application designed to help users reduce food waste by providing meal suggestions based on the ingredients they already have. Users can take a photo of their available ingredients, and EcoEats will use the OpenAI's API to suggest personalized recipes. The app also includes an inventory management system to track the ingredients, their quantities, and expiration dates, allowing users to better manage their food supplies. EcoEats aims to make meal planning easier, minimize waste, and encourage healthier eating habits.

## Tech Stack
- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
- ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)
- ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=white)

## Features
- **Recipe Generation:** Generates recipes from uploaded ingredient images using GPT-3.
- **Inventory Management:** Tracks ingredients and expiration dates using Firebase Firestore.
- **Secure Authentication:** User login with Firebase Auth to ensure secure access.

## Installation
### Clone the repository:
```bash
git clone <repo-link>
```

### Navigate to the project directory:
```bash
cd EcoEats
```

### Install dependencies:
```bash
npm install
```

### Set up Firebase and OpenAI API keys in a `.env` file.

### Run the server:
```bash
node server.js
```

### Run the app:
```bash
npm start
```

### Open the app in your browser:
Go to http://localhost:3000 in your browser to view the project.

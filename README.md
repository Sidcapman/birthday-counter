
# Birthday Countdown

This is a full-stack application that allows users to create and manage a list of birthdays. It provides a countdown to the next birthday for each person on the list.

## Features

- Create, edit, and delete birthdays.
- View a list of all birthdays.
- See a countdown to the next birthday for each person.
- Responsive design for use on desktop and mobile devices.

## Tech Stack

**Frontend:**

- [Next.js](https://nextjs.org/) - React framework for building user interfaces.
- [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js.

**Backend:**

- [Spring Boot](https://spring.io/projects/spring-boot) - Java framework for building stand-alone, production-grade Spring based Applications.
- [MongoDB](https://www.mongodb.com/) - NoSQL database for storing birthday data.
- [Maven](https://maven.apache.org/) - Dependency management for Java projects.

## Getting Started

### Prerequisites

- [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/birthday-countdown.git
   ```

2. **Backend Setup:**

   - Navigate to the `backend` directory:

     ```bash
     cd birthday-countdown
     ```

   - Run the Spring Boot application:

     ```bash
     ./mvnw spring-boot:run
     ```

3. **Frontend Setup:**

   - Navigate to the `frontend` directory:

     ```bash
     cd ../frontend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the development server:

     ```bash
     npm run dev
     ```

4. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
.gitignore
README.md
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── birthdayapp/
        │           ├── BirthdayAppApplication.java
        │           ├── config/
        │           ├── controller/
        │           ├── dto/
        │           ├── exception/
        │           ├── model/
        │           ├── repository/
        │           └── service/
        └── resources/
            └── application.properties
frontend/
├── package.json
├── public/
└── src/
    ├── app/
    ├── components/
    ├── hooks/
    ├── services/
    └── types/
```

- **backend/**: Contains the Spring Boot application.
- **frontend/**: Contains the Next.js application.
<img width="1457" alt="image" src="https://github.com/user-attachments/assets/125e21b8-5b75-47f4-9f6c-7592d7b9f338" />


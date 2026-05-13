# HabitTracker: Full-Stack Project & AWS CI/CD Overview

## 1. Project Description
**HabitTracker** is a premium, full-stack web application designed to help users build better routines and track their personal growth. It provides a clean, modern interface for managing daily habits, writing journal entries, and visualizing progress through interactive charts.

### Key Features:
*   **User Authentication**: Secure registration and login system.
*   **Habit Management**: Add, track, and complete daily habits with a streak system.
*   **Journaling**: A dedicated space for daily reflection and notes.
*   **Data Visualization**: Integrated charts (via Recharts) to track habit consistency over time.
*   **Multi-User Support**: A Node.js backend that stores individual user data in a structured JSON database.

---

## 2. Technical Stack
*   **Frontend**: React.js with Vite (for lightning-fast development and optimized production builds).
*   **Styling**: Modern UI with Lucide Icons and responsive layouts.
*   **Backend**: Node.js & Express API.
*   **Database**: Local JSON-based storage (`db.json`) for lightweight and fast data persistence.
*   **Testing**: Automated server-side testing to ensure API stability.

---

## 3. How It Works (Internal Logic)
1.  **Frontend**: The React application communicates with the Node.js backend using `fetch` calls. It uses a centralized dashboard to display habits and journal entries.
2.  **Backend**: The Express server handles API requests (Register, Login, Data Update). It reads/writes to `db.json` to persist user data.
3.  **Authentication**: When a user logs in, the backend verifies their credentials and returns their specific habit data, ensuring privacy and personalization.

---

## 4. DevOps & Deployment (The "AWS" Part)
This project is built using a professional **CI/CD (Continuous Integration / Continuous Deployment)** pipeline.

### The Pipeline Architecture:
1.  **Source (GitHub)**: The code is hosted on GitHub. Every time a developer "pushes" a change, the pipeline is instantly triggered.
2.  **Build & Test (AWS CodeBuild)**: 
    *   AWS spins up a temporary server.
    *   It runs `npm install` to get dependencies.
    *   It runs `npm run test` to make sure the code isn't broken.
    *   It runs `npm run build` to create the production-ready frontend.
3.  **Deploy (AWS CodePipeline)**: Once the build succeeds, the pipeline orchestrates the flow to the final hosting environment.

---

## 5. Deployment Process Step-by-Step
To get the project live on a public URL, we follow these steps:
1.  **GitHub Connection**: Link the AWS account to the GitHub repository.
2.  **Buildspec Configuration**: Create a `buildspec.yml` file (done) to tell AWS how to build the project.
3.  **Hosting Setup**: Create an **AWS Elastic Beanstalk** or **AWS Amplify** environment.
4.  **Final Trigger**: Push code to GitHub -> AWS CodePipeline triggers -> Build Succeeded -> **Live URL Generated**.

---

## 6. Conclusion
This project demonstrates not only full-stack development skills (React + Node.js) but also **Cloud Engineering** expertise by automating the entire software lifecycle using AWS professional services.

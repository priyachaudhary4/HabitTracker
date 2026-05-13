# HabitTracker: Personal Growth & Routine Management

HabitTracker is a premium, full-stack web application designed to help users build better routines, track daily habits, and maintain a personal journal.

## 🚀 Live Demos
*   **Primary (AWS CI/CD Pipeline)**: [Live on AWS](http://HabitTrackerApp-env.eba-bf5izwm3.eu-north-1.elasticbeanstalk.com)
*   **Mirror (Render)**: [Live on Render](https://habittracker-6f30.onrender.com)

---

## 🛠 Tech Stack
- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express
- **Database**: Local JSON-based storage (`db.json`)
- **DevOps**: AWS (CodePipeline, CodeBuild) & Render

---

## 🏗 Deployment Infrastructure

### 1. AWS CI/CD (Professional Production Pipeline)
This project features a fully automated enterprise-grade pipeline:
- **Source**: GitHub integration via Webhooks.
- **Build**: Automated tests and compilation via **AWS CodeBuild**.
- **Deploy**: Continuous deployment to **AWS Elastic Beanstalk**.

### 2. Render (Cloud Platform)
A secondary deployment is maintained on Render for high availability:
- **Environment**: Node.js Web Service.
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Auto-Deploy**: Automatically syncs with the GitHub repository.

---

## 📖 Features
- **User Authentication**: Secure Login/Register system.
- **Habit Tracking**: Manage daily routines with a streak system.
- **Journaling**: Interactive daily journal for reflection.
- **Progress Visualization**: Dynamic charts to monitor consistency.

---

## 📄 Documentation
Detailed technical documentation and presentation guides are available in the `/PROJECT_DOCUMENTATION` folder:
- `PROJECT_OVERVIEW.md`: Full project description.
- `AWS_DEPLOYMENT_DEEP_DIVE.md`: Step-by-step AWS configuration.
- `TECHNICAL_SETUP.md`: Local development and build instructions.
- `HOW_TO_PRESENT.md`: Guide for project evaluation.

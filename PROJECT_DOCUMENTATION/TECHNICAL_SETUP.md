# Technical Setup Guide: What We Implemented

This document details the exact technical steps we took to set up the HabitTracker project and its AWS infrastructure.

## Phase 1: Local Development Setup
1.  **Project Initialization**: We used Vite to set up a React + TypeScript project.
2.  **Backend Integration**: We created a `server.js` file using Express to handle API requests and serve static files.
3.  **Database Setup**: We implemented a multi-user JSON database (`db.json`) logic to handle multiple accounts.
4.  **Testing Suite**: We wrote `server.test.js` to perform automated health checks on our API.

## Phase 2: Preparing for AWS (CI/CD)
To move the project from "Local" to "Cloud," we added the following:
1.  **buildspec.yml**: This is a YAML file that AWS CodeBuild reads. It instructions AWS to:
    *   Use Node.js 20.
    *   Install dependencies.
    *   Run tests (`npm run test`).
    *   Compile the frontend (`npm run build`).
2.  **Production Readiness**: We updated `server.js` to automatically serve the `dist/` folder so the entire app runs on a single port.

## Phase 3: AWS Pipeline Construction
1.  **CodePipeline Setup**: We created an AWS CodePipeline named `HabitTrackerPipeline`.
2.  **Source Stage**: We connected the pipeline to GitHub so it "listens" for every code change.
3.  **Build Stage**: We configured AWS CodeBuild to use the `buildspec.yml`.
    *   *Result*: Every push now triggers an automatic test run. If tests fail, the build stops, preventing broken code from going live.

## Phase 4: Live Deployment (The Final Step)
1.  **Elastic Beanstalk**: We set up a Node.js environment on AWS.
2.  **Pipeline Finalization**: We added a "Deploy" stage to CodePipeline.
    *   *Result*: Once the tests pass, AWS automatically uploads the new version to the live URL.

## Summary of Commands Used:
*   `npm install`: Install dependencies.
*   `npm run dev`: Run locally for development.
*   `npm run test`: Validate the code before deployment.
*   `npm run build`: Prepare the app for the production server.

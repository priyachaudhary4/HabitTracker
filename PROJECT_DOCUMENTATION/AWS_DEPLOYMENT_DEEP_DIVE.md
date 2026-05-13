# 🚀 Comprehensive AWS Deployment Deep Dive: HabitTracker

This document provides a detailed, technical account of the end-to-end CI/CD pipeline implemented for the **HabitTracker** application. It moves beyond high-level concepts to document the specific steps, configurations, and troubleshooting measures taken within the AWS ecosystem.

---

## 🏗️ Architecture Overview
The deployment follows a **Continuous Integration & Continuous Deployment (CI/CD)** model using the following AWS services:
1.  **AWS CodeStar Connections**: Secure link to GitHub.
2.  **AWS CodeBuild**: Automated testing and compilation.
3.  **AWS Elastic Beanstalk (EB)**: Managed hosting environment (PaaS).
4.  **AWS CodePipeline**: The orchestrator that automates the transition between stages.

---

## 🛠️ Phase 1: Security & Identity (IAM)
Before any services were connected, we established the security framework using **Identity and Access Management (IAM)**.

### Steps Taken:
1.  **Service Role Creation**: We identified the `AWSCodePipelineServiceRole` automatically created by CodePipeline.
2.  **Permission Hardening**:
    *   **The Issue**: Initial deployments failed because CodePipeline lacked the authority to "talk" to Elastic Beanstalk.
    *   **The Fix**: We navigated to the IAM Console, searched for the service role, and attached the **`AWSElasticBeanstalkFullAccess`** policy.
    *   **Why?**: This allows the pipeline to create new "Application Versions" in EB whenever the build stage finishes.

---

## 📂 Phase 2: Source Control & GitHub Integration
We moved away from manual uploads to a **Push-to-Deploy** workflow.

### Steps Taken:
1.  **AWS CodeStar Connection**:
    *   In the AWS Console, we navigated to **Settings > Connections**.
    *   We created a new connection to **GitHub**.
    *   This involved authenticating via OAuth and installing the AWS Connector for GitHub on the specific `HabitTracker-main` repository.
2.  **Webhook Configuration**:
    *   We enabled the "Trigger on push" option.
    *   **Result**: Every time code is pushed to the `main` branch, a JSON payload is sent to AWS to start the pipeline.

---

## 🔨 Phase 3: The Build Engine (AWS CodeBuild)
CodeBuild acts as our quality gate. It ensures that no "broken" code (code that fails tests) ever reaches the production server.

### Steps Taken:
1.  **Build Project Configuration**:
    *   **Environment**: `Ubuntu` managed image.
    *   **Runtime**: `Standard:7.0` (which supports the latest Node.js).
2.  **The buildspec.yml logic**:
    We created a `buildspec.yml` in the root of the project. Here is the breakdown of what happens inside AWS during a build:
    ```yaml
    version: 0.2
    phases:
      install:
        runtime-versions:
          nodejs: 22 # Ensures compatibility with modern React/Vite
        commands:
          - npm install
      pre_build:
        commands:
          - npm run test # CRITICAL: If tests fail here, the build crashes and the pipeline stops.
      build:
        commands:
          - npm run build # Compiles React/TypeScript into a static 'dist' folder.
    artifacts:
      files:
        - '**/*' # Packages the server, the dist folder, and package.json for deployment.
    ```

---

## 🌐 Phase 4: Hosting (AWS Elastic Beanstalk)
We chose Elastic Beanstalk because it provides a managed environment that handles capacity provisioning, load balancing, and auto-scaling.

### Steps Taken:
1.  **Environment Setup**:
    *   **Platform**: Node.js 22 running on Amazon Linux 2023.
    *   **Tier**: Web Server Environment.
2.  **Configuration**:
    *   We ensured the `PORT` environment variable was handled by our `server.js` (listening on `process.env.PORT || 3000`).
    *   We configured the "Node Command" to `npm start` so EB knows how to launch our Express server.

---

## 🔄 Phase 5: Pipeline Orchestration (AWS CodePipeline)
This is the "glue" that connects everything.

### Steps Taken:
1.  **Creation**: Created a pipeline named `HabitTracker-Pipeline`.
2.  **Stage 1: Source**: Linked to the GitHub CodeStar connection.
3.  **Stage 2: Build**: Linked to the CodeBuild project created in Phase 3.
4.  **Stage 3: Deploy**: Linked to the Elastic Beanstalk environment created in Phase 4.
5.  **Sequential Logic**: We strictly ordered these to ensure that **Deploy** only happens after a successful **Build**.

---

## ⚠️ Critical Troubleshooting: What We Solved
During the setup, we encountered and resolved two major "roadblocks" that are common in professional DevOps:

### 1. The "Invisible Artifact" Error
*   **Symptom**: CodeBuild finished successfully, but the Deploy stage failed with `Artifact not found`.
*   **Resolution**: We discovered the `buildspec.yml` was not correctly packaging the `dist` folder. We updated the `artifacts` section to include `**/*` to ensure the compiled frontend was included in the ZIP file sent to Elastic Beanstalk.

### 2. IAM Permission Denied
*   **Symptom**: Pipeline stopped at the Deploy stage with `AccessDenied`.
*   **Resolution**: We manually updated the CodePipeline service role in IAM to include `elasticbeanstalk:CreateApplicationVersion` and `elasticbeanstalk:UpdateEnvironment` permissions. This is a classic example of **Principle of Least Privilege** troubleshooting.

---

## 📈 Summary for Evaluators
If asked about the deployment during a viva or presentation:
*   **"Is it automated?"**: Yes, we use a fully automated CI/CD pipeline triggered by GitHub webhooks.
*   **"How do you ensure code quality?"**: Every build triggers an automated test suite (`npm run test`) in AWS CodeBuild. If tests fail, the deployment is automatically aborted.
*   **"Is it secure?"**: Yes, all service-to-service communication is handled via dedicated IAM Roles with specific permission policies.

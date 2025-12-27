# StatLabAI - Data Analytics Platform

This project is the **frontend** implementation of the StatLabAI platform, a comprehensive tool for data analysis, preprocessing, and visualization.

## 🚀 Technology Stack

The frontend is built with a modern, high-performance stack:

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast development and bundling)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first CSS)
-   **UI Components**: Built with [Radix UI](https://www.radix-ui.com/) primitives (Accessible, unstyled components)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Language**: TypeScript

## 🏗️ Architecture & Future Plans

Currently, this repository contains the **Monolithic Frontend** application.

### Next Steps: Microservices Backend
We are currently in the phase of realizing the frontend user interface. The next phase of development will involve decomposing the backend logic into a scalable **Microservices Architecture**. This will include services for:
-   Authentication & User Management
-   Data Processing & Cleaning
-   Statistical Analysis
-   Reporting & Visualization

## 🛠️ Getting Started

To run this project locally:

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Start the development server**
    ```bash
    npm run dev
    ```

3.  **Open in Browser**
    Navigate to `http://localhost:3000` to view the application.

## 📁 Project Structure

-   `/src/components/auth`: Login and Registration flows
-   `/src/components/screens`: Main application dashboards and feature pages
-   `/src/components/ui`: Reusable UI components (Buttons, Inputs, etc.)
-   `/src/components/Sidebar.tsx`: Main navigation
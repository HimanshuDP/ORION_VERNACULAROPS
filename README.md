<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Orion VernacularOps

Orion VernacularOps is a powerful, multi-language AI operations dashboard designed for modern business analytics. It integrates Gemini AI for intelligent data insights and Firebase for secure, real-time data management.

## 🚀 Core Functionalities

- **🤖 AI-Powered Insights**: Integrated with Gemini AI to provide real-time analysis, chart generation, and smart query suggestions based on your data.
- **🌐 Multi-Language Support**: Full support for both **English** and **Hindi** interfaces, allowing users to switch seamlessly between languages.
- **🔐 Secure Authentication**: Robust user authentication and data isolation powered by Firebase Auth.
- **📊 Interactive Data Viewer**: Upload, manage, and visualize CSV data with an intuitive interface.
- **💻 Integrated Terminal**: A specialized command-line interface for interacting with the AI system and processing business logic.
- **☁️ Persistent Storage**: Chat history and uploaded files are securely stored and synced across sessions using Firebase Firestore and Storage.
- **🛠️ Developer Inspector**: A built-in tool for real-time monitoring of application state, auth sessions, and AI context.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Backend / DB / Auth**: [Firebase](https://firebase.google.com/)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Canvas Confetti, Tailwind Animations

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)
- A Firebase project setup

### Installation

1. **Clone and Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file (copy from `.env.example`) and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *Ensure you also have your Firebase configuration in place if using your own instance.*

3. **Run the app:**
   ```bash
   npm run dev
   ```

## 🌐 View in AI Studio

You can also view and interact with the app in AI Studio: [Orion VernacularOps on AI Studio](https://ai.studio/apps/drive/1MoMOIREJsb3pogPijwbxyuDp1x9RP-Pb)

---
Developed for Advanced AI Operations and Vernacular Data Analysis.

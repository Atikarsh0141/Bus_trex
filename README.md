# BUSTREX - AI-Powered Transit Management System

BUSTREX is a modern, AI-enhanced web application designed for real-time bus tracking, route management, and predictive analytics. It provides a comprehensive suite of tools for transit administrators, drivers, and passengers, leveraging Google's AI through Genkit to deliver smart features and an intuitive user experience.

![BUSTREX Dashboard](https://storage.googleapis.com/aifirebase-1.appspot.com/screenshots/bustrex-dashboard.png)

## ✨ Key Features

- **Live Map Visualization**: Track the entire bus fleet in real-time on an interactive map, with details on status, passenger load, and route information.
- **Personalized User Dashboards**: Logged-in users see a custom dashboard with their favorite routes, usage statistics, and recent notifications.
- **AI-Powered "Next Suggested Action"**: The dashboard proactively suggests the most relevant action (e.g., "Track Bus," "View Analytics") to the user based on their role, time of day, and live route status.
- **Advanced Analytics**: A dedicated analytics page with interactive charts visualizing key metrics like passenger ridership, on-time performance, and route efficiency.
- **AI-Optimized Driver Communication**: An admin tool that uses AI to determine the most effective communication channel (voice, chat, or push notification) to send alerts to drivers based on the message's urgency and content.
- **AI-Personalized Notifications**: A system for sending targeted user notifications where an AI model chooses the optimal delivery channel (Push, SMS, In-App) based on user preferences and context.
- **Conversational AI Assistant**: An integrated chatbot, powered by a Gemini model, that can answer user questions about routes, schedules, and the BUSTREX system.
- **Secure Authentication & Profiles**: Complete user management system using Firebase Authentication (Email/Password & Google OAuth). Users can manage their profiles and upload profile pictures to Firebase Storage.
- **Modern, Responsive UI**: Built with ShadCN UI and Tailwind CSS for a clean, accessible, and responsive interface that works on all devices.

## 🤖 AI & Genkit Flows

The application heavily utilizes **Google AI** and **Genkit** to power its intelligent features:

- **`suggested-action-flow`**: Analyzes user context (role, time of day, route status) to recommend the next best action.
- **`driver-alert-optimization`**: Determines the optimal communication medium (chat, voice, notification) for driver alerts based on urgency and information type.
- **`personalized-notifications`**: Selects the best channel to deliver a notification to a user by considering their preferences and the message content.
- **`assistant-flow`**: Powers the conversational AI assistant, maintaining chat history and providing helpful responses.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Cloud Storage)
- **Generative AI**: [Google AI](https://ai.google/) & [Genkit](https://firebase.google.com/docs/genkit)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Charting**: [Recharts](https://recharts.org/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bustrex.git
cd bustrex
```

### 2. Install Dependencies

Install the required packages using npm:

```bash
npm install
```

### 3. Set Up Firebase

This project is configured to work with Firebase.

1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  Go to **Project Settings** > **General**.
3.  Under "Your apps," create a new **Web app**.
4.  Copy the `firebaseConfig` object.
5.  Create a `.env.local` file in the root of the project and add your Firebase configuration details there. The `src/firebase/config.ts` file is set up to read these values.
6.  Enable **Authentication** (with Email/Password and Google providers), **Firestore**, and **Cloud Storage** in the Firebase Console.

### 4. Set Up Google AI API Key

The Genkit flows require a Google AI API key to function.

1.  Obtain an API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
2.  Add the key to your `.env.local` file:

```
GEMINI_API_KEY=your_api_key_here
```

### 5. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application should now be running at [http://localhost:9002](http://localhost:9002).

### 6. Run the Genkit Flows (Optional)

To inspect, test, and run the Genkit flows locally in the Genkit developer UI, run the following command in a separate terminal:

```bash
npm run genkit:watch
```

This will start the Genkit server, and you can access the UI at [http://localhost:4000](http://localhost:4000).

---

This README provides a clear entry point for any developer looking to understand, run, or contribute to the BUSTREX project.
# Bus_Trex

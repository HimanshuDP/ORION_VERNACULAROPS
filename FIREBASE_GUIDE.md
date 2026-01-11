# 🛠️ Firebase Setup Guide for Vernacular Ops

Follow these steps to get your Firebase configuration keys and enable persistent data storage.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** (or select an existing one).
3. Give it a name (e.g., `vernacular-ops`) and follow the prompts.
4. (Optional) Disable Google Analytics if you want a faster setup.

## Step 2: Register a Web App
1. On the Project Overview page, click the **Web icon (`</>`)**.
2. Register the app as `VernacularOpsWeb`.
3. **DO NOT** check "Firebase Hosting" (unless you plan to deploy later).
4. Click **"Register app"**. 
5. You will see a `firebaseConfig` object. **Keep this window open!**

## Step 3: Enable Authentication
1. In the left sidebar, go to **Build > Authentication**.
2. Click **"Get started"**.
3. Under **"Sign-in method"**, select **"Email/Password"**.
4. Enable the first toggle (**Email/Password**) and click **"Save"**.

## Step 4: Enable Firestore Database
1. In the left sidebar, go to **Build > Firestore Database**.
2. Click **"Create database"**.
3. Select a location (e.g., `asia-south1` or `us-central`).
4. Select **"Start in test mode"** (to begin immediately) or **"Production mode"**.
5. Click **"Create"**.

## Step 5: Update your `.env.local`
Go back to the window in **Step 2** (or go to Project Settings ⚙️ > General) and copy the values into your `file:///c:/Users/DELL/Desktop/Projects/GDGoC_Project/vernacular-ops/.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_apiKey
VITE_FIREBASE_AUTH_DOMAIN=your_authDomain
VITE_FIREBASE_PROJECT_ID=your_projectId
VITE_FIREBASE_STORAGE_BUCKET=your_storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId
VITE_FIREBASE_APP_ID=your_appId
```

## Step 6: Restart your App
Once the file is saved, restart your development server:
1. Stop the current terminal (Ctrl + C).
2. Run `npm run dev` again.

**Your app will now automatically detect these keys and switch from "Mock Mode" to "Real Persistent Mode"!** 🚀

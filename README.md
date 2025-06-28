
# NutriGenie — Your AI-Powered Personal Diet Companion

**NutriGenie** is a full-stack web app that helps users generate personalized diet plans tailored to their health goals, preferences, and lifestyle. Built with React, Node.js, Express, and MongoDB, NutriGenie leverages generative AI to create complete diet plans, meal ideas, grocery lists, and tips — all designed to help users stay healthy and on track.

---
## 🌐 Live Demo

👉 [**Visit NutriGenie**](https://nutrigenie-app.onrender.com/)

---

## 🚀 Features

✅ **User Authentication** — Register, log in (including Google Login), and manage your profile securely with JWT cookies.

✅ **Health Profile** — Store and update personal health metrics like age, gender, height, weight, BMI, and BMR.

✅ **Personalized Diet Plans** — Generate AI-driven diet plans based on your goals (e.g., muscle gain, weight loss, maintenance).

✅ **Multi-Day Meal Plans** — Specify how many days you want your plan for, and NutriGenie creates detailed meal breakdowns.

✅ **Recipe Suggestions** — Get recipes, nutritional targets, grocery lists, and practical healthy living tips.

✅ **Dashboard & My Plans** — View your latest plan on login, keep track of your diet plans, and publish multiple plans.

✅ **Fully Responsive** — Works smoothly on desktop, tablet, and mobile screens.

---

## 🧩 Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT, Google OAuth
* **AI Integration:** Gemini for generating diet content

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AnanditaSaxenaa/nutrigenie.git
cd nutrigenie
```

### 2️⃣ Install dependencies

```bash
# For backend
cd api
npm install

# For frontend
cd frontend
npm install
```

### 3️⃣ Create environment variables

Create a `.env` file in your `api` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173

```

Create a `.env` file in your `frontend` folder and add:

```env

VITE_GEMINI_API_KEY= gemini_api_key
VITE_GOOGLE_CLIENT_ID= client_id_from_google_cloud
VITE_BACKEND_URL=http://localhost:4000

```
---

### 4️⃣ Run the app

```bash
# Start backend
cd api
npm run dev

# Start frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 🛡️ Deployment

* Backend deployed on **Render**
* Frontend deployed on **Render**

Make sure your production environment variables are correctly set for database, JWT, and AI API keys.

---

## 📂 Project Structure

```plaintext
nutrigenie/
 ├── api/         # Express server, routes, controllers, models
 ├── frontend/      # React app        
 ├── README.md    # This file!
```


---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐️ Show your support

If you like **NutriGenie**, please ⭐️ the repo and share it! Feedback and contributions are welcome!

---

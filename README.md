# 🔥 Roast My Code

An AI-powered web app that brutally roasts your code, gives actionable feedback, and suggests improved versions — all in real time.

## 🚀 Live Demo
👉 https://roast-my-code-mu.vercel.app

---

## ✨ Features

- 🧠 AI-generated **humorous code roasts**
- 🛠️ Structured **feedback** (Bugs, Optimization, Readability)
- 🔧 **Improved code suggestions**
- ⚡ Real-time response using API routes
- 🎨 Clean, animated UI with Tailwind CSS
- 📋 One-click **copy improved code**
- 💡 Handles invalid AI responses gracefully

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript  
- **Backend:** Next.js API Routes  
- **Styling:** Tailwind CSS  
- **Syntax Highlighting:** PrismJS  
- **Deployment:** Vercel  

---

## 📂 Project Structure

app/
├── page.tsx          # Main UI (client-side)
├── layout.tsx        # Metadata & layout
└── api/
└── roast/
└── route.ts # AI logic & API handler

---

## ⚙️ Setup Locally

``` bash
git clone https://github.com/yash-2304/roast-my-code.git
cd roast-my-code
npm install
npm run dev
``` 

Create a .env.local file:
OPENAI_API_KEY=your_api_key_here

🚀 Deployment

Deployed on Vercel with:
	•	Environment variables configured
	•	Automatic CI/CD from GitHub


💡 How It Works
	1.	User inputs code
	2.	Frontend sends request to /api/roast
	3.	Backend calls AI model
	4.	Response is structured into:
	•	Roast
	•	Feedback
	•	Improved Code
	5.	UI renders animated output


🧪 Error Handling
	•	Guards against malformed AI responses
	•	Fallback UI for failed requests
	•	Prevents showing unchanged code as “improved”

⸻

🔮 Future Improvements
	•	🎚️ Adjustable roast intensity (fun mode)
	•	🌐 Better language detection
	•	🔄 Side-by-side code comparison
	•	🔗 Shareable roast links
	•	📊 Code quality scoring system

⸻

👨‍💻 Author

Yash Prajapati
	•	🔗 LinkedIn: https://www.linkedin.com/in/yash-prajapati-29a423187
	•	💻 GitHub: https://github.com/yash-2304

⸻

⭐ Show Some Love

If you like this project:
	•	⭐ Star the repo
	•	🍴 Fork it
	•	🔥 Roast your friends’ code

⸻

⚠️ Disclaimer

This app is for fun + learning purposes.
Roasts may hurt feelings… proceed at your own risk 😈




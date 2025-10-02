# 🏛️ Athena - Personal Development Platform

**Embrace the wisdom of ancient Greece on your journey to personal excellence.**

Athena is a Greek mythology-themed personal development platform that helps users create comprehensive self-improvement plans through AI-powered analysis and guidance from personalized Greek god mentors.

![Greek Temple Theme](https://img.shields.io/badge/Theme-Greek%20Mythology-gold)
![Next.js](https://img.shields.io/badge/Next.js-14.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 📜 Table of Contents
- [Features](#-features)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Design Philosophy](#-design-philosophy)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

### 🎯 **Personal Profile & Assessment**
- Define your purpose, vision, and core values
- Complete comprehensive self-assessment questionnaires
- AI-powered analysis of your personal development needs

### 📊 **Radar Chart Analytics**
- Visual representation of your growth across 7 key areas:
  - **Habits** - Daily routines and consistency
  - **Mindset** - Mental resilience and growth mindset
  - **Relationships** - Social connections and communication
  - **Health** - Physical and mental wellness
  - **Creativity** - Innovation and creative expression
  - **Purpose** - Life direction and meaning
  - **Learning** - Continuous education and skill development

### 🗣️ **AI-Powered Greek God Mentors**
Chat with personalized AI mentors inspired by Greek mythology:
- **Athena** - Goddess of Wisdom (Strategic guidance and wise counsel)
- **Ares** - God of War (Motivation and bold action)
- **Hermes** - Messenger God (Communication and adaptability)

### 🍅 **Pomodoro Timer**
- Built-in productivity timer with work/break cycles
- Track completed pomodoro sessions
- Desktop notifications for session completion

### 🧵 **Personalized Thread Weaving**
- AI-generated actionable improvement suggestions based on your profile
- Tailored recommendations for your specific growth areas
- "Threads to weave" - concrete steps for personal development

## 🎥 Demo

[![Watch the demo](https://img.youtube.com/vi/Wzqu1exdKTA/0.jpg)](https://www.youtube.com/watch?v=Wzqu1exdKTA)

*Click the image above to see Athena in action! Watch how users create profiles, chat with AI mentors, and track their personal development journey.*

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB database
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/parkab/Athena-GirlHacks-2025.git
   cd Athena-GirlHacks-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Tech Stack

### Frontend
- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js & React-Chart.js-2** - Data visualization for radar charts

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB with Mongoose** - Database and ODM
- **JSON Web Tokens** - Authentication
- **bcrypt** - Password hashing

### AI Integration
- **Google Gemini AI** - Personality-based chat and analysis
- **Custom personality system** - Greek god-themed AI mentors

## 📂 Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Main dashboard page
│   ├── profile/       # Profile setup page
│   ├── chat/          # AI mentor chat page
│   └── pomodoro/      # Productivity timer page
├── components/
│   ├── AuthGuard.tsx  # Authentication wrapper
│   ├── ChatUI.tsx     # AI chat interface
│   ├── RadarChart.tsx # Personal development visualization
│   ├── PomodoroTimer.tsx # Productivity timer
│   └── ProfileForm.tsx # User profile setup
└── lib/
    ├── auth.ts        # Authentication utilities
    ├── db.ts          # Database connection
    ├── gemini.ts      # AI integration
    ├── models.ts      # Database schemas
    └── personalities.ts # AI personality definitions
```

## 🎨 Design Philosophy

The application embraces ancient Greek aesthetics with:
- **Classical typography** with serif fonts
- **Gold and marble color palette** 
- **Temple-inspired layouts**
- **Mythological iconography**

## 🔮 Future Improvements

- **Social Features** - Share achievements and support friends such as a community dashboard
- **Curated Resources Page** - A collection of well-renowned self-improvement resources, accessible directly in the app.
- **Privacy & Security** - Implementing strong measures to ensure sensitive personal data is never retained or misused.
- **Deeper Personalization & Advanced Analytics** - Expanding Athena’s ability to track long-term progress and suggest evolving threads over time.
- **Mobile Responsive Version** - Optimized experience for phones and tablets
- **More Greek God Mentors** - Apollo (creativity/healing), Hades (resilience), Artemis (focus/independence), Poseidon (ruthlessness), Aphrodite (love)
- **Exportable Progress Reports** - PDF summaries of personal development journey

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a PR.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

**What this means:**
- ✅ You can use this code for personal or commercial projects
- ✅ You can modify and distribute it
- ✅ You can include it in proprietary software
- ⚠️ You must include the original copyright notice

## 🙏 Acknowledgments

🚀 Built with passion at GirlHacks 2025 
✨ Made to inspire personal growth, one thread at a time.

---

*"The unexamined life is not worth living." - Socrates*

Embark on your journey of self-discovery and personal excellence with the wisdom of the ancient gods. 🏛️✨

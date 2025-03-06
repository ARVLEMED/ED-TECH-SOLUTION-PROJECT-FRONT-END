# EdTech App - Frontend

## 📌 Overview
The **EdTech App** is a web-based platform designed to streamline communication between teachers, parents, and administrators. It enables teachers to upload student results and welfare details, allowing parents to monitor their child's academic performance and well-being in school.

## 🚀 Features
- **User Authentication** (Login & Sign Up)
- **Admin Dashboard** for managing students, classes, exams, and welfare reports
- **Teacher Portal** to upload results and manage student welfare
- **Parent Portal** to track student performance and well-being
- **Class & Exam Management**
- **Welfare Reports categorized into Academic, Health, and Discipline**

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, Redux Toolkit
- **State Management:** Redux
- **Authentication:** Auth0
- **Backend:** Flask (Connected via API)

## 📦 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/edtech-frontend.git
cd edtech-frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
```

### 4️⃣ Start the Development Server
```bash
npm start
```
The app should now be running at `http://localhost:3000`.

## 📁 Project Structure
```
├── src
│   ├── components    # Reusable UI components
│   ├── pages         # Page components (Dashboard, Login, etc.)
│   ├── redux         # Redux store and slices
│   ├── services      # API calls & authentication services
│   ├── styles        # Global styles (Tailwind CSS)
│   ├── App.js        # Main application component
│   ├── index.js      # Entry point
│
├── public            # Static assets
├── .env              # Environment variables
├── package.json      # Dependencies & scripts
```

## 🔥 Deployment
### 🚀 Deploy to Vercel
```bash
npm run build
vercel deploy
```
OR
### 🚀 Deploy to Netlify
```bash
npm run build
netlify deploy
```

## 🤝 Contributing
1. Fork the repo & create a new branch
2. Make your changes & commit
3. Open a pull request

## 📜 License
This project is licensed under the **MIT License**.

## 📧 Contact
For questions or feedback, reach out via [your-email@example.com](mailto:your-email@example.com).


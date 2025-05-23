---

```markdown
# 💌 Chain Love Letter NFT Mint App

A romantic on-chain NFT minting interface where users can write love letters, generate themed cards, and mint them directly to Zora via a React + Flask full-stack application.

---

## 📁 Project Structure

```

zora-loveletter/
├── backend/           # Python Flask backend to generate letter images
├── Great\_Vibes/       # Contains font: GreatVibes-Regular.ttf
├── image/             # Backgrounds and icon images
├── output/            # Generated composite love letter images (saved by backend)
├── public/
├── src/               # React frontend source files
├── .gitignore
├── package.json
└── README.md

````

---

## 🚀 Frontend Setup (React + Vite)

### 1. Install dependencies

```bash
npm install
````

### 2. Run the frontend dev server

```bash
npm run dev
```

The site will be available at:

```
http://localhost:5173/
```

---

## 🧠 Backend Setup (Flask)

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install Python dependencies

```bash
pip install flask flask-cors pillow
```

### 3. Start Flask server

```bash
python app.py
```

Flask will be running at:

```
http://localhost:5000/
```

---

## 🖼️ Usage Flow

1. Fill out "From", "To", and your love message on the page
2. Click `Generate` to create an image (saved under `/output`)
3. A modal preview of your generated card will appear
4. Click `Mint NFT` to proceed to blockchain minting (Zora 1155, IPFS required)

---

## 📦 Requirements

* Node.js v18+
* Python 3.8+
* Local fonts in `Great_Vibes/`
* Optional: your own `.env` to store private keys, IPFS tokens, etc.

---

## ⚠️ Notes

* Do not upload `node_modules/` or `output/` folder to GitHub
* Your `.gitignore` file should handle that
* The backend image generator uses Pillow and picks a random background from `image/loveletter{1~13}.jpg`

---

## ❤️ Credits

Created by the On-chain Love Team
Powered by: React · Vite · Flask · IPFS · Zora Protocol

```

---
```

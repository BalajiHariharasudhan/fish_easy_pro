# 🐟 FishEasy - Voice-Enabled Fish Marketplace

FishEasy is a full-stack, voice-enabled, multi-role e-commerce web application designed to help uneducated fishermen easily list and sell fish online. Buyers can browse and purchase fish with a smooth, responsive, and modern interface similar to top platforms like Amazon and Flipkart.

---

## 🌐 Live Demo

>(https://frolicking-brigadeiros-4b1141.netlify.app)

---

## 🔧 Technologies Used

### Frontend
- React.js
- React Router DOM
- Tailwind CSS / Bootstrap
- Web Speech API (Voice Input)
- Axios
- AOS / Framer Motion (Animations)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for Authentication
- Razorpay (Simulated) for UPI

---

## 🚀 Features

### 👥 Authentication
- Role-based login/signup (Seller, Buyer, Admin)
- JWT-based secure authentication

### 🧑‍🌾 Seller Panel
- Voice-enabled fish listing using Web Speech API  
  Example: “2 kg prawn 300 rupees”
- Automatic parsing of quantity, fish name, and price
- Fish image auto-association
- Product list management (edit/delete)
- Sales statistics dashboard

### 🛒 Buyer Panel
- Browse all fish products with image, weight, and price
- Sort/filter by fish type, price, weight
- Add to cart, checkout with:
  - ✅ Cash on Delivery
  - ✅ UPI (Simulated Razorpay)
- View order history
- Product wishlist
- Product ratings & reviews

### 📞 SHG Complaint Panel
- Raise complaints via text
- “Call Support” button (opens dialer)
- View and track complaint status
- Admin reply and complaint management

### 🛠 Admin Panel
- View and manage all users, complaints, and orders
- Sales analytics (top-selling fish, active sellers)
- Complaint resolution and status updates

### 📱 Additional Features
- Fully responsive UI
- Premium layout with animations
- Multi-language support for sellers' voice input
- Email alerts for orders and complaints
- PDF invoice download
- Location-aware delivery estimate (future scope)

---

## 🐠 Supported Fish Types

- Prawn
- Salmon
- Pomfret
- Tuna
- Sardine
- Mackerel
- Catla
- Rohu
- Hilsa
- Anchovy
- Kingfish
- Tilapia
- Snapper
- Crab
- Squid

(Each fish is auto-mapped to a realistic image.)



---

## 🔌 How It Works

1. Sellers log in and use **voice commands** to add products.
2. The app extracts quantity, fish name, and price.
3. Fish is stored in the database and image is auto-mapped.
4. Buyers browse and purchase listed fish.
5. Payments are supported via UPI (Razorpay) and COD.
6. Complaints can be submitted, tracked, and resolved.
7. Admins manage everything via a separate dashboard.

---

## 🧪 Local Setup

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- npm

### Steps

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/fisheasy.git
cd fisheasy

# Backend setup
cd server
npm install
npm start

# Frontend setup
cd ../client
npm install
npm start


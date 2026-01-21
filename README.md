# 🏠 AirBNB San Francisco Listings

A modern, responsive web application that displays AirBNB listings in San Francisco using AJAX data fetching with JavaScript’s Fetch API and async/await.

## 🚀 Live Demo
👉 **View Live Site:**  
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/  
*(Replace with your actual GitHub Pages URL)*

---

## 📋 Project Overview

This project showcases **50 AirBNB listings from San Francisco** with a clean, user-friendly interface. Built as part of a web development class assignment, it demonstrates proficiency in:

- AJAX data fetching using modern JavaScript
- Responsive web design with Bootstrap 5
- DOM manipulation and event handling
- Data filtering and sorting logic
- Clean, maintainable code structure

---

## ✨ Features

### ✅ Required Features
- **AJAX Data Loading** using `fetch()` with `async/await`
- **Displays exactly 50 listings** from the JSON dataset
- **Listing Information Display**
  - Listing name
  - Description (truncated for readability)
  - Amenities (first 4 with icons)
  - Host name and photo
  - Price per night
  - Thumbnail image

---

### 🎨 Creative Additions

#### 1. 🔍 Real-time Search
- Search by listing name, description, neighborhood, or host name  
- Debounced input for better performance  
- Instant results while typing  

#### 2. 📊 Dynamic Statistics Dashboard
- Total listings count
- Average price calculation
- Average rating display
- Animated stat cards in the hero section

#### 3. 🔃 Advanced Sorting
- Sort by price (low → high / high → low)
- Sort by rating (highest first)
- Sorting maintains active search filters

#### 4. 🎭 Enhanced UI / UX
- Smooth animations and transitions
- Hover effects on listing cards
- Property type badges with icons
- Superhost indicators
- Star ratings and review counts
- Fully responsive layout
- Loading spinner with friendly messages

#### 5. 🏷️ Amenities Visualization
- Smart icon matching for common amenities
- Font Awesome–based visual badges
- Displays top 4 amenities per listing

---

## 🛠️ Technologies Used

- **HTML5** – Semantic markup  
- **CSS3** – Custom styles and animations  
- **JavaScript (ES6+)** – Async/await, arrow functions, template literals  
- **Bootstrap 5.3.2** – Responsive layout and components  
- **Font Awesome 6.4** – Icons  
- **AJAX / Fetch API** – Asynchronous data loading  

---

## 📁 Project Structure

airbnb-listings/
│
├── index.html # Main HTML file
├── css/
│ └── main.css # Custom styles
├── js/
│ └── main.js # JavaScript with AJAX logic
├── airbnb_sf_listings_500.json # Dataset (500 listings)
└── README.md # Project documentation


---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server **or** GitHub Pages

---

### 🔧 Installation

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

#### 2. Start a local server
Using Python 3

```bash
python -m http.server 8000
```

Using Node.js

```bash
npx http-server
```

### Using VS Code Live Server

Install the Live Server extension

Right-click index.html → Open with Live Server

#### 3. Open in browser
arduino

http://localhost:8000


## 💻 Code Highlights
AJAX Implementation (Async/Await)
```bash
async function loadData() {
  try {
    const response = await fetch("./airbnb_sf_listings_500.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const listings = await response.json();
    allListings = listings.slice(0, 50);

    updateStats(displayedListings);
    redraw(displayedListings);

  } catch (error) {
    console.error("Error loading listings:", error);
  }
}
Dynamic Card Generation
javascript
Copy code
function getListingCode(listing) {
  // Parses amenities, generates icons, creates responsive card HTML
  return `<div class="col-lg-3 col-md-4 col-sm-6">...</div>`;
}
```

## 👨‍💻 Author
Gurudatt Gaonkar
GitHub: @Gurudatt007
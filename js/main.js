function MainModule(listingsID = "#listings") {
  const me = {};
  
  let allListings = [];
  let displayedListings = [];
  
  const listingsElement = document.querySelector(listingsID);
  const loadingElement = document.getElementById("loading");
  const noResultsElement = document.getElementById("noResults");
  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");
  const sortFilter = document.getElementById("sortFilter");

  // Helper function to parse price string to number
  function parsePrice(priceStr) {
    return parseFloat(priceStr.replace(/[$,]/g, ""));
  }

  // Helper function to parse amenities array string
  function parseAmenities(amenitiesStr) {
    try {
      // Remove the brackets and split by comma, then clean up
      const cleaned = amenitiesStr.replace(/[\[\]]/g, "");
      const items = cleaned.split('", "').map(item => 
        item.replace(/^"|"$/g, "").replace(/\\u\d{4}/g, "").trim()
      );
      return items.filter(item => item.length > 0);
    } catch (e) {
      return [];
    }
  }

  // Helper function to get property type icon
  function getPropertyTypeIcon(propertyType) {
    if (propertyType.includes("apartment") || propertyType.includes("Apartment")) {
      return "fa-building";
    } else if (propertyType.includes("house") || propertyType.includes("home")) {
      return "fa-home";
    } else if (propertyType.includes("condo") || propertyType.includes("Condo")) {
      return "fa-city";
    } else if (propertyType.includes("room") || propertyType.includes("Room")) {
      return "fa-door-open";
    }
    return "fa-bed";
  }

  // Helper function to get amenity icon
  function getAmenityIcon(amenity) {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi") || lowerAmenity.includes("internet")) {
      return "fa-wifi";
    } else if (lowerAmenity.includes("kitchen")) {
      return "fa-utensils";
    } else if (lowerAmenity.includes("washer") || lowerAmenity.includes("dryer")) {
      return "fa-soap";
    } else if (lowerAmenity.includes("parking")) {
      return "fa-parking";
    } else if (lowerAmenity.includes("pool")) {
      return "fa-swimming-pool";
    } else if (lowerAmenity.includes("tv")) {
      return "fa-tv";
    } else if (lowerAmenity.includes("heating") || lowerAmenity.includes("air")) {
      return "fa-temperature-high";
    }
    return "fa-check";
  }

  // Generate HTML for a single listing card
  function getListingCode(listing) {
    const amenities = parseAmenities(listing.amenities);
    const topAmenities = amenities.slice(0, 4); // Show first 4 amenities
    const price = parsePrice(listing.price);
    const rating = listing.review_scores_rating || 0;
    const reviewCount = listing.number_of_reviews || 0;
    const isSuperhost = listing.host_is_superhost === "t";
    const propertyIcon = getPropertyTypeIcon(listing.property_type);
    
    // Clean up description
    const description = listing.description 
      ? listing.description.replace(/<[^>]*>/g, " ").substring(0, 150) + "..."
      : "No description available.";

    const amenitiesHTML = topAmenities.map(amenity => 
      `<span class="amenity-badge">
        <i class="fas ${getAmenityIcon(amenity)}"></i>
        ${amenity.substring(0, 15)}${amenity.length > 15 ? "..." : ""}
      </span>`
    ).join("");

    return `
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="listing card h-100">
          <div class="card-img-top-container">
            <span class="property-type-badge">
              <i class="fas ${propertyIcon}"></i> ${listing.room_type}
            </span>
            <img
              src="${listing.picture_url || 'https://via.placeholder.com/400x300?text=No+Image'}"
              class="card-img-top"
              alt="${listing.name}"
              onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
            />
          </div>
          <div class="card-body">
            ${rating > 0 ? `
              <div class="listing-rating">
                <i class="fas fa-star rating-star"></i>
                <span class="rating-value">${rating.toFixed(2)}</span>
                <span class="rating-count">(${reviewCount} reviews)</span>
              </div>
            ` : ''}
            
            <h5 class="card-title">${listing.name}</h5>
            
            <div class="listing-price">
              ${listing.price}
              <span class="price-label">/ night</span>
            </div>
            
            <p class="listing-description">${description}</p>
            
            <div class="amenities-preview">
              ${amenitiesHTML}
            </div>
            
            <div class="host-info">
              <img 
                src="${listing.host_thumbnail_url || 'https://via.placeholder.com/40?text=Host'}" 
                alt="${listing.host_name}"
                class="host-thumbnail"
                onerror="this.src='https://via.placeholder.com/40?text=Host'"
              />
              <div class="host-details">
                <p class="host-name">
                  ${listing.host_name}
                  ${isSuperhost ? '<span class="host-superhost"><i class="fas fa-star"></i> Superhost</span>' : ''}
                </p>
              </div>
            </div>
            
            <a href="${listing.listing_url}" target="_blank" class="btn btn-danger btn-view-details w-100">
              <i class="fas fa-external-link-alt"></i> View Details
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Update statistics in hero section
  function updateStats(listings) {
    const totalListings = listings.length;
    const prices = listings.map(l => parsePrice(l.price)).filter(p => !isNaN(p));
    const avgPrice = prices.length > 0 
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : 0;
    
    const ratings = listings
      .map(l => l.review_scores_rating)
      .filter(r => r && !isNaN(r));
    const avgRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;

    document.getElementById("totalListings").textContent = totalListings;
    document.getElementById("avgPrice").textContent = `$${avgPrice}`;
    document.getElementById("avgRating").textContent = avgRating;
  }

  // Render listings to the page
  function redraw(listings) {
    if (!listings || listings.length === 0) {
      listingsElement.innerHTML = "";
      noResultsElement.style.display = "block";
      return;
    }

    noResultsElement.style.display = "none";
    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
    
    // Animate cards on load
    const cards = document.querySelectorAll("#listings .listing");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    });
  }

  // Sort listings based on selected option
  function sortListings(listings, sortBy) {
    const sorted = [...listings];
    
    switch(sortBy) {
      case "price-low":
        sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-high":
        sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "rating":
        sorted.sort((a, b) => (b.review_scores_rating || 0) - (a.review_scores_rating || 0));
        break;
      default:
        // Keep original order
        break;
    }
    
    return sorted;
  }

  // Filter listings based on search query
  function filterListings(listings, query) {
    if (!query || query.trim() === "") {
      return listings;
    }
    
    const lowerQuery = query.toLowerCase();
    return listings.filter(listing => {
      return (
        listing.name.toLowerCase().includes(lowerQuery) ||
        listing.description.toLowerCase().includes(lowerQuery) ||
        listing.neighbourhood_cleansed.toLowerCase().includes(lowerQuery) ||
        listing.host_name.toLowerCase().includes(lowerQuery)
      );
    });
  }

  // Handle search form submission
  function handleSearch(event) {
    event.preventDefault();
    const query = searchInput.value;
    const filtered = filterListings(allListings, query);
    const sorted = sortListings(filtered, sortFilter.value);
    displayedListings = sorted;
    redraw(displayedListings);
    updateStats(displayedListings);
  }

  // Handle sort filter change
  function handleSort() {
    const query = searchInput.value;
    const filtered = filterListings(allListings, query);
    const sorted = sortListings(filtered, sortFilter.value);
    displayedListings = sorted;
    redraw(displayedListings);
  }

  // Load data using AJAX (fetch with async/await)
  async function loadData() {
    try {
      loadingElement.style.display = "block";
      listingsElement.innerHTML = "";
      
      // Fetch the JSON file
      const response = await fetch("./airbnb_sf_listings_500.json");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const listings = await response.json();
      
      // Store all listings and get first 50
      allListings = listings.slice(0, 50);
      displayedListings = allListings;
      
      // Hide loading, show listings
      loadingElement.style.display = "none";
      
      // Update stats and render
      updateStats(displayedListings);
      redraw(displayedListings);
      
      console.log(`Successfully loaded ${allListings.length} listings!`);
      
    } catch (error) {
      console.error("Error loading listings:", error);
      loadingElement.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle"></i>
          Error loading listings: ${error.message}
          <br>
          <small>Make sure the JSON file is in the correct location.</small>
        </div>
      `;
    }
  }

  // Initialize event listeners
  function init() {
    if (searchForm) {
      searchForm.addEventListener("submit", handleSearch);
    }
    
    if (searchInput) {
      // Real-time search as user types (with debounce)
      let debounceTimer;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          handleSearch(new Event("submit"));
        }, 300);
      });
    }
    
    if (sortFilter) {
      sortFilter.addEventListener("change", handleSort);
    }
    
    // Load the data
    loadData();
  }

  // Public API
  me.redraw = redraw;
  me.loadData = loadData;
  me.init = init;

  return me;
}

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const main = MainModule();
  main.init();
});
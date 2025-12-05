const categoryContainer = document.getElementById('category-container');
const plantsContainer = document.querySelector("#plants-container .grid");

// Update cart total
function updateTotal() {
  const cartItemsContainer = document.getElementById("cart-items");
  let total = 0;

  const items = cartItemsContainer.querySelectorAll("div[data-plant-id]");
  items.forEach(item => {
    const priceText = item.querySelector("span.text-gray-400").childNodes[0].textContent.trim();
    const price = parseInt(priceText.replace('৳', '').trim());

    const quantityText = item.querySelector(".quantity").innerText.replace("×", "");
    const quantity = parseInt(quantityText);

    total += price * quantity;
  });

  document.getElementById("total-amount").innerText = `৳${total}`;
}

// Show plants
const showPlant = async (url, limit = null) => {
  const response = await fetch(url);
  const responseData = await response.json();

  plantsContainer.innerHTML = "";
  let finalPlantsArray = [];

  if (Array.isArray(responseData.plants)) finalPlantsArray = responseData.plants;
  else if (Array.isArray(responseData.data)) finalPlantsArray = responseData.data;

  if (limit) finalPlantsArray = finalPlantsArray.slice(0, limit);

  if (finalPlantsArray.length === 0) {
    plantsContainer.innerHTML = "<h1 class='text-3xl font-bold text-center col-span-4'>No Plants Found</h1>";
    return;
  }

  finalPlantsArray.forEach(plant => {
    const card = document.createElement("div");
    card.classList.add("col-span-1", "bg-white", "rounded-md", "space-y-3", "p-3");
    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-md">
      <h1 class="text-xl font-bold">${plant.name}</h1>
      <p>${plant.description ? plant.description.substring(0,100) + "..." : "No description"}</p>
      <div class="flex justify-between">
        <h2 class="category-tag">${plant.category_name || plant.category}</h2>
        <h2>৳${plant.price || 500}</h2>
      </div>
      <button class="btn bg-green-700 text-white rounded-full w-full text-center py-2 hover:bg-green-600">Add to Cart</button>
    `;
    plantsContainer.appendChild(card);

    const addToCartBtn = card.querySelector("button");
    addToCartBtn.addEventListener("click", () => {
      if (!plant.count) plant.count = 0;
      plant.count++;

      const cartItemsContainer = document.getElementById("cart-items");
      let existingCartItem = cartItemsContainer.querySelector(`div[data-plant-id='${plant.id}']`);

      if (existingCartItem) {
        const quantitySpan = existingCartItem.querySelector(".quantity");
        quantitySpan.innerText = `×${plant.count}`;
        updateTotal();
      } else {
        const cartItem = document.createElement("div");
        cartItem.classList.add("flex", "flex-row", "justify-between", "items-center", "p-2", "rounded-md", "shadow", "bg-[#CFF0DC]");
        cartItem.setAttribute("data-plant-id", plant.id);

        cartItem.innerHTML = `
          <div>
            <span>${plant.name}</span><br>
            <span class="text-gray-400">৳${plant.price || 500} <span class="quantity text-gray-400">×${plant.count}</span></span>
          </div>
          <div>
            <button class="remove-btn text-gray-400 font-bold px-2">×</button>
          </div>
        `;

        cartItemsContainer.appendChild(cartItem);
        updateTotal();

        const removeBtn = cartItem.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => {
          cartItem.remove();
          plant.count = 0;
          updateTotal();
        });
      }
    });
  });
};

// Fetch all categories
const fetchDatafromCategory = async () => {
  const response = await fetch(`https://openapi.programming-hero.com/api/categories`);
  return await response.json();
};

// Initialize categories and plants
const init = async () => {
  const allCategories = await fetchDatafromCategory();

  // Container flex + responsive alignment
  categoryContainer.classList.add("flex", "flex-col", "gap-2", "items-center", "md:items-start");

  // All Trees button
  const allButton = document.createElement("button");
  allButton.className = "btn btn-category w-full md:w-auto text-center md:text-left";
  allButton.innerText = "All Trees";
  categoryContainer.appendChild(allButton);

  allButton.addEventListener("click", async () => {
    document.querySelectorAll(".btn-category").forEach(btn => btn.classList.remove("active-category"));
    allButton.classList.add("active-category");

    const allPlantsUrl = `https://openapi.programming-hero.com/api/plants`;
    await showPlant(allPlantsUrl, 6);
  });

  // Category buttons
  allCategories.categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "btn btn-category w-full md:w-auto text-center md:text-left";
    button.innerText = category.category_name;

    button.addEventListener("click", async () => {
      document.querySelectorAll(".btn-category").forEach(btn => btn.classList.remove("active-category"));
      button.classList.add("active-category");

      const categoryUrl = `https://openapi.programming-hero.com/api/category/${category.id}`;
      await showPlant(categoryUrl);
    });

    categoryContainer.appendChild(button);
  });

  // Load All Trees by default
  allButton.click();
};

// Initialize
init();

// Donate form reset functionality
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const dropdownButton = document.getElementById('dropdownButton');
const donateButton = document.getElementById('donateButton');
const treeDropdown = document.getElementById('treeDropdown');

donateButton.addEventListener('click', () => {
  nameInput.value = '';
  emailInput.value = '';
  dropdownButton.innerHTML = 'Number of Trees <i class="fa-solid fa-circle-chevron-down"></i>';
});

// Dropdown selection
treeDropdown.addEventListener('click', (e) => {
  const target = e.target;
  if(target.tagName === 'A') {
    e.preventDefault();
    dropdownButton.innerHTML = target.textContent + ' <i class="fa-solid fa-circle-chevron-down"></i>';
  }
});

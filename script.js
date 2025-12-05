const categoryContainer = document.getElementById('category-container');
const plantsContainer = document.querySelector("#plants-container .grid");

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
  const totalAmount = document.getElementById("total-amount");
  totalAmount.innerText = `৳${total}`;
}

const fetchDatafromCategory = async () => {
  const categoryRequest = await fetch(`https://openapi.programming-hero.com/api/categories`);
  const categoryJson = await categoryRequest.json();
  return categoryJson;
}

const showPlant = async (url, limit = null) =>{
  plantsContainer.innerHTML = `<div class="w-full col-span-full text-center py-10"><span class="loading loading-dots loading-xl text-green-700"></span></div>`;
  const plant = await fetch(url);
  const responseData = await plant.json();
  plantsContainer.innerHTML = "";
  let finalPlantsArray = [];
  if (Array.isArray(responseData.plants)) finalPlantsArray = responseData.plants;
  else if (Array.isArray(responseData.data)) finalPlantsArray = responseData.data;
  if(limit) finalPlantsArray = finalPlantsArray.slice(0, limit);
  if(finalPlantsArray.length === 0){
    plantsContainer.innerHTML = "<h1 class='text-3xl font-bold text-center col-span-4'>No Plants Found</h1>";
    return;
  }
  finalPlantsArray.forEach(plant =>{
    const card = document.createElement("div");
    card.classList.add("col-span-1","bg-white","rounded-md","space-y-3","p-3");
    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-md">
      <h1 class="text-xl font-bold">${plant.name}</h1>
      <p>${plant.description ? plant.description.substring(0,100) + "..." : "No description"}</p>
      <div class="flex justify-between">
        <h2 class="category-tag">${plant.category_name || plant.category}</h2>   
        <h2>৳${plant.price || 500}</h2>
      </div>
      <button class="btn bg-green-700 text-white rounded-full w-full text-center py-2">Add to Cart</button>
    `;
    plantsContainer.appendChild(card);
    const addTocartBtn = card.querySelector("button");
    addTocartBtn.addEventListener("click", () => {
      if(!plant.count) plant.count = 0;
      plant.count++;
      const cartItemsContainer = document.getElementById("cart-items");
      const plantId = plant.id || plant.plant_id;
      let existingCartItem = cartItemsContainer.querySelector(`div[data-plant-id='${plantId}']`);
      if (existingCartItem) {
        const quantitySpan = existingCartItem.querySelector(".quantity");
        quantitySpan.innerText = `×${plant.count}`;
        updateTotal();
      } else {
        const cartItem = document.createElement("div");
        cartItem.classList.add("flex","flex-row", "justify-between", "items-center", "p-2", "rounded-md", "shadow", "bg-[#CFF0DC]");
        cartItem.setAttribute("data-plant-id", plantId);
        cartItem.innerHTML = `<div><span>${plant.name}</span><br><span class="text-gray-400">৳${plant.price || 500} <span class="quantity text-gray-400">×${plant.count}</span></span></div><div><button class="remove-btn text-gray-400 font-bold px-2">×</button></div>`;
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

const init = async () => {
  const allCategories = await fetchDatafromCategory();
  const allButton = document.createElement("button");
  allButton.classList.add("btn-category");
  allButton.style.color = "black";
  allButton.style.fontWeight = "600";
  allButton.style.textAlign = "start";
  allButton.style.height = "2rem";
  allButton.style.width = "10rem";
  allButton.style.borderRadius = "0.375rem";
  allButton.style.paddingLeft = "1rem";
  allButton.style.marginLeft = "0";
  allButton.innerText = "All Trees";
  categoryContainer.appendChild(allButton);
  allButton.addEventListener("click", async () => {
    document.querySelectorAll(".btn-category").forEach(btn => btn.style.backgroundColor = "");
    allButton.style.backgroundColor = "green";
    const allPlantsUrl = `https://openapi.programming-hero.com/api/plants`;
    await showPlant(allPlantsUrl, 6);
  });
  allCategories.categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("btn-category");
    button.style.color = "black";
    button.style.fontWeight = "600";
    button.style.textAlign = "start";
    button.style.height = "2rem";
    button.style.width = "10rem";
    button.style.borderRadius = "0.375rem";
    button.style.paddingLeft = "1rem";
    button.style.marginLeft = "0";
    button.innerText = category.category_name;
    button.addEventListener("click", async () => {
      document.querySelectorAll(".btn-category").forEach(btn => btn.style.backgroundColor = "");
      button.style.backgroundColor = "green";
      const categoryUrl = `https://openapi.programming-hero.com/api/category/${category.id}`;
      await showPlant(categoryUrl);
    });
    categoryContainer.appendChild(button);
  });
  allButton.click();
};

init();

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

treeDropdown.addEventListener('click', (e) => {
  const target = e.target;
  if(target.tagName === 'A') {
    e.preventDefault();
    dropdownButton.innerHTML = target.textContent + ' <i class="fa-solid fa-circle-chevron-down"></i>';
  }
});

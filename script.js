const categoryContainer = document.getElementById('category-container');

const plantsContainer = document.querySelector("#plants-container .grid");


const fetchPlantData = async () => {
  const request = await fetch(`https://openapi.programming-hero.com/api/plants`);
  const response = await request.json();
  return response;
}

const fetchDatafromCategory = async () => {
  const categoryRequest = await fetch(`https://openapi.programming-hero.com/api/categories`);
  const categoryJson = await categoryRequest.json();
  return categoryJson;
}

// show plant function

const showPlant = async (url) =>{

  console.log("Fetching URL:", url);
const plant = await fetch(url);
const responseData = await plant.json();
console.log("API Response:", responseData);
  plantsContainer.innerHTML = "";

  let finalPlantsArray = [];

if (Array.isArray(responseData.plants)) {
    finalPlantsArray = responseData.plants;  
} 
else if (Array.isArray(responseData.data)) {
    finalPlantsArray = responseData.data;  
}

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
              <h2 class="category-tag">${plant.category}</h2>   
              <h2>৳${plant.price || 500}</h2>
            </div>
            <button class="btn bg-green-700 text-white rounded-full w-40">Add to Cart</button>
             `;
             plantsContainer.appendChild(card);
  });

 };

const init = async () => {
  const allCategories = await fetchDatafromCategory();
  

  const allButton = document.createElement("button");
  allButton.classList.add("btn", "btn-block", "shadow", "btn-category");
  allButton.innerText = "All Trees";
  categoryContainer.appendChild(allButton);


  allButton.addEventListener("click", async () => {
  document.querySelectorAll(".btn-category").forEach(btn => {
    btn.classList.remove("active-category");
  });

  allButton.classList.add("active-category");
  
  const allPlantsUrl = `https://openapi.programming-hero.com/api/plants`;
  await showPlant(allPlantsUrl);
  
});


  allCategories.categories.map((category) => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-block", "shadow","btn-category");
    button.innerText =category.category_name;

    button.addEventListener("click",async () =>{
      document.querySelectorAll(".btn-category").forEach(btn => btn.classList.remove("active-category"));
      button.classList.add("active-category");
      const categoryUrl = `https://openapi.programming-hero.com/api/category/${category.id}`;
      await showPlant(categoryUrl);
      });
    categoryContainer.appendChild(button);
           })
      allButton.click();

}

init();


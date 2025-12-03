const categoryContainer = document.getElementById('category-container');
const allTreesButton = document.querySelector("#category-container button");


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

const init = async () => {
  const allCategories = await fetchDatafromCategory();
  const allPlantData = await fetchPlantData();

  const allButton = document.createElement("button");
  allButton.classList.add("btn", "btn-block", "shadow", "btn-category");
  allButton.innerText = "All Trees";
  categoryContainer.appendChild(allButton);


  allButton.addEventListener("click", () => {
  document.querySelectorAll(".btn-category").forEach(btn => {
    btn.classList.remove("active-category");
  });

  allButton.classList.add("active-category");
  console.log("clicked: All Trees");
});


  allCategories.categories.map((category) => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-block", "shadow","btn-category");
    button.innerText =category.category_name;

    button.addEventListener("click", () =>{
      document.querySelectorAll(".btn-category").forEach(btn =>{
        btn.classList.remove("active-category");

      });
      button.classList.add("active-category");
      console.log("clicked", category.category_name)
    })
    categoryContainer.appendChild(button);
           })

}

init();



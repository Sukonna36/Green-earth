const categoryContainer = document.getElementById('category-container');

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
  console.log(allCategories, allPlantData);

  allCategories.categories.map((category) => {
    const buttonElement = `<button class="btn btn-block shadow btn-category">
            ${category.category_name}
          </button>`;
    categoryContainer.innerHTML += buttonElement;
  })

}

init();



document.addEventListener('DOMContentLoaded', () => {
    getRandomMeal();
});

async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    displayMeal(data.meals[0], 'randomMeal');
}

async function searchMeal() {
    const searchInput = document.getElementById('searchInput').value;
    if (searchInput.trim() === '') {
        return;
    }

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
    const data = await response.json();
    
    if (data.meals) {
        displaySearchedMeals(data.meals);
    } else {
        alert('No results found');
    }
}

function displayMeal(meal, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strMeal}</p>
    `;
    container.onclick = () => showIngredientsModal(meal.idMeal); // Fix here
}

function displaySearchedMeals(meals) {
    const searchedMealsContainer = document.getElementById('searchedMeals');
    searchedMealsContainer.innerHTML = '';

    meals.forEach((meal) => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');
        mealItem.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strMeal}</p>
        `;
        mealItem.onclick = () => showIngredientsModal(meal.idMeal);
        searchedMealsContainer.appendChild(mealItem);
    });

    document.getElementById('searchedMealSection').style.display = 'block';
}

async function showIngredientsModal(mealId) {
    const modal = document.getElementById('ingredientsModal');
    const modalContent = document.getElementById('ingredientsList');
    modalContent.innerHTML = '';

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    const ingredients = Object.entries(data.meals[0])
        .filter(([key, value]) => key.includes('Ingredient') && value)
        .map(([key, value]) => value);

    ingredients.forEach((ingredient) => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        modalContent.appendChild(li);
    });

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('ingredientsModal').style.display = 'none';
}

window.onclick = (event) => {
    if (event.target === document.getElementById('ingredientsModal')) {
        closeModal();
    }
};

document.addEventListener("DOMContentLoaded", function () {
  // Displays cocktails once DOM has fully loaded
  searchCocktails();

  // Modal drag and drop functionality
const modal = document.getElementById("advancedSearchModal");

let isDragging = false;
let offsetX, offsetY;

modal.addEventListener("mousedown", function (e) {
  isDragging = true;
  
  // Calculate the offset based on the center of the modal
  const modalRect = modal.getBoundingClientRect();
  offsetX = e.clientX - (modalRect.left + modalRect.width / 2);
  offsetY = e.clientY - (modalRect.top + modalRect.height / 2);
});

document.addEventListener("mouseup", function () {
  isDragging = false;
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    const leftPosition = e.clientX - offsetX;
    const topPosition = e.clientY - offsetY;

    // Set the new position of the modal
    modal.style.left = `${leftPosition}px`;
    modal.style.top = `${topPosition}px`;
  }
});
  
});
document.addEventListener("mouseover", function (event) {
  const hoverDialog = event.target.closest(".cocktail");

  if (hoverDialog) {
    hoverDialog.querySelector(".hover-dialog").style.display = "block";
    console.log('I was hovered');
  }
});

document.getElementById("searchInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
      event.preventDefault();
      searchCocktails();
      console.log('I was also clicked :)')
  }
});

// Declare API URLs
const cocktailSearchAPI = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const ingredientSearchAPI = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";
const alcoholicFilterAPI = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=";

function searchCocktails() {
  const searchInput = document.getElementById("searchInput").value;
  const cocktailList = document.getElementById("cocktailList");

  // Clear previous search results
  cocktailList.innerHTML = "";

  // Fetch data from the API
  fetch(cocktailSearchAPI + searchInput)
    .then((response) => response.json())
    .then((data) => {
      // Check if data is available
      console.log(data)
      if (data.drinks) {
        // Iterate through the list of cocktails and create HTML elements
        data.drinks.forEach((cocktail) => {
          const cocktailItem = document.createElement("li");
          cocktailItem.className = "cocktail";
          cocktailItem.innerHTML = `
            <h3>${cocktail.strDrink}</h3>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="max-width: 100%;">
            <div class="hover-dialog">
              <p><strong>Category:</strong> ${cocktail.strCategory}</p>
              <p><strong>Ingredients:</strong> ${getIngredientsList(cocktail)}</p>
              <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
              <p><strong>Alcoholic:</strong> ${cocktail.strAlcoholic}</p>
              <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
            </div>
          `;
          cocktailList.appendChild(cocktailItem);
        });
      } else {
        // Display a message if no cocktails are found
        cocktailList.innerHTML = "<p>No cocktails found</p>";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function getIngredientsList(cocktail) {
  // Creates an array to store the ingredients
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    if (ingredient) {
      // Iterates through the ingredients and if it exists it is pushed to the array
      ingredients.push(ingredient);
    }
  }
  // Returns the array in the value of a string separated by a comma
  return ingredients.join(', ');
}

document.addEventListener("mouseout", function (event) {
  const hoverDialog = event.target.closest(".cocktail");

  if (hoverDialog) {
    hoverDialog.querySelector(".hover-dialog").style.display = "none";
    console.log('Peace! I\'m out')
  }
});

function searchForIngredient() {
  const ingredientSearchInput = document.getElementById("ingredientSearchInput").value;
  const cocktailList = document.getElementById("cocktailList");

  cocktailList.innerHTML = "";

  // Fetch data from the API for ingredient search
  fetch(ingredientSearchAPI + ingredientSearchInput)
    .then((response) => response.json())
    .then((data) => {
      if (data.ingredients) {
        // Display the found ingredient
        data.ingredients.forEach((ingredient) => {
          const cocktailItem = document.createElement("li");
          cocktailItem.className = "cocktail";
          cocktailItem.innerHTML = `
            <h3>${ingredient.strIngredient}</h3>
            <p><strong>Type:</strong> ${ingredient.strType}</p>
            <p><strong>Alcohol:</strong> ${ingredient.strAlcohol}</p>
            <p><strong>Description:</strong> ${ingredient.strDescription}</p>
          `;

          return cocktailList.appendChild(cocktailItem);
        });
      } else {
        cocktailList.innerHTML = `<p>No cocktails found with the ingredient: ${ingredientSearchInput}</p>`;
      }
    })
}

document.getElementById("ingredientSearchInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchForIngredient();
    closeAdvancedSearchModal();
    console.log('I was clicked')
  }
});

function autocompleteIngredients() {
  const input = document.getElementById("ingredientSearchInput");
  const autocompleteList = document.getElementById("autocompleteList");

  autocompleteList.innerHTML = "";

  // Fetch data from the API for autocomplete
  fetch(ingredientSearchAPI + input.value)
    .then((response) => response.json())
    .then((data) => {
      if (data.ingredients) {
        data.ingredients.forEach((ingredient) => {
          const suggestionItem = document.createElement("li");
          suggestionItem.textContent = ingredient.strIngredient;
          suggestionItem.addEventListener("click", function () {
            // Set the selected suggestion in the input
            input.value = ingredient.strIngredient;

            // Clear the dropdown
            autocompleteList.innerHTML = "";
          });
          autocompleteList.appendChild(suggestionItem);
        });
      }
    })
    .catch((error) => console.error("Error fetching autocomplete data:", error));
}

document.getElementById("searchInput").addEventListener("input", function () {
  autocompleteCocktails();
  autocompleteList.innerHTML = "";
});

document.getElementById("ingredientSearchInput").addEventListener("input", function () {
  autocompleteIngredients();
  autocompleteList.innerHTML = "";
});

function closeAutocompleteDropdown() {
  const autocompleteList = document.getElementById("autocompleteList");
  autocompleteList.innerHTML = "";
}

document.addEventListener("click", function (event) {
  const input = document.getElementById("ingredientSearchInput");
  const autocompleteList = document.getElementById("autocompleteList");

  if (event.target !== input && !input.contains(event.target) && event.target !== autocompleteList && !autocompleteList.contains(event.target)) {
    closeAutocompleteDropdown();
  }

  document.getElementById("ingredientSearchInput").addEventListener("focus", function () {
    // Clear previous search inputs when the input is focused
    autocompleteList.innerHTML = "";
    closeAutocompleteDropdown();
  })
});

function filterByAlcoholic() {
  const cocktailList = document.getElementById("cocktailList");

  cocktailList.innerHTML = "";

  // Fetch data from the Alcoholic API
  fetch(alcoholicFilterAPI + "Alcoholic")
    .then((response) => response.json())
    .then((data) => {
      if (data.drinks) {
        data.drinks.forEach((cocktail) => {
          const cocktailItem = document.createElement("li");
          cocktailItem.className = "cocktail";
          cocktailItem.innerHTML = `
            <h3>${cocktail.strDrink}</h3>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="max-width: 100%;">
          `;
          cocktailList.appendChild(cocktailItem);
        });
      } else {
        cocktailList.innerHTML = "<p>No cocktails found</p>";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function filterByNonAlcoholic() {
  const cocktailList = document.getElementById("cocktailList");

  cocktailList.innerHTML = "";

  fetch(alcoholicFilterAPI + "Non_Alcoholic")
    .then((response) => response.json())
    .then((data) => {
      if (data.drinks) {
        data.drinks.forEach((cocktail) => {
          const cocktailItem = document.createElement("li");
          cocktailItem.className = "cocktail";
          cocktailItem.innerHTML = `
            <h3>${cocktail.strDrink}</h3>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="max-width: 100%;">
          `;
          cocktailList.appendChild(cocktailItem);
        });
      } else {
        cocktailList.innerHTML = "<p>No cocktails found</p>";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function openAdvancedSearchModal() {
  const modal = document.getElementById('advancedSearchModal');
  const overlay = document.getElementById('overlay');

  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeAdvancedSearchModal() {
  const modal = document.getElementById('advancedSearchModal');
  const overlay = document.getElementById('overlay');

  document.getElementById('ingredientSearchInput').value = '';

  modal.style.display = 'none';
  overlay.style.display = 'none';
}


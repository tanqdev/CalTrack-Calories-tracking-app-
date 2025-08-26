// ======================== CalorieTracker Class ========================
class CalorieTracker {
  constructor() {
    // Load meals, workouts, calorie limit, and total calories from Storage
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);

    // Display initial values on the UI
    this._displayCalorieTotal();
    this._displayCalorieLimit();
    this._displayCalorieConsumed();
    this._displayCalorieBurned();
    this._displayCalorieRemaining();
    this._displayProgressBar();

    // Set the limit input field to current calorie limit
    document.getElementById("limit").value = this._calorieLimit;
  }

  // Add a meal and update totals & UI
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories); // Save total calories in storage
    Storage.saveMeals(meal); // Save meal in storage
    this._displayNewMeal(meal); // Show meal in UI
    this._render(); // Update all calorie displays and progress bar
  }

  // Remove a meal by ID and update totals & UI
  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories; // Deduct calories
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1); // Remove meal from array
      Storage.removeMeal(id); // Remove from storage
      this._render(); // Update UI
    }
  }

  // Add a workout and update totals & UI
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories; // Burned calories reduce total
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkouts(workout); // Save workout in storage
    this._displayNewWorkout(workout); // Show workout in UI
    this._render();
  }

  // Remove a workout by ID and update totals & UI
  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories; // Revert burned calories
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1); // Remove workout from array
      Storage.removeWorkout(id); // Remove from storage
      this._render(); // Update UI
    }
  }

  // Reset tracker: clear meals, workouts, calories, and storage
  reset() {
    this._meals = [];
    this._workouts = [];
    this._totalCalories = 0;
    Storage.clearAll(); // Clear storage
    this._render();
  }

  // Set a new calorie limit
  setLimit(newLimit) {
    this._calorieLimit = newLimit;
    Storage.setCalorieLimit(newLimit); // Update storage
    this._displayCalorieLimit(); // Update UI
    this._render();
  }

  // Display stored meals and workouts
  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  // Render all calorie totals and progress bar
  _render() {
    this._displayCalorieTotal();
    this._displayCalorieConsumed();
    this._displayCalorieBurned();
    this._displayCalorieRemaining();
    this._displayProgressBar();
  }

  // Display total calories
  _displayCalorieTotal() {
    const totalCalorieEl = document.getElementById("calories-total");
    totalCalorieEl.innerHTML = this._totalCalories;
  }

  // Display calorie limit
  _displayCalorieLimit() {
    const CalorieLimit = document.getElementById("calories-limit");
    CalorieLimit.innerHTML = this._calorieLimit;
  }

  // Display calories consumed from meals
  _displayCalorieConsumed() {
    const caloriesConsumed = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumed.innerHTML = consumed;
  }

  // Display calories burned from workouts
  _displayCalorieBurned() {
    const caloriesBurned = document.getElementById("calories-burned");
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurned.innerHTML = burned;
  }

  // Display remaining calories and update progress bar color
  _displayCalorieRemaining() {
    const caloriesRemaining = document.getElementById("calories-remaining");
    const progressBar = document.getElementById("calorie-progress");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemaining.innerHTML = remaining;

    progressBar.classList.add("progress-bar-striped", "progress-bar-animated");

    if (remaining > 0) {
      // Enough calories remaining: green
      caloriesRemaining.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemaining.parentElement.parentElement.classList.add("bg-light");
      progressBar.classList.remove("bg-danger");
      progressBar.classList.add("bg-success");
    } else {
      // Over limit: red
      caloriesRemaining.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemaining.parentElement.parentElement.classList.add("bg-danger");
      progressBar.classList.remove("bg-success");
      progressBar.classList.add("bg-danger");
    }
  }

  // Animate and update progress bar width
  _displayProgressBar() {
    const progressBar = document.getElementById("calorie-progress");
    const progressPercentage = document.getElementById("progress-percent");
    let percentage = (this._totalCalories / this._calorieLimit) * 100;
    if (percentage > 100) {
      percentage = 100;
    } else if (percentage < 0) {
      percentage = 0;
    }
    progressBar.style.width = "0%";
    setTimeout(() => {
      progressBar.style.width = `${percentage}%`;
    }, 20);
    progressPercentage.innerHTML = `${percentage.toFixed(1)}%`;
  }

  // Display a new meal card in the UI
  _displayNewMeal(meal) {
    const mealsEl = document.getElementById("meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    mealsEl.appendChild(mealEl);
  }

  // Display a new workout card in the UI
  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById("workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = `<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    workoutsEl.appendChild(workoutEl);
  }
}

// ======================== Meal Class ========================
class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2); // Unique ID
    this.name = name;
    this.calories = calories;
  }
}

// ======================== Workout Class ========================
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2); // Unique ID
    this.name = name;
    this.calories = calories;
  }
}

// ======================== Storage Class ========================
class Storage {
  // Get calorie limit from localStorage
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  // Save calorie limit to localStorage
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  // Get total calories from localStorage
  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  // Update total calories in localStorage
  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  // Get stored meals
  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }

  // Save a meal in storage
  static saveMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  // Remove a meal by ID
  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  // Get stored workouts
  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }

  // Save a workout in storage
  static saveWorkouts(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  // Remove a workout by ID
  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  // Clear all stored data
  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

// ======================== App Class ========================
class App {
  constructor() {
    // Initialize CalorieTracker
    this._tracker = new CalorieTracker();
    this._loadEventListeners(); // Setup all event listeners
    this._tracker.loadItems(); // Display stored meals and workouts
  }

  // Add new meal or workout from form
  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (name.value === "" || calories.value === "") {
      alert("Please fill in all the forms");
      return;
    }

    // Create new meal or workout
    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    // Clear form fields
    name.value = "";
    calories.value = "";

    // Collapse the bootstrap form after submission
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }

  // Remove meal or workout when delete button clicked
  _removeItems(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        if (type === "meal") {
          this._tracker.removeMeal(id);
        } else {
          this._tracker.removeWorkout(id);
        }
        e.target.closest(".card").remove(); // Remove from DOM
      }
    }
  }

  // Filter displayed items based on search input
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Reset tracker and clear UI
  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").innerHTML = "";
    document.getElementById("filter-workouts").innerHTML = "";
  }

  // Set new calorie limit from form
  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please add a limit");
      return;
    }
    this._tracker.setLimit(+limit.value);
    limit.value = "";

    // Hide modal after updating limit
    const modalEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  // Load all event listeners for forms, buttons, filters
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItems.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItems.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }
}

// Initialize the app
const app = new App();

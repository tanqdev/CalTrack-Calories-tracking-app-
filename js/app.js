class CalorieTracker{
  constructor(){
    this._meals=[];
    this._workouts=[];
    this._calorieLimit=2100;
    this._totalCalories=0;

    this._displayCalorieTotal()
    this._displayCalorieLimit();
    this._displayCalorieConsumed();
    this._displayCalorieBurned();
    this._displayCalorieRemaining();
    this._displayProgressBar();
  }

  addMeal(meal){
    this._meals.push(meal);
    this._totalCalories+=meal.calories;
    this._displayNewMeal(meal);
    this._render();
  }
  removeMeal(id){
    const index=this._meals.findIndex((meal)=> meal.id===id);
    if(index!==-1){
      const meal=this._meals[index];
      this._totalCalories-=meal.calories;
      this._meals.splice(index,1);
      this._render();
    }
  }

  addWorkout(workout){
    this._workouts.push(workout);
    this._totalCalories-=workout.calories;
    this._displayNewWorkout(workout);
    this._render();
  }
  removeWorkout(id){
    const index=this._workouts.findIndex((workout)=> workout.id===id);
    if(index!==-1){
      const workout=this._workouts[index];
      this._totalCalories+=workout.calories;
      this._workouts.splice(index,1);
      this._render();
    }
  }  

  _render(){
    this._displayCalorieTotal();
    this._displayCalorieConsumed();
    this._displayCalorieBurned();
    this._displayCalorieRemaining();
    this._displayProgressBar();
  }
  
  _displayCalorieTotal(){
    const totalCalorieEl=document.getElementById('calories-total');
    totalCalorieEl.innerHTML=this._totalCalories;
  }
  _displayCalorieLimit(){
    const CalorieLimit=document.getElementById('calories-limit');
    CalorieLimit.innerHTML=this._calorieLimit;
  }

  _displayCalorieConsumed(){
    const caloriesConsumed=document.getElementById('calories-consumed');
    const consumed=this._meals.reduce(
      (total,meal) => total + meal.calories, 0
    );
    caloriesConsumed.innerHTML=consumed;
  }
  _displayCalorieBurned(){
    const caloriesBurned=document.getElementById('calories-burned');
    const burned=this._workouts.reduce(
      (total,workout) => total + workout.calories, 0
    );
    caloriesBurned.innerHTML=burned;
  }
  _displayCalorieRemaining(){
    const caloriesRemaining=document.getElementById('calories-remaining');
    const progressBar=document.getElementById('calorie-progress');
    const remaining=this._calorieLimit-this._totalCalories;
    caloriesRemaining.innerHTML=remaining;

    progressBar.classList.add('progress-bar-striped', 'progress-bar-animated');

    if(remaining>0){
      caloriesRemaining.parentElement.parentElement.classList.remove('bg-danger');
      caloriesRemaining.parentElement.parentElement.classList.add('bg-light');
      progressBar.classList.remove('bg-danger');
      progressBar.classList.add('bg-success');
    }else{
      caloriesRemaining.parentElement.parentElement.classList.remove('bg-light');
      caloriesRemaining.parentElement.parentElement.classList.add('bg-danger');
      progressBar.classList.remove('bg-success');
      progressBar.classList.add('bg-danger');
    }
  }

  _displayProgressBar(){
    const progressBar=document.getElementById('calorie-progress');
    const progressPercentage=document.getElementById('progress-percent');
    let percentage=(this._totalCalories/this._calorieLimit)*100;
    if(percentage>100){
      percentage=100;
    }
    else if(percentage<0){
      percentage=0;
    }
    progressBar.style.width='0%';
    setTimeout(() => {
      progressBar.style.width = `${percentage}%`;
    }, 20);    
    progressPercentage.innerHTML=`${percentage.toFixed(1)}%`
  }

  _displayNewMeal(meal){
    const mealsEl=document.getElementById('meal-items');
    const mealEl=document.createElement('div');
    mealEl.classList.add('card','my-2');
    mealEl.setAttribute('data-id',meal.id);
    mealEl.innerHTML=`<div class="card-body">
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
              </div>`
    mealsEl.appendChild(mealEl);          
  }
  _displayNewWorkout(workout){
    const workoutsEl=document.getElementById('workout-items');
    const workoutEl=document.createElement('div');
    workoutEl.classList.add('card','my-2');
    workoutEl.setAttribute('data-id',workout.id);
    workoutEl.innerHTML=`<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`
    workoutsEl.appendChild(workoutEl);          
  }
}

class Meal{
  constructor(name,calories){
    this.id=Math.random().toString(16).slice(2);
    this.name=name;
    this.calories=calories;
  }
}  

class Workout{
  constructor(name,calories){
    this.id=Math.random().toString(16).slice(2);
    this.name=name;
    this.calories=calories;
  }
}

class App{
  constructor(){
    this._tracker=new CalorieTracker();
    document.getElementById('meal-form').addEventListener('submit',this._newItem.bind(this,'meal'));
    document.getElementById('workout-form').addEventListener('submit',this._newItem.bind(this,'workout'));
    document.getElementById('meal-items').addEventListener('click',this._removeItems.bind(this,'meal'));
    document.getElementById('workout-items').addEventListener('click',this._removeItems.bind(this,'workout'));
  }

  _newItem(type,e){
    e.preventDefault();

    const name=document.getElementById(`${type}-name`);
    const calories=document.getElementById(`${type}-calories`);

    if(name.value==='' || calories.value===''){
      alert('Please fill in all the forms');
      return;
    }
    if(type==='meal'){
    const meal=new Meal(name.value,+calories.value);
    this._tracker.addMeal(meal);
    }
    else{
    const workout=new Workout(name.value,+calories.value);
    this._tracker.addWorkout(workout);
    }
    name.value='';
    calories.value='';

    const collapseItem=document.getElementById(`collapse-${type}`);
    const bsCollapse=new bootstrap.Collapse(collapseItem,{
      toggle: true,
    });
  }

  _removeItems(type,e){
    if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')){
      if(confirm('Are you sure?')){
        const id=e.target.closest('.card').getAttribute('data-id');
        if(type==='meal'){
          this._tracker.removeMeal(id);
        }
        else{
          this._tracker.removeWorkout(id);
        }
        e.target.closest('.card').remove();
      }
    }
  }
}

const app=new App();


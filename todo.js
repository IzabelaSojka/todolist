const form = document.getElementById("todoform");
const toDoInput = document.getElementById("new");
const toDoList = document.getElementById("todos-list");

let toDos = [];

form.addEventListener('submit', function(event){
    event.preventDefault();
    saveToDo();
    renderToDo();
});

function saveToDo(){
    const toDoValue = toDoInput.value;
    const isEmpty = toDoValue === '';
    const isDuplicate = toDos.some((toDo) => toDo.value.toUpperCase() === toDoValue.toUpperCase());

    if(isEmpty){
        alert("Your list is empty!");
    }
    else if(isDuplicate){
        alert("Already exist!");
    }
    else{
        toDos.push({
            value : toDoValue,
            checked : false,
            color : '#' + Math.floor(Math.random()*16777215).toString(16)
        });

        toDos.value = '';
    }

    
}

function renderToDo(){
    toDoList.innerHTML = '';
    toDos.forEach((toDo, index) => {
        toDoList.innerHTML += `
            <div class="todo" id=${index}>
                <i class="bi ${toDo.checked ? 'bi-check-square' : 'bi-square'}"></i>
                <p class="">${toDo.value}</p>
                <i class="bi bi-pen-fill"></i>
                <i class="bi bi-trash3-fill"></i>
            </div>
        `;  
    });
}

toDoList.addEventListener('click', (event) => {
    const target = event.target;
    const parentEl = target.parentNode;
    
    if (parentEl.className !== 'todo') return;g

    const toDo = parentEl;
    const toDoId = Number(toDo.id);

    console.log(toDoId);
});
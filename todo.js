const form = document.getElementById("todoform");
const toDoInput = document.getElementById("new");
const toDoList = document.getElementById("todos-list");
const notificationElement = document.querySelector(".notification");

let toDos = JSON.parse(localStorage.getItem("toDos")) || [];
let editToDoId = -1;

renderToDo();

form.addEventListener('submit', function(event){
    event.preventDefault();
    saveToDo();
    renderToDo();
    localStorage.setItem("toDos", JSON.stringify(toDos));
});

function saveToDo(){
    const toDoValue = toDoInput.value;
    const isEmpty = toDoValue === '';
    const isDuplicate = toDos.some((toDo) => toDo.value.toUpperCase() === toDoValue.toUpperCase());

    if(isEmpty){
        showNotification("Your list is empty!");
    }
    else if(isDuplicate){
        showNotification("Already exist!");
    }
    else{
        if(editToDoId >= 0){
            toDos = toDos.map((toDo, index) =>({
                ...toDo,
                value: index === editToDoId ? toDoValue : toDo.value,
            }));
            editToDoId = -1;
        }
        else{
            toDos.push({
            value : toDoValue,
            checked : false
            });
        }
         toDos.value = '';
    }
}

function renderToDo(){
    if(toDos.length === 0){
        toDoList.innerHTML = `<center> Nothing to do!!!</center>`;
        return;
    }
    toDoList.innerHTML = '';
    toDos.forEach((toDo, index) => {
        toDoList.innerHTML += `
            <div class="todo" id=${index}>
                <i 
                    class="bi ${toDo.checked ? 'bi-check-square' : 'bi-square'}"
                    data-action="check"
                ></i>
                <p class="">${toDo.value}</p>
                <i class="bi bi-pen-fill" data-action="edit"></i>
                <i class="bi bi-trash3-fill" data-action="delete"></i>
            </div>
        `;  
    });
}

toDoList.addEventListener('click', (event) => {
    const target = event.target;
    const parentEl = target.parentNode;
    
    if (parentEl.className !== 'todo') return;

    const toDo = parentEl;
    const toDoId = Number(toDo.id);

    const action = target.dataset.action;

    action === "check" && checkToDo(toDoId);
    action === "edit" && editToDo(toDoId);
    action === "delete" && deleteToDo(toDoId);
});

function checkToDo(toDoId){
    toDos = toDos.map((toDo, index) => ({
        ...toDo,
        checked: index === toDoId ? !toDo.checked : toDo.checked,
    }));

    renderToDo();
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

function editToDo(toDoId){
    toDoInput.value = toDos[toDoId].value;
    editToDoId = toDoId;
}

function deleteToDo(toDoId){
    toDos = toDos.filter((todo, index) => index !== toDoId);
    editToDoId = -1;

    renderToDo();
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

function showNotification(msg){
    notificationElement.innerHTML = msg;

    notificationElement.classList.add("notif-enter");

    setTimeout(() =>{
        notificationElement.classList.remove("notif-enter")
    }, 4500)
}
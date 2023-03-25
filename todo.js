const form = document.getElementById("todoform");
const toDoList = document.getElementById("todos-list");
const notificationElement = document.querySelector(".notification");
const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("add-btn");
const closeBtn = document.getElementById("close-btn");
const name = document.getElementById("name");
const date = document.getElementById("date");
const time = document.getElementById("time");

let toDos = JSON.parse(localStorage.getItem("toDos")) || [];
let editToDoId = -1;

renderToDo();

addBtn.onclick = function() {
    addModal.style.display = "block";
}

closeBtn.onclick = function() {
    addModal.style.display = "none";
    cleanForm();
}

function close() {
    document.getElementById("addModal").style.display = "none";
}

form.addEventListener('submit', function(event){
    event.preventDefault();
    saveToDo();
    renderToDo();
    localStorage.setItem("toDos", JSON.stringify(toDos));
    close();
    cleanForm();
});

function saveToDo(){
    const nameValue = name.value;
    const dateValue = date.value;
    const timeValue = time.value;

    const obj = {name: nameValue, date: dateValue, time: timeValue, checked: false};

    if(ifDuplicate(nameValue) && editToDoId < 0){
        showNotification("Already exist!");
    }
    else{
        if(editToDoId >= 0){
            toDos = toDos.map((toDo, index) =>({
                ...toDo,
                name: index === editToDoId ? nameValue : toDo.name,
                date: index === editToDoId ? dateValue : toDo.date,
                time: index === editToDoId ? timeValue : toDo.time,
            }));
            editToDoId = -1;
        }
        else{
            toDos.push(obj);
        }
    }
}

function ifDuplicate(name){
    const jsonData = localStorage.getItem("toDos");
    if(!jsonData){
        return false;
    }
    else{
        for(var i = 0; i < toDos.length; i++){
            if( toDos[i].name.toUpperCase() === name.toUpperCase() ){
                return true;
            }
        }
    }
    return false;
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
                <p class="">${toDo.name}</p>
                <div id="popover-${index}" class="popover">
                    <div class="popover-content">
                    ${toDo.time}<br>${toDo.date}</div>
                </div>
                <i class="bi bi-clock-fill" data-action="detail"></i>
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
    action === "detail" && detail(toDoId);
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
    editToDoId = toDoId;
    name.value = toDos[toDoId].name;
    date.value = toDos[toDoId].date;
    time.value = toDos[toDoId].time;
    addModal.style.display = "block";
}

function cleanForm() {
    name.value = " ";
    date.value = " ";
    time.value = " ";
}

function deleteToDo(toDoId){
    toDos = toDos.filter((todo, index) => index !== toDoId);
    editToDoId = -1;

    renderToDo();
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

function detail(toDoId) {
    const popoverId = "popover-" + toDoId;
    const popover = document.getElementById(popoverId);
    if (popover.style.display === "none") {
        popover.style.display = "block";
      } else {
        popover.style.display = "none";
      }
}

function showNotification(msg){
    notificationElement.innerHTML = msg;

    notificationElement.classList.add("notif-enter");

    setTimeout(() =>{
        notificationElement.classList.remove("notif-enter")
    }, 4500)
}

function sendNotification(){
    const currentDate = new Date();
    toDos.forEach((toDo, index) => {
        if(toDo.date === currentDate.toISOString().substr(0, 10) && toDo.time === currentDate.toTimeString().substr(0, 5)){
            Notification.requestPermission().then(perm => {
                if(perm === "granted"){
                    new Notification(toDo.name)
                }
            })
        }
    });
}

setInterval(function(){
    sendNotification();
},60 * 1000)
const taskList = document.querySelector("#tasks");
const filterTitle = document.querySelector("#filter-title");
var filter = "tasks";
var listName;
var deleteListName;

// RETRIEVES LOCAL STORAGE DATA
var json = [];
var tasksStorage = localStorage.getItem("tasks");
if (tasksStorage != null) {
    var json = JSON.parse(tasksStorage);
    tasklistUpdate(filter);
} else {
  localStorage.setItem("tasks", JSON.stringify(json));
}
var jsonLists = [];
var listsStorage = localStorage.getItem("lists");
if (listsStorage != null) {
    var jsonLists = JSON.parse(listsStorage);
    listsUpdate();
} else {
  localStorage.setItem("lists", JSON.stringify(jsonLists));
}

// SHOWING OR EXITING MODAL FOR ADD A TASK OR CUSTOM LIST
document.querySelector(".add-btn").addEventListener("click", toggleModal);
const modal = document.querySelector(".modal-container")
modal.addEventListener("click", (event) => {
    if (event.target == modal) toggleModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key == "Escape" && !modal.classList.contains("hidden")) toggleModal();
})
const closeBtn = document.querySelectorAll(".close-x");
closeBtn[0].addEventListener("click", () => {
    resetModal();
    toggleModal();
});
closeBtn[1].addEventListener("click", () => {
    document.querySelector("#errorlist").innerText = "";
    document.querySelector("#newlist-name").value = "";
    toggleModal();
});
closeBtn[2].addEventListener("click", () => {
    toggleModal();
});

document.querySelector("#cancel").addEventListener("click", () => {
    resetModal();
    toggleModal();
});

document.querySelector("#new-list").addEventListener("click", toggleModal);
document.querySelector("#cancel-list").addEventListener("click", () => {
    document.querySelector("#errorlist").innerText = "";
    document.querySelector("#newlist-name").value = "";
    toggleModal();
});

function toggleModal() {
    document.querySelector(".new").classList.add("hidden");
    document.querySelector(".list").classList.add("hidden");
    document.querySelector(".task-details").classList.add("hidden");
    document.querySelector(".confirmation-delete").classList.add("hidden");
    modal.classList.toggle("hidden");
    if (event.target == document.querySelector("#new-list")) {
        document.querySelector(".list").classList.remove("hidden");
    } else if (event.target == document.querySelector(".add-btn span") || event.target == document.querySelector(".add-btn")){
        document.querySelector(".new").classList.remove("hidden");
    } else if(event.target.nodeName == "P") {
        document.querySelector(".task-details").classList.remove("hidden");
    }
}

function resetModal() {
    const error = document.querySelectorAll(".error");
    error[0].innerText = "";
    error[1].innerText = "";
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#check-completed").checked = false;
    document.querySelector("#check-important").checked = false;
    let options = document.querySelectorAll('option[value="false"]');
        options[0].selected = true;
        options[1].selected = true;
}

// FILTRING TASKS BY SIDE MENU CLICK
document.querySelector("#task-filter").addEventListener("click", () => {
    filter = "tasks";
    filterTitle.innerText = "Tasks";
    tasklistUpdate(filter);
});

document.querySelector("#important-filter").addEventListener("click", () => {
    filter = "important";
    filterTitle.innerText = "Important";
    tasklistUpdate(filter);
});

document.querySelector("#completed-filter").addEventListener("click", () => {
    filter = "completed";
    filterTitle.innerText = "Completed";
    tasklistUpdate(filter);
});

// CHANGING IMPORTANT OR COMPLETED BY CLICK ON CHECKBOX
function changeStatus() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = event.target.parentNode.querySelector("p").innerText;
    if (event.target.getAttribute("data-type") == "completed"){
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].title == task) {
                tasks[i].completed = event.target.checked ? true : false;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                if ((tasks[i].completed && (filter == "tasks" || filter == "important")) ||
                    (!tasks[i].completed && filter == "completed")) {
                    event.target.parentNode.classList.add("removing-task");
                    event.target.parentNode.addEventListener("transitionend", () => {tasklistUpdate(filter)});
                } else {
                    tasklistUpdate(filter);
                }
            }
        }
    };
    if (event.target.getAttribute("data-type") == "important"){
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].title == task) {
                tasks[i].important = event.target.checked ? true : false;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                if (filter == "important" && !tasks[i].important) {
                    event.target.parentNode.classList.add("removing-task");
                    event.target.parentNode.addEventListener("transitionend", () => {tasklistUpdate(filter)});
                } else {
                    tasklistUpdate(filter);
                }
            }
        }
    }
}

// VALIDATION FOR ADDING A TASK
document.querySelector("#create-event").addEventListener("click",validate);

function validate() {
    let title = document.querySelector("#title").value;
    let description = document.querySelector("#description").value;
    let checkCompleted = document.querySelector("#check-completed").checked;
    let checkImportant = document.querySelector("#check-important").checked;
    let customList = document.querySelector("#select-list").value;
    let color = document.querySelector("#color").value;
    const error = document.querySelectorAll(".error");
    let msg = [];

    if (title.length < 3) {
        msg.push("Title must be 3 characters min");
    } else if (title.length > 50) {
        msg.push("Title must be 50 characters max");
    } else {
        msg.push(null);
    }

    if (description.length > 500) {
        msg.push("Description must be 500 characters max");
    } else if (description.length == 0 || description == " ") {
        msg.push("Please insert a description");
    } else {
        msg.push(null);
    }
    for (let i = 0; i<msg.length; i++) {
        if (error[i] == null) {
        } else {
            error[i].innerText = msg[i];
        }
    }
    if (msg[0] == null && msg[1] == null) {
        saveTask(title, description, checkCompleted, checkImportant, customList, color);
        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#check-completed").checked = false;
        document.querySelector("#check-important").checked = false;
        let options = document.querySelectorAll('option[value="false"]');
        options[0].selected = true;
        options[1].selected = true;
        toggleModal();
    } else {
        return;
    }
}

// AFTER VALIDATION SAVES THE TASK LIKE AN OBJECT ON LOCAL STORAGE
function saveTask(title, description, checkCompleted, checkImportant, customList, color) {
    json = JSON.parse(localStorage.getItem("tasks"));
    let task = {};
    task["title"] = title;
    task["description"] = description;
    task["completed"] = checkCompleted;
    task["important"] = checkImportant;
    task["color"] = color;
    task["list"] = customList;
    if (customList != "false") {
        jsonLists = JSON.parse(localStorage.getItem("lists"));
        for (let i = 0; i<jsonLists.length; i++) {
            if (jsonLists[i].title == customList) {
                jsonLists[i].tasks.push(title);
                localStorage.setItem("lists", JSON.stringify(jsonLists));
            }
        }
    }
    json.push(task);
    localStorage.setItem("tasks", JSON.stringify(json));
    tasklistUpdate(filter);
}

// EXCLUDING A TASK
document.querySelector("#delete-task").addEventListener("click", function() {
    toggleModal();
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let lists = JSON.parse(localStorage.getItem("lists"));
    let task = event.target.parentNode.querySelector("h1").innerText;
    for (let i = 0; i<tasks.length; i++) {
        if (tasks[i].title == task) {
            if (tasks[i].list != "false") {
                for (let p = 0; p<lists.length; p++) {
                    for (let n = 0; n<lists[p].tasks.length; n++) {
                        if (lists[p].tasks[n] == task) {
                            lists[p].tasks.splice(n,1);
                        }
                    }
                }
            }
            tasks.splice(i,1);
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lists", JSON.stringify(lists));
    tasklistUpdate(filter);
});

// VALIDATION OF A NEW LIST NAME
document.querySelector("#create-list").addEventListener("click", validateList);

function validateList() {
    const newlist = document.querySelector("#newlist-name").value;
    const error = document.querySelector("#errorlist");
    if (newlist.length > 25) {
        error.innerText = "List name must be 25 characters max";
    } else if (newlist.length == 0 || newlist == " ") {
        error.innerText = "Insert a list name!";
    } else {
        error.innerText = "";
        saveList(newlist);
        document.querySelector("#newlist-name").value = ""
        toggleModal();
    }
}

// CREATES A NEW LIST
function saveList(name) {
    let list = {};
    list["title"] = name;
    list["tasks"] = [];
    jsonLists.push(list);
    localStorage.setItem("lists", JSON.stringify(jsonLists));
    listsUpdate();
}

// UPDATES LISTS ON SIDE MENU AND ON THE MODAL SELECT OPTION
function listsUpdate() {
    const customLists = document.querySelector("#customlist");
    let lists = JSON.parse(localStorage.getItem("lists"));
    const selectList = document.querySelector("#select-list");
    while (customLists.hasChildNodes()) {
        customLists.removeChild(customLists.lastChild);
    }
    while (selectList.hasChildNodes()) {
        if (selectList.lastChild.innerText == "None") break;
        selectList.removeChild(selectList.lastChild);
    }
    for (let i = 0; i<lists.length; i++ ) {
        // Shows lists on the menu
        let li = document.createElement("LI");
        li.innerText = lists[i].title;
        li.addEventListener("click", () => {
            filter = "list";
            filterTitle.innerText = "+ "+lists[i].title;
            listName = event.target.innerText.replace('🗑️','');
            tasklistUpdate(filter);
        });
        li.addEventListener("mouseenter", showExcludeList);
        li.addEventListener("mouseleave", quitExcludeList);
        customLists.appendChild(li);
        // Updates select input on modal
        let option = document.createElement("option");
        option.setAttribute("value",lists[i].title);
        option.innerText = lists[i].title;
        selectList.appendChild(option);
    }
}

// SHOWING TASKS DETAILS
function showTask (){
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    document.querySelector(".task-details").className = "task-details";
    toggleModal();
    document.querySelector(".task-details h1").innerText = event.target.innerText;
    for (let i = 0; i<tasks.length ; i++) {
        if (tasks[i].title == event.target.innerText) {
            let taskInfo = document.querySelectorAll(".task-details p");
            taskInfo[0].innerText = tasks[i].description;
            taskInfo[1].innerText = tasks[i].completed ? "YES" : "NO";
            taskInfo[2].innerText = tasks[i].important ? "YES" : "NO";
            document.querySelector(".task-details").classList.add(tasks[i].color);
        }
    }
}

// SHOWS THE EXCLUDE LIST BUTTON ON SIDE MENU WHEN CURSOR ENTERS
function showExcludeList() {
    if (event.target.querySelector("button") == null) {
        let buttonExclude = document.createElement("button");
        buttonExclude.classList.add("exclude-list");
        buttonExclude.innerText = "🗑️"
        buttonExclude.addEventListener("click", excludeList);
        event.target.appendChild(buttonExclude);
    }
}

// REMOVE EXCLUDE LIST BUTTON ON SIDE MENU WHEN CURSOR LEAVES
function quitExcludeList() {
    event.target.querySelector("button").remove();
}

// WHEN EXCLUDE BUTTON IS CLICKED DELETE THE TARGET CUSTOM LIST
function excludeList(){
    event.stopPropagation();
    let listName = event.target.parentNode.innerText.replace('🗑️','');
    jsonLists = JSON.parse(localStorage.getItem("lists"));
    for (let i = 0; i<jsonLists.length; i++) {
        if (jsonLists[i].title == listName) {
            if (jsonLists[i].tasks.length == 0) {
                if (document.querySelector("#filter-title").innerText == "+ "+jsonLists[i].title) {
                    filter = "tasks";
                    filterTitle.innerText = "Tasks";
                    tasklistUpdate(filter);
                }
                jsonLists.splice(i,1);
                localStorage.setItem("lists", JSON.stringify(jsonLists));
                listsUpdate();
            } else {
                deleteListName = jsonLists[i].title;
                toggleModal();
                document.querySelector(".confirmation-delete").classList.toggle("hidden");
            }
        }
    }
}

// WHEN A CUSTOM LIST HAVE 1 TASK OR MORE, SHOWS MODAL TO CONFIRM THE EXCLUSION
document.querySelector("#cancel-delete").addEventListener("click", toggleModal);
document.querySelector("#confirm-delete").addEventListener("click", confirmDelete);

function confirmDelete() {
    toggleModal();
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i<tasks.length; i++) {
        if(tasks[i].list == deleteListName) {
            tasks.splice(i,1);
            i--;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    jsonLists = JSON.parse(localStorage.getItem("lists"));
    for (let i = 0; i<jsonLists.length; i++) {
        if (jsonLists[i].title == deleteListName) {
            jsonLists[i].tasks = "";
            if (jsonLists[i].tasks.length == 0) {
                if (document.querySelector("#filter-title").innerText == "+ "+deleteListName) {
                    filter = "tasks";
                    filterTitle.innerText = "Tasks";
                    tasklistUpdate(filter);
                }
                jsonLists.splice(i,1);
                localStorage.setItem("lists", JSON.stringify(jsonLists));
                listsUpdate();
                tasklistUpdate(filter);
            }
        }
    }
}

// UPDATES THE TASK LIST ON THE PAGE BASED ON THE FILTER (ONLY COMPLETED, ONLY IMPORTANT, CUSTOM LIST, ETC)
function tasklistUpdate(filter) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks == null) return;
    // Resets the principal list of tasks
    while (taskList.hasChildNodes()) {
        taskList.removeChild(taskList.lastChild);
    }
    // Removes the active visual indicator on the menu
    if (document.querySelector(".active-list") != null) {
        document.querySelector(".active-list").classList.remove("active-list");
    }
    if (document.querySelector(".active") != null) {
        document.querySelector(".active").classList.remove("active");
    }
    if(filter == "tasks") {
        document.querySelector("#task-filter").classList.add("active");
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].list == "false" && tasks[i].completed == false) {
                let li = document.createElement("LI");
                let completed = document.createElement("input");
                completed.checked = tasks[i].completed;
                completed.setAttribute("type","checkbox");
                completed.setAttribute("data-type","completed");
                completed.addEventListener("change", changeStatus);
                let title = document.createElement("p");
                title.addEventListener("click", showTask);
                title.innerText = tasks[i].title;
                if (tasks[i].completed == true) title.style.textDecorationLine = "line-through";
                if (tasks[i].important == true) title.style.fontWeight = "bold";
                let important = document.createElement("input");
                important.checked = tasks[i].important;
                important.setAttribute("type","checkbox");
                important.setAttribute("data-type","important");
                important.addEventListener("change", changeStatus);
                let label = document.createElement("label");
                label.innerText = "Important"
                li.appendChild(completed);
                li.appendChild(title);
                li.appendChild(important);
                li.appendChild(label);
                if (tasks[i].color != "false") li.classList.add(tasks[i].color);
                taskList.appendChild(li);
            }
        }
    }
    if(filter == "important") {
        document.querySelector("#important-filter").classList.add("active");
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].important == true && tasks[i].completed == false) {
                let li = document.createElement("LI");
                let completed = document.createElement("input");
                completed.checked = tasks[i].completed;
                completed.setAttribute("type","checkbox");
                completed.setAttribute("data-type","completed");
                completed.addEventListener("change", changeStatus);
                let title = document.createElement("p");
                title.addEventListener("click", showTask);
                title.innerText = tasks[i].title;
                if (tasks[i].completed == true) title.style.textDecorationLine = "line-through";
                title.style.fontWeight = "bold";
                let important = document.createElement("input");
                important.checked = tasks[i].important;
                important.setAttribute("type","checkbox");
                important.setAttribute("data-type","important");
                important.addEventListener("change", changeStatus);
                let label = document.createElement("label");
                label.innerText = "Important"
                li.appendChild(completed);
                li.appendChild(title);
                li.appendChild(important);
                li.appendChild(label);
                if (tasks[i].color != "false") li.classList.add(tasks[i].color);
                taskList.appendChild(li);
            }
        }
    }
    if(filter == "completed") {
        document.querySelector("#completed-filter").classList.add("active");
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].completed == true) {
                let li = document.createElement("LI");
                let completed = document.createElement("input");
                completed.checked = tasks[i].completed;
                completed.setAttribute("type","checkbox");
                completed.setAttribute("data-type","completed");
                completed.addEventListener("change", changeStatus);
                let title = document.createElement("p");
                title.addEventListener("click", showTask);
                title.innerText = tasks[i].title;
                title.style.textDecorationLine = "line-through";
                if (tasks[i].important == true) title.style.fontWeight = "bold";
                let important = document.createElement("input");
                important.checked = tasks[i].important;
                important.setAttribute("type","checkbox");
                important.setAttribute("data-type","important");
                important.addEventListener("change", changeStatus);
                let label = document.createElement("label");
                label.innerText = "Important"
                li.appendChild(completed);
                li.appendChild(title);
                li.appendChild(important);
                li.appendChild(label);
                if (tasks[i].color != "false") li.classList.add(tasks[i].color);
                taskList.appendChild(li);
            }
        }
    }
    if (filter == "list") {
        if(event.target != document.querySelector("#create-event")) event.target.classList.add("active-list");
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].list == listName) {
                let li = document.createElement("LI");
                let completed = document.createElement("input");
                completed.checked = tasks[i].completed;
                completed.setAttribute("type","checkbox");
                completed.setAttribute("data-type","completed");
                completed.addEventListener("change", changeStatus);
                let title = document.createElement("p");
                title.addEventListener("click", showTask);
                title.innerText = tasks[i].title;
                if (tasks[i].completed == true) title.style.textDecorationLine = "line-through";
                if (tasks[i].important == true) title.style.fontWeight = "bold";
                let important = document.createElement("input");
                important.checked = tasks[i].important;
                important.setAttribute("type","checkbox");
                important.setAttribute("data-type","important");
                important.addEventListener("change", changeStatus);
                let label = document.createElement("label");
                label.innerText = "Important"
                li.appendChild(completed);
                li.appendChild(title);
                li.appendChild(important);
                li.appendChild(label);
                if (tasks[i].color != "false") li.classList.add(tasks[i].color);
                taskList.appendChild(li);
            }
        }
    }
    if (filter == "search") {
        if (searchText == "" || searchText == " ") return;
        for (let i = 0; i<tasks.length; i++) {
            if (tasks[i].title.toUpperCase().includes(searchText.toUpperCase())) {
                let li = document.createElement("LI");
                let completed = document.createElement("input");
                completed.checked = tasks[i].completed;
                completed.setAttribute("type","checkbox");
                completed.setAttribute("data-type","completed");
                completed.addEventListener("change", changeStatus);
                let title = document.createElement("p");
                title.addEventListener("click", showTask);
                title.innerText = tasks[i].title;
                if (tasks[i].completed == true) title.style.textDecorationLine = "line-through";
                if (tasks[i].important == true) title.style.fontWeight = "bold";
                let important = document.createElement("input");
                important.checked = tasks[i].important;
                important.setAttribute("type","checkbox");
                important.setAttribute("data-type","important");
                important.addEventListener("change", changeStatus);
                let label = document.createElement("label");
                label.innerText = "Important"
                li.appendChild(completed);
                li.appendChild(title);
                li.appendChild(important);
                li.appendChild(label);
                if (tasks[i].color != "false") li.classList.add(tasks[i].color);
                taskList.appendChild(li);
            }
        }
    }
}

// SEARCH BAR
var searchText;
document.querySelector("#searchbar-input").addEventListener("input", () => {
    searchText = document.querySelector("#searchbar-input").value;
    filter = "search";
    filterTitle.innerText = "Search Results";
    tasklistUpdate(filter);
});

// Dự án xử dụng bubbling phase , map, join , push , trim , preventDefault , closest , prompt , splice , some, toLowerCase , JSON.stringify , JSON.parse , localStorage , dataset , XSS
const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];// lấy dữ liệu từ localStorage nếu có , nếu không có thì khởi tạo là mảng rỗng

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html; 
    return div.innerHTML;
}

console.log(escapeHTML("<h1>Hello</h1>"));


// cái hàm isDuplicateTask là hàm tái sử dụng cho các hàm bên dưới , nó để kiểm tra xem tiêu đề công việc đã tồn tại trong danh sách hay chưa
function isDuplicateTask(newTitle , excludeIndex = -1) {
    const isDuplicate = tasks.some((task , index) =>
        task.title.toLowerCase() === newTitle.toLowerCase() && 
        excludeIndex !== index );

        return isDuplicate;
};

function saveTasks() {
    localStorage.setItem("tasks" , JSON.stringify(tasks)); // lưu trữ dữ liệu vào localStorage
}

//handleTaskActions là để xử lý các hành động (edit, mark done/undone, delete)
function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");   
    if (!taskItem) return;
    // const taskIndex = +taskItem.getAttribute("data-index"); 
    const taskIndex = +taskItem.dataset.index; 
    const task = tasks[taskIndex]; 

    if(e.target.closest(".edit")){
        let newTitle = prompt("Nhập tiêu đề mới:" , task.title); 
        
        if(newTitle === null) return; // Cái này để kiểm tra xem người dùng có nhấn nút hủy hay không ( tức là nhấn vào nút hủy)
        newTitle = newTitle.trim(); 

        if(!newTitle){
            alert("Task title cannot be empty!"); 
            return; 
        }

        if (isDuplicateTask(newTitle , taskIndex)) {
            alert("Công việc đã tồn tại trong danh sách!");
            return;
        }

        task.title = newTitle; 
        renderTasks(); 
        saveTasks();

        } else if (e.target.closest(".done")){
            task.completed = !task.completed; 
            renderTasks(); 
            saveTasks();
        } else if (e.target.closest(".delete")){
            if(confirm(`Bạn có chắc chắn muốn xóa "${task.title}" không?`)){
                tasks.splice(taskIndex , 1); 
                renderTasks();
                saveTasks();
            }
        }
}


// addTask để xử lí cho todoForm là để thêm công việc mới vào danh sách công việc
function addTask(e) {
    // vì onsubmit sẽ tự động reload lại trang nên cần phải ngăn chặn hành vi mặc định của nó bằng cách dùng preventDefault
    e.preventDefault();

    // lấy giá trị của ô input , sau đó trim để xóa khoảng trắng ở đầu và cuối
    const value = todoInput.value.trim();
    if (!value) {
        alert("Vui lòng nhập công việc cần làm!");
        return;
    }

    // const isDuplicate = tasks.some(task =>
    //     task.title.toLowerCase() === newTask.title.toLowerCase()
    // )
    if (isDuplicateTask(value)) {
        alert("Công việc đã tồn tại trong danh sách!");
        return;
    }
    
    tasks.push({
        title: value,
        completed: false,
    }
    );
    // console.log(tasks);
    renderTasks();
    saveTasks();
    todoInput.value = ""; 

    
};

function renderTasks() {

    if(!tasks.length) {
        taskList.innerHTML = "<p class='empty-messeage'>No tasks available.</p>";
        return;
    }
    const html = tasks.map((task , index) => `
        <li class="task-item ${task.completed ? "completed" : ""}" data-index="${index}">
            <span class="task-title">${escapeHTML(task.title)}</span>
            <div class="task-action">
                <button class="task-btn edit">Edit</button>
                <button class="task-btn done">${task.completed ? "Mark as undone" : "Mark as done"}</button>
                <button class="task-btn delete">Delete</button>
            </div>
        </li>   
    `).join(" ");


    taskList.innerHTML = html;
}

renderTasks();

todoForm.addEventListener("submit", addTask); 
taskList.addEventListener("click", handleTaskActions); 


// ----- Helpers -----
const STORAGE_KEY = "todos_v1";

function loadTodos() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch {
        return [];
    }
}

function saveTodos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}


// ----- App State -----
let todos = loadTodos();

// ----- DOM -----
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const listEl = document.getElementById("todo-list");
const pendingText = document.getElementById("pending-text");
const clearAllBtn = document.getElementById("clear-all");


// ----- Render -----
function render() {
    listEl.innerHTML = "";
    todos
        .filter(t => t.text.toLowerCase().includes(searchText))
        .forEach(t => {
            const li = document.createElement("li");
            li.draggable = true;
            li.className = "item" + (t.done ? " done" : "");
            li.dataset.id = t.id;

            // const cb = document.createElement("input");
            // cb.type = "checkbox";
            // cb.checked = t.done;
            // cb.className = "toggle";

            const span = document.createElement("span");
            span.className = "text";
            span.textContent = t.text;

            const del = document.createElement("button");
            del.className = "del";
            del.title = "Delete";
            del.textContent = "🗑";

            li.append(span, del);
            listEl.appendChild(li);
        });

    const pending = todos.filter(t => !t.done).length;
    pendingText.textContent = `You have ${pending} pending ${pending === 1 ? "task" : "tasks"}`;
    saveTodos(todos);
}

// ----- Actions -----
function addTodo(text) {
    const value = (text ?? input.value).trim();

    // 1. Validate rỗng
    if (!value) {
        alert("Todo không được để trống!");
        return;
    }

    // 2. Validate trùng (so sánh không phân biệt hoa/thường)
    const duplicate = todos.some(t => t.text.toLowerCase() === value.toLowerCase());
    if (duplicate) {
        alert("Todo này đã tồn tại!");
        return;
    }

    // 3. Nếu hợp lệ thì thêm
    todos.unshift({ id: crypto.randomUUID(), text: value, done: false });
    input.value = "";
    render();
}

function toggleTodo(id) {
    const t = todos.find(x => x.id === id);
    if (t) { t.done = !t.done; render(); }
}

function deleteTodo(id) {
    todos = todos.filter(x => x.id !== id);
    render();
}

function clearAll() {
    if (!todos.length) return;
    if (confirm("Clear all tasks?")) {
        todos = [];
        render();
    }
}

// ----- Events -----
addBtn.addEventListener("click", () => addTodo());
input.addEventListener("keydown", e => {
    if (e.key === "Enter") addTodo();
});

// Ủy quyền sự kiện cho danh sách
listEl.addEventListener("click", e => {
    const li = e.target.closest(".item");
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.classList.contains("del")) {
        deleteTodo(id);
    }
    // else if (e.target.classList.contains("toggle")) {
    //     toggleTodo(id);
    // }
});

clearAllBtn.addEventListener("click", clearAll);

let searchText = "";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
    searchText = searchInput.value.toLowerCase();
    render();
});

searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        searchText = searchInput.value.toLowerCase();
        render();
    }
});

let dragSrcId = null; // lưu id của todo đang kéo

// khi bắt đầu kéo
listEl.addEventListener("dragstart", e => {
    const li = e.target.closest(".item");
    if (!li) return;
    dragSrcId = li.dataset.id;
    e.dataTransfer.effectAllowed = "move";
    li.classList.add("dragging");
});

// khi kết thúc kéo
listEl.addEventListener("dragend", e => {
    const li = e.target.closest(".item");
    if (li) li.classList.remove("dragging");
    dragSrcId = null;
});

// cho phép thả
listEl.addEventListener("dragover", e => {
    e.preventDefault(); // cần để cho phép drop
    const afterElement = getDragAfterElement(listEl, e.clientY);
    const draggingEl = listEl.querySelector(".dragging");
    if (!draggingEl) return;

    if (afterElement == null) {
        listEl.appendChild(draggingEl);
    } else {
        listEl.insertBefore(draggingEl, afterElement);
    }
});

// khi thả thì cập nhật lại mảng todos
listEl.addEventListener("drop", e => {
    e.preventDefault();
    const newOrder = Array.from(listEl.children).map(li => li.dataset.id);
    // sắp xếp lại todos theo thứ tự mới
    todos.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
    saveTodos(todos);
    render();
});

// hàm phụ để xác định vị trí insert
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".item:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ----- First paint -----
render();

const API = "/api/tasks";
const list = document.getElementById("task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  list.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");

    const span = document.createElement("span");
    span.textContent = t.title;
    span.onclick = async () => { await fetch(`${API}/${t.id}`, { method: "PUT" }); loadTasks(); };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = async () => { await fetch(`${API}/${t.id}`, { method: "DELETE" }); loadTasks(); };

    li.append(span, del);
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.value }),
  });
  input.value = "";
  loadTasks();
});

loadTasks();

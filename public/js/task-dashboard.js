// const header = document.getElementById('#user');

const taskDOM = document.querySelector(".tasks");
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector(".task-input");
const loadingDOM = document.querySelector(".loading-text");
const formAlertDOM = document.querySelector(".form-alert");

const showTasks = async () => {
  loadingDOM.style.visibilty = "visible";
  try {
    const response = await axios.get("/tasks");
    const {
      data: { tasks },
    } = response;
    if (response.status === 200) {
      console.log("response", response);
      console.log("Tasks", tasks);
      if (tasks.length < 1) {
        taskDOM.innerHTML =
          '<h5 class="empty-list">No tasks have been created</h5>';
        loadingDOM.style.visibilty = "hidden";
        return;
      }
      const allTasks = tasks
        .map((task) => {
          const { completed, _id: taskId, description } = task;
          return `<div class="single-task ${completed && "task-completed"}">
        <h5><span><i class="fa-solid fa-circle-check"></i></span>${description}</h5>
        <div class="task-links">
        <!-- edit link -->
        <a href="/edit-task?id=${taskId}" class="edit-link">
        <i class="fa-solid fa-pen-to-square"></i>
        </a>
        <!-- delete btn -->
        <button type="button" class="btn delete-btn" data-id="${taskId}">
        <i class="fa-solid fa-trash"></i>
        </button>
        </div>
        </div>`;
        })
        .join("");
      taskDOM.innerHTML = allTasks;
    }
  } catch (error) {
    taskDOM.innerHTML =
      '<h5 class="empty-list"> There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibilty = 'hidden';
};
showTasks();

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskName = taskInput.value;
  try {
    const response = await axios.post("/tasks", { description: taskName });
    if (response.status === 201) {
      console.log(response);
      showTasks();
      taskInput.value = "";
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent = `success, task added`;
      formAlertDOM.classList.add("text-success");
    }
  } catch (e) {
    console.log(e);
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `${e.response.data.err.description}, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

taskDOM.addEventListener('click', async(e)=>{
    const el = e.target
    if(el.parentElement.classList.contains('delete-btn')){
        loadingDOM.style.visibilty = 'visible';
        const id = el.parentElement.dataset.id;
        try {
            await axios.delete(`tasks/${id}`);
            showTasks();
        } catch (error) {
            console.log(error);
        }
    }
    loadingDOM.style.visibilty = 'hidden';
})

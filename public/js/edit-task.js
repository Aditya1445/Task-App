const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".edit-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");

const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let nameBeforeUpdate;
const showTask = async () => {
  try {
    const response = await axios.get(`/tasks/${id}`);
    const {
      data: { task },
    } = response;
    if (response.status === 200) {
      console.log("response", response);
      console.log("Tasks", task);

      const { _id: taskID, completed, description } = task;
      taskIDDOM.textContent = taskID;
      taskNameDOM.value = description;
      if (completed) {
        taskCompletedDOM.checked = true;
      }
      nameBeforeUpdate = description;
    }
  } catch (error) {
    console.log(error);
  }
};

showTask();

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();

  try {
    const taskName = taskNameDOM.value;
    const taskCompleted = taskCompletedDOM.checked;
    const response = await axios.patch(`/tasks/${id}`, {
      description: taskName,
      completed: taskCompleted,
    });

    console.log('Updated response', response);
    if (response.status === 200) {
      const {
        data: { task },
      } = response

      const { _id: taskID, completed, description } = task;
      taskIDDOM.textContent = taskID;
      taskNameDOM.value = description;
      if (completed) {
        taskCompletedDOM.checked = true;
      }
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent = "success, task edited";
      formAlertDOM.classList.add("text-success");
    }
  } catch (error) {
    console.log(error);
    taskNameDOM.value = nameBeforeUpdate;
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = "error, please try again";
  }
  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

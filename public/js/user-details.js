// Remove user
const deleteButton = document.querySelector(".deleteUser");

deleteButton.addEventListener("click", async () => {
  try {
    const response = await axios.delete("/users/me");
    if (response.status === 200) {
      console.log(response);
      location.assign("/users/signup");
    }
  } catch (error) {
    console.log(error);
  }
});

const detailsForm = document.getElementById("detailsForm");
const getUserDetail = async () => {
  try {
    const response = await axios.get("/users/me");
    if (response.status === 200) {
      // alert('Hurray');
      console.log(response);
      detailsForm.name.value = response.data.user.name;
      detailsForm.email.value = response.data.user.email;
      document.getElementById("myImg").src = response.data.user.avatar;
    }
  } catch (error) {
    console.log(error);
  }
};

getUserDetail();

//Update user details
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const nameError = document.getElementById("name-error");
const imageError = document.getElementById("image-error");
const imageFile = document.getElementById("formFile");
detailsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  imageError.textContent = "";

  console.log(detailsForm.name.value);
  const formData = new FormData();
  formData.append("name", detailsForm.name.value);
  formData.append("email", detailsForm.email.value);
  formData.append("avatar", imageFile.files[0]);
  if (detailsForm.password.value !== "") {
    formData.append("password", detailsForm.password.value);
  }

  try {
    const response = await axios.patch("/users/me", formData);
    console.log("Update begin");
    if (response.status === 200) {
      // alert("Profile info updated");
      console.log(response);
      getUserDetail();
    }
  } catch (error) {
    console.log(error);
    nameError.textContent = error.response.data.err.name;
    emailError.textContent = error.response.data.err.email;
    passwordError.textContent = error.response.data.err.password;
    imageError.textContent = error.response.data.err.avatar;
  }
});

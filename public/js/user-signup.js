// user signup

const registrationForm = document.getElementById("regForm");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const nameError = document.getElementById("name-error");
const imageError = document.getElementById("image-error");
const imageFile = document.getElementById("formFile");
registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  imageError.textContent = "";
  

  const formData = new FormData();
  formData.append("name", registrationForm.name.value);
  formData.append("email", registrationForm.email.value);
  formData.append("password", registrationForm.password.value);
  formData.append("avatar", imageFile.files[0]);
  try {
    let response = await axios.post("/users/signup", formData);
    if (response.status === 201) {
      alert("New Account Created");
      console.log(response.data);
      location.assign('/dashboard');
    }
  } catch (error) {
    console.log(error);
    // console.log(error.response.data.error.email);
    nameError.textContent = error.response.data.error.name;
    emailError.textContent = error.response.data.error.email;
    passwordError.textContent = error.response.data.error.password;
    imageError.textContent = error.response.data.error.avatar;
  }
});
// mojocare-> company
//hubilo-> company
//piramal-> company
//over leaf -> resume builder

// User signin

const loginForm = document.getElementById("loginForm");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  emailError.innerText = "";
  passwordError.innerText = "";
  const formValue = { email: inputEmail.value, password: inputPassword.value };
  try {
    const response = await axios.post("/users/login", formValue);
    if (response.status === 200) {
      alert("login successful");
      console.log(response);
      //   localStorage.setItem("auth", response.data.token);
      //   console.log(response.data.token);
      //   axios.defaults.headers.common['x-access-token'] = response.data.token;
      location.assign("/dashboard");
    }
  } catch (error) {
    console.log(error.response.data.err.email);
    console.log(error.response.data.err.password);

    emailError.innerText = error.response.data.err.email;
    passwordError.innerText = error.response.data.err.password;
  }
});

const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

const getOptions = function (body, method) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const clearInputs = function () {
  getElement('#username').value = '';
  getElement('#name').value = '';
  getElement('#email').value = '';
  getElement('#password').value = '';
  getElement('#cnf-password').value = '';
};

const getFormDetails = function () {
  const username = getElement('#username').value;
  const name = getElement('#name').value;
  const email = getElement('#email').value;
  const password = getElement('#password').value;
  return { username, name, email, password };
};

const showMessage = function (status) {
  const $status = getElement('.status');
  let text = 'Something went wrong';
  if (status) {
    text = 'Successfully registered';
    $status.classList.remove('error-status');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 3000);
  }
  $status.innerText = text;
};

const listenerOnSubmitBtn = function () {
  const $signup = getElement('#sign-up-form');
  $signup.addEventListener('submit', (event) => {
    event.preventDefault();
    const signupData = getFormDetails();
    fetch('/poet/register', getOptions(signupData, 'POST')).then((res) => {
      if (res.ok) clearInputs();
      showMessage(res.ok);
    });
  });
};

const showUsernameStatus = function (isAvailable) {
  const $availability = getElement('#username-availability');
  let text = 'username already exists';
  let color = 'red';
  if (isAvailable) {
    color = 'green';
    text = 'username available';
  }
  $availability.style.color = color;
  $availability.innerText = text;
};

const areInputsNotEmpty = function (formData) {
  const arrayOfInputs = Object.values(formData);
  return arrayOfInputs.every((dataUnit) => dataUnit);
};

const isValidPassword = function ({ password }) {
  const cnfPassword = getElement('#cnf-password').value;
  return password.length > 5 && password === cnfPassword;
};

const areValidInputs = function () {
  const formData = getFormDetails();
  const areInputNotEmpty = areInputsNotEmpty(formData);
  const isValidUsername = JSON.parse(localStorage.getItem('isAvailable'));
  const areValidPasswords = isValidPassword(formData);
  return areInputNotEmpty && isValidUsername && areValidPasswords;
};

const enableBtn = function () {
  getElement('.btn').classList.add('none-pointer');
  if (areValidInputs()) {
    getElement('.btn').classList.remove('none-pointer');
  }
};

const usernameAvailability = function () {
  const $username = getElement('#username');
  $username.addEventListener('input', () => {
    const username = $username.value;
    fetch('/poet/username/available', getOptions({ username }, 'POST'))
      .then((res) => res.json())
      .then((data) => {
        showUsernameStatus(data.isAvailable);
        localStorage.setItem('isAvailable', data.isAvailable);
        enableBtn();
      });
  });
};

const listenerOnConfirmPassword = function () {
  const $cnfPassword = getElement('#cnf-password');
  $cnfPassword.addEventListener('input', () => {
    const formData = getFormDetails();
    let result = 'password is too sort or not matched';
    if (isValidPassword(formData)) result = '';
    getElement('#cnf-password-checker').innerText = result;
  });
};

const enableSubmitBtn = function () {
  Array.from(getAllElement('input')).forEach((input) => {
    input.addEventListener('input', enableBtn);
  });
};

const main = function () {
  usernameAvailability();
  enableSubmitBtn();
  listenerOnSubmitBtn();
  listenerOnConfirmPassword();
};

window.onload = main;

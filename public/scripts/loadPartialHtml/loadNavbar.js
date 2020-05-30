const loadNavbar = function () {
  const getElement = (selector) => document.querySelector(selector);
  fetch('./includes/navbar.html')
    .then((res) => res.text())
    .then((data) => (getElement('.navbar').innerHTML = data));
};

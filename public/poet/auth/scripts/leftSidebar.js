const getElement = (selector) => document.querySelector(selector);

const loadPartialHtml = function () {
  fetch('./includes/sidebar.html')
    .then((res) => res.text())
    .then((data) => (getElement('.left-sidebar').innerHTML = data));
};

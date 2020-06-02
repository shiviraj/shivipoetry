const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

const fetchAndRenderPoet = () => {
  fetch('/poet/me/i')
    .then((res) => res.json())
    .then((poet) => {
      getElement('.profile .email').innerHTML = poet.email;
      getElement('.profile .name').innerHTML = poet.displayName;
    });
};

const loadAndRenderSidebar = () => {
  fetch('./includes/sidebar.html')
    .then((res) => res.text())
    .then((data) => (getElement('.left-sidebar').innerHTML = data));
};

const listenerOnLogout = () => {
  getElement('#logout').addEventListener('click', () => {
    fetch('/poet/me/logout').then(({ status }) => {
      if (status == 200) window.location.href = '../login.html';
    });
  });
};

const loadPartialHtml = function () {
  loadAndRenderSidebar();
  setTimeout(() => {
    fetchAndRenderPoet();
    listenerOnLogout();
  }, 1000);
};

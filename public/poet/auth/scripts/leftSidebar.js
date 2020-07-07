const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  return res.json();
};

const fetchText = async (url, options) => {
  const res = await fetch(url, options);
  return res.text();
};

const fetchAndRenderPoet = async () => {
  try {
    const poet = await fetchData('/poet/me/i');
    getElement('.profile .email').innerHTML = poet.email;
    getElement('.profile .name').innerHTML = poet.displayName;
  } catch (error) {
    console.error(error);
  }
};

const loadAndRenderSidebar = async () => {
  try {
    const text = await fetchText('./includes/sidebar.html');
    getElement('.left-sidebar').innerHTML = text;
  } catch (error) {
    console.error(error);
  }
};

const listenerOnLogout = () => {
  getElement('#logout').addEventListener('click', async () => {
    try {
      const { status } = await fetch('/poet/me/logout');
      if (status == 200) window.location.href = '../login.html';
    } catch (error) {
      console.error(error);
    }
  });
};

const loadPartialHtml = async function () {
  await loadAndRenderSidebar();
  await fetchAndRenderPoet();
  listenerOnLogout();
};

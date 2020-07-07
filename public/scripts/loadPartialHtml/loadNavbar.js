const loadNavbar = async function () {
  const getElement = (selector) => document.querySelector(selector);
  try {
    const res = await fetch('./includes/navbar.html');
    const data = await res.text();
    getElement('.navbar').innerHTML = data;
  } catch (error) {
    console.error('Unable to load navbar');
  }
};

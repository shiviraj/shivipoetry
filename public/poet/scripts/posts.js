const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

const removePost = function ($post) {
  return (status) => {
    if (status) $post.remove();
  };
};

const removePublishButton = function ($publish) {
  return (status) => {
    if (!status) return;
    const $parent = $publish.parentNode.parentNode;
    $publish.remove();
    $parent.querySelector('.title').lastChild.remove();
  };
};

const listenerOnPublish = () => {
  const $publishes = Array.from(getAllElement('.publish'));
  $publishes.forEach(($publish) => {
    $publish.addEventListener('click', async (e) => {
      try {
        const removeAction = removePublishButton($publish);
        const url = `/poet/publish/${e.target.id}`;
        const data = await fetchData(url, { method: 'POST' });
        removeAction(data);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const deletePost = async ($element) => {
  try {
    const performRemovePost = removePost($element.parentNode.parentNode);
    const url = `/poet/deletePost/${$element.title}`;
    const res = await fetchData(url, { method: 'DELETE' });
    performRemovePost(res);
  } catch (error) {
    console.error(error);
  }
};

const hideConfirmation = ($delete) => {
  $delete.nextElementSibling.classList.add('hidden');
  $delete.classList.remove('hidden');
};

const showConfirmation = ($delete) => {
  $delete.nextElementSibling.classList.remove('hidden');
  $delete.classList.add('hidden');
  setTimeout(hideConfirmation, 3000, $delete);
};

const main = () => {
  listenerOnPublish();
};

window.onload = main;

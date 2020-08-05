const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

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
        const options = getOptions({ url: e.target.id });
        const data = await fetchData('/poet/me/publishPost', options);
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
    const options = getOptions({ url: $element.title }, 'DELETE');
    const res = await fetchData('/poet/me/deletePost', options);
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

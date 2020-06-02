const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const renderPosts = () => {
  fetch('/poet/me/myAllPosts')
    .then((res) => res.json())
    .then(showPosts);
};

const listenerOnPublish = () => {
  const $publishes = Array.from(getAllElement('.publish'));
  $publishes.forEach(($publish) => {
    $publish.addEventListener('click', (e) => {
      fetch('/poet/me/publishPost', getOptions({ url: e.target.id }))
        .then((res) => res.json())
        .then(removePublishButton($publish));
    });
  });
};

const deletePost = ($element) => {
  const url = $element.title;
  fetch('/poet/me/deletePost', getOptions({ url }, 'DELETE'))
    .then((res) => res.json())
    .then(removePost($element.parentNode.parentNode));
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

const main = async () => {
  await loadPartialHtml();
  renderPosts();
};

window.onload = main;

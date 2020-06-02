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
  setTimeout(() => ($delete.innerHTML = 'Delete'), 0);
};

const listenerOnDelete = () => {
  const $deletes = Array.from(getAllElement('.delete'));
  $deletes.forEach(($delete) => {
    $delete.addEventListener('click', () => {
      $delete.innerHTML = `<div class="confirmation">
        <div class="confirmation-title">Are you sure to delete?</div> 
        <div class="buttons">
          <button onclick="hideConfirmation(this.parentNode.parentNode.parentNode)">No</button>
          <button onclick="deletePost(this.parentNode.parentNode.parentNode)">Yes</button>
        </div>
      </div>`;
      setTimeout(hideConfirmation, 3000, $delete);
    });
  });
};

const main = () => {
  loadPartialHtml();
  renderPosts();
  setTimeout(() => {
    listenerOnPublish();
    listenerOnDelete();
  }, 1000);
};

window.onload = main;

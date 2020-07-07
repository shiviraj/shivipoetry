const renderPosts = async () => {
  try {
    const posts = await fetchData('/poet/me/myAllPosts');
    showPosts(posts);
  } catch (error) {
    console.log(error);
  }
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

const main = async () => {
  await loadPartialHtml();
  await renderPosts();
};

window.onload = main;

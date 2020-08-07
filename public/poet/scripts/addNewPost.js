const submitPost = async function (e, status) {
  try {
    e.preventDefault();
    const { _id, ...options } = getPostOptions();
    options.status = status;
    const postOptions = getOptions(options, 'PUT');
    const res = await fetchData('/poet/addNewPost', postOptions);
    if (res.status) return (location.href = '/poet');
    renderResponse();
  } catch (error) {
    console.error(error);
  }
};

const listenerOnSubmit = function () {
  const $publish = getElement('#publish');
  $publish.addEventListener('click', (e) => submitPost(e, 'published'));
  const $saveAsDraft = getElement('#save-as-draft');
  $saveAsDraft.addEventListener('click', (e) => submitPost(e, 'draft'));
};

const main = async function () {
  listenerOfAddNewCategoryAndTag();
  listenerOnUrl();
  listenerOnSubmit();
};

window.onload = main;

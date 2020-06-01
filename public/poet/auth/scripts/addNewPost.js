const submitPost = function (e, status) {
  e.preventDefault();
  const title = getElement('#title').value;
  const url = getElement('.url input').value;
  const content = CKEDITOR.instances['content'].getData();
  const categories = getAll('category');
  const tags = getAll('tag');
  const options = getOptions(
    { title, content, url, categories, tags, status },
    'PUT'
  );
  fetch('/poet/me/addNewPost', options)
    .then((res) => res.json())
    .then(({ status }) => {
      if (status) return (location.href = './dashboard.html');
      renderResponse();
    });
};

const listenerOnSubmit = function () {
  const $publish = getElement('#publish');
  $publish.addEventListener('click', (e) => submitPost(e, 'published'));
  const $saveAsDraft = getElement('#save-as-draft');
  $saveAsDraft.addEventListener('click', (e) => submitPost(e, 'draft'));
};

const main = function () {
  loadPartialHtml();
  fetchCategoryAndTags();
  listenerOfAddNewCategoryAndTag();
  listenerOnUrl();
  listenerOnSubmit();
};

window.onload = main;

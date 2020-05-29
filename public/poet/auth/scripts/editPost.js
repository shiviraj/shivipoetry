const fillAll = (list, idName) => {
  list.forEach((item) => {
    const $item = getElement(`#${idName}-list input[value="${item.url}"]`);
    if ($item) $item.checked = true;
  });
};

const renderPostsToEdit = (post) => {
  getElement('#title').value = post.title;
  getElement('#content').value = post.content;
  getElement('#post-url').value = post.url;
  getElement('#post-url').title = post._id;
  localStorage.setItem('url', post.url);
  setTimeout(() => {
    fillAll(post.categories, 'category');
    fillAll(post.tags, 'tag');
  }, 1000);
};

const fetchPost = function () {
  const url = window.location.search.split('=')[1];
  fetch('/poet/me/post', getOptions({ url }))
    .then((res) => res.json())
    .then(renderPostsToEdit);
};

const updatePost = function (e) {
  e.preventDefault();
  const title = getElement('#title').value;
  const url = getElement('.url input').value;
  const _id = getElement('#post-url').title;
  const content = CKEDITOR.instances['content'].getData();
  const categories = getAll('category');
  const tags = getAll('tag');
  const options = getOptions({ _id, title, content, url, categories, tags });
  fetch('/poet/me/updatePost', options)
    .then((res) => res.json())
    .then(({ status }) => {
      if (status) return (location.href = './dashboard.html');
      renderResponse();
    });
};

const main = function () {
  loadPartialHtml();
  fetchCategoryAndTags();
  listenerOfAddNewCategoryAndTag();
  listenerOnUrl();
  fetchPost();
  getElement('#update').addEventListener('click', updatePost);
};

window.onload = main;

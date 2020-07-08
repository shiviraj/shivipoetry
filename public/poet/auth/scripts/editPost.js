const fillAll = (list, idName) => {
  list.forEach((item) => {
    const $item = getElement(`#${idName}-list input[value="${item.url}"]`);
    if ($item) $item.checked = true;
  });
};

const renderPostsToEdit = (post) => {
  getElement('#title').value = post.title;
  getElement('#post-url').value = post.url;
  getElement('#post-url').title = post._id;
  localStorage.setItem('url', post.url);
  fillAll(post.categories, 'category');
  fillAll(post.tags, 'tag');
  CKEDITOR.instances['content'].setData(post.content);
};

const fetchPost = async function () {
  try {
    const url = window.location.search.split('=')[1];
    const post = await fetchData('/poet/me/post', getOptions({ url }));
    renderPostsToEdit(post);
  } catch (error) {
    console.error(error);
  }
};

const updatePost = async function (e) {
  try {
    e.preventDefault();
    const options = getPostOptions();
    const res = await fetchData('/poet/me/updatePost', getOptions(options));
    if (res.status) return (location.href = './dashboard.html');
    renderResponse();
  } catch (error) {
    console.log(error);
  }
};

const main = async function () {
  await loadPartialHtml();
  await listenerOfAddNewCategoryAndTag();
  await listenerOnUrl();
  await fetchCategoryAndTags();
  await fetchPost();
  getElement('#update').addEventListener('click', updatePost);
};

window.onload = main;

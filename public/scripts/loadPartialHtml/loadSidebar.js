const fetchAndRenderRecentPosts = (getElement) => {
  fetch(`/posts`, { method: 'POST' })
    .then((res) => res.json())
    .then((posts) => {
      const postsInHtml = posts.map(
        (post) => `<a href="/post/${post.url}">${post.title}</a>`
      );
      getElement(`#sidebar-recent-posts`).innerHTML = postsInHtml.join('');
    });
};

const fetchAndRenderCategoriesOrTags = (getElement, path, className) => {
  fetch(`/${className}`)
    .then((res) => res.json())
    .then((list) => {
      const listInHtml = list.map(
        (item) => `<a href="/${path}/${item.url}">${item.name}</a>`
      );
      getElement(`#sidebar-${path}`).innerHTML = listInHtml.join('');
    });
};

const fetchAndRenderSidebar = function (getElement) {
  fetch('./includes/sidebar.html')
    .then((res) => res.text())
    .then((data) => (getElement('.sidebar').innerHTML = data));
};

const loadSidebar = function () {
  const getElement = (selector) => document.querySelector(selector);
  fetchAndRenderSidebar(getElement);
  setTimeout(() => fetchAndRenderRecentPosts(getElement), 100);
  setTimeout(() => {
    fetchAndRenderCategoriesOrTags(getElement, 'tag', 'tags');
  }, 200);
  setTimeout(() => {
    fetchAndRenderCategoriesOrTags(getElement, 'category', 'categories');
  }, 300);
};

const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  return await res.json();
};

const fetchAndRenderRecentPosts = async (getElement) => {
  try {
    const posts = await fetchData('/posts', { method: 'POST' });
    const postsInHtml = posts.map((post) => {
      return `<a href="/post/${post.url}">${post.title}</a>`;
    });
    getElement(`#sidebar-recent-posts`).innerHTML = postsInHtml.join('');
  } catch (error) {
    console.error('something went wrong');
  }
};

const fetchAndRenderCategoriesOrTags = async (getElement, path, className) => {
  try {
    const list = await fetchData(`/${className}`);
    const listInHtml = list.map(
      (item) => `<a href="/${path}/${item.url}">${item.name}</a>`
    );
    getElement(`#sidebar-${path}`).innerHTML = listInHtml.join('');
  } catch (error) {
    console.error('Unable to load ', className);
  }
};

const fetchAndRenderSidebar = async (getElement) => {
  try {
    const res = await fetch('./includes/sidebar.html');
    const data = await res.text();
    getElement('.sidebar').innerHTML = data;
  } catch (error) {
    console.log('unable to fetch and render sidebar');
  }
};

const loadSidebar = async function () {
  const getElement = (selector) => document.querySelector(selector);
  await fetchAndRenderSidebar(getElement);
  await fetchAndRenderRecentPosts(getElement);
  await fetchAndRenderCategoriesOrTags(getElement, 'tag', 'tags');
  await fetchAndRenderCategoriesOrTags(getElement, 'category', 'categories');
};

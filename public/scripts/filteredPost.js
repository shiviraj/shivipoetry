const showAuthor = function ({ username, displayName }) {
  return `<a class="author" href="../author/${username}">${displayName}</a>`;
};

const showComments = function (count, url, commentStatus) {
  let htmlString = '';
  if (commentStatus === 'open' && count) {
    htmlString = `<a class="comments" href="../post/${url}">${count} comments</a>`;
  }
  return htmlString;
};

const showAllPost = function (postsData) {
  const htmlPostData = postsData.map((post) => {
    return `<div class="post">
      <div class="post-card">
        <a class="post-title" href="../post/${post.url}">${post.title}</a>
        <div class="post-date-and-author">
          <div><a class="post-date" href="../post/${post.url}">
          ${moment(post.date).format('MMM DD, YYYY  hh:mm:ss a')}</a></div>
          <div>${showAuthor(post.author)}</div>
          <div>
            ${showComments(post.commentCount, post.url, post.commentStatus)}
          </div>
        </div>
        <div class="post-content">
          <span class="content"> ${post.content.slice(0, 150)} </span>
          <span class="read-more">
            <a href="../post/${post.url}">Read More...</a>
          </span>
        </div>
      </div>
      <div class="post-divider"></div>
    </div>`;
  });
  const $postContent = getElement('#posts');
  $postContent.innerHTML = htmlPostData.join('');
};

const showPosts = function (posts) {
  if (!posts.length) {
    getElement('#posts').innerHTML = `<h1>No Post Found</h1>`;
    return;
  }
  showAllPost(posts);
};

const showAuthorsPosts = function ({ posts, author }) {
  const { username, displayName } = author;
  const postsWithAuthor = posts.map((post) => {
    post.author = { displayName, username };
    return post;
  });
  showPosts(postsWithAuthor);
};

const getPosts = async function (selector, selectElement, pageNo) {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageNo }),
    };
    const url = `/posts/${selector}/${selectElement}`;
    const data = await fetchData(url, options);
    if (selector == 'author') return showAuthorsPosts(data);
    showPosts(data);
    getElement('.page-title').innerHTML = `${selector} : ${selectElement}`;
  } catch (error) {
    console.error(error);
  }
};

const fetchPosts = function (pageNo) {
  const [, , , selector, selectElement] = window.location.href.split('/');
  getPosts(selector, selectElement, pageNo);
};

const main = async function () {
  await loadNavbar();
  await loadSidebar();
  const [, , , selector, selectElement] = window.location.href.split('/');
  await getPosts(selector, selectElement, 1);
  fetchPagination(`/posts/pagination/${selector}/${selectElement}`);
  setTimeout(addListenerOnPages, 0);
};

window.onload = main;

const showAuthor = function ({ username, displayName }) {
  return `<a class="author" href="author/${username}">${displayName}</a>`;
};

const showComments = function (count, url, commentStatus) {
  let htmlString = '';
  if (commentStatus === 'open' && count) {
    htmlString = `<a class="comments" href="post/${url}">${count} comments</a>`;
  }
  return htmlString;
};

const showPosts = function (postsData) {
  const $postContent = getElement('#posts');
  const htmlPostData = postsData.map((post) => {
    return `<div class="post">
      <div class="post-card">
        <a class="post-title" href="post/${post.url}">${post.title}</a>
        <div class="post-date-and-author">
          <div><a class="post-date" href="post/${post.url}">
          ${moment(post.date).format('MMM DD, YYYY  hh:mm:ss a')}</a></div>
          <div>${showAuthor(post.author)}</div>
          <div>
            ${showComments(post.commentCount, post.url, post.commentStatus)}
          </div>
        </div>
        <div class="post-content">
          <span class="content"> ${post.content.slice(0, 150)} </span>
          <span class="read-more">
            <a href="post/${post.url}">Read More...</a>
          </span>
        </div>
      </div>
      <div class="post-divider"></div>
    </div>`;
  });
  $postContent.innerHTML = htmlPostData.join('');
};

const fetchPosts = function (pageNo) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageNo }),
  };
  fetch('/posts', options)
    .then((res) => res.json())
    .then(showPosts);
};

const main = function () {
  fetchPagination('/posts/pagination');
  fetchPosts(1);
  setTimeout(addListenerOnPages, 0);
};

window.onload = main;

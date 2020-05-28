const getOptions = function (body) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const showAuthor = function ({ username, displayName }) {
  return `<a class="author" href="../author/${username}">${displayName}</a>`;
};

const showComments = function (count, commentStatus) {
  let htmlString = '';
  if (commentStatus === 'open' && count) {
    htmlString = `<a class="comments">${count} comments</a>`;
  }
  return htmlString;
};

const showCategory = function (categories) {
  const categoriesHtml = categories.map(({ name, url }) => {
    return `<a href="../category/${url}" class="category">${name}</a>`;
  });
  return categoriesHtml.join('');
};

const showTag = function (tags) {
  const tagsHtml = tags.map(({ name, url }) => {
    return `<a href="../tag/${url}" class="tag-item">${name}</a>`;
  });
  return tagsHtml.join('');
};

const getLink = function (link, className) {
  let linkHtml = '<a></a>';
  if (link) {
    linkHtml = `<a href="${link.url}" class="${className}">${link.title}</a>`;
  }
  return linkHtml;
};

const showNavLinks = function (preLink, nextLink) {
  const preLinkHtml = getLink(preLink, 'nav-pre');
  return preLinkHtml + getLink(nextLink, 'nav-next');
};

const postAndAuthor = function (post) {
  return `<div class="post-date-and-author">
  <div><a class="post-date">
  ${moment(post.date).format('MMM DD, YYYY  hh:mm:ss a')}</a></div>
  <div>${showAuthor(post.author)}</div>
  <div>${showComments(post.commentCount, post.commentStatus)}</div>
</div>`;
};

const showContent = function (post) {
  let htmlData = `<div class="post-title"><h1>No Data Found</h1></div>`;
  if (post.content !== '') {
    htmlData = `<div class="post-title"><h1>${post.title}</h1></div>
    <div class="categories">${showCategory(post.categories)}</div>
    ${postAndAuthor(post)}
    <div class="content">${post.content}</div>
    <div class="tags"><span class="tag-title">Tagged</span>
      <span class="tag-items">${showTag(post.tags)}</span>
    </div>
    <div class="nav-links">${showNavLinks(post.preLink, post.nextLink)}</div>`;
  }
  getElement('#content').innerHTML = htmlData;
};

const loadPostContent = function (postUrl) {
  fetch('/post/content', getOptions({ postUrl }))
    .then((res) => res.json())
    .then(showContent);
};

const showRelatedPost = function (posts) {
  const htmlData = posts.map((post) => {
    return ` <div class="post-card">
    <a class="post-title" href="${post.url}">${post.title}</a>
    ${postAndAuthor(post)}
    <div class="related-post-content">
      <span class="content"> ${post.content.slice(0, 150)} </span>
      <span class="read-more">
        <a href="${post.url}">Read More...</a>
      </span>
    </div>
  </div>
  <div class="post-divider"></div>`;
  });
  getElement('#related-post').innerHTML = htmlData;
};

const loadRelatedPost = function () {
  fetch('/post/relatedPost')
    .then((res) => res.json())
    .then(showRelatedPost);
};

const main = function () {
  const [, , , ...url] = window.location.href.split('/');
  const postUrl = url.join('/');
  loadPostContent(postUrl);
  loadRelatedPost(postUrl);
};

window.onload = main();

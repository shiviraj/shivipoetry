const showMultiples = (list, className) => {
  const htmlString = list.map((item) => {
    return `<a href="../../${className}/${item.url}">${item.name}</a>`;
  });
  return htmlString.join(' ');
};

const showDate = (published, modified) => {
  const title = modified ? 'Modified' : 'Published';
  const date = modified || published;
  return `${title}: <br>${moment(date).format('MMM DD, YYYY  hh:mm:ss a')}`;
};

const publishNow = (status, url) => {
  return status == 'draft' ? `<a class="publish" id="${url}">Publish</a>` : '';
};

const showPosts = (posts) => {
  const htmlPosts = posts.map((post) => {
    return `<div class="post">
    <div class="post-details">
      <div class="title">
        <a href="../../post/${post.url}">${post.title}</a>
        ${post.status == 'published' ? '' : '--Draft'}</div>
      <div class="categories">
        ${showMultiples(post.categories, 'category')}</div>
      <div class="tags">${showMultiples(post.tags, 'tag')}</div>
      <div class="comment">
        ${post.commentStatus == 'open' ? post.commentCount : ''}</div>
      <div class="date">${showDate(post.date, post.modified)}</div>
      <div class="views">0</div>
    </div>
    <div class="actions">
    ${publishNow(post.status, post.url)}
    <a class="edit" href="edit.html?post=${post.url}">Edit</a>
    <a class="delete">Delete</a>
    </div>
    </div>`;
  });
  getElement('.post-body').innerHTML = htmlPosts.join('');
};

const renderPosts = () => {
  fetch('/poet/me/myAllPosts')
    .then((res) => res.json())
    .then(showPosts);
};

const getOptions = (body) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const removePublishButton = function ($publish) {
  return (status) => {
    if (!status) return;
    const $parent = $publish.parentNode.parentNode;
    $publish.remove();
    $parent.querySelector('.title').lastChild.remove();
  };
};

const listenerOnPublish = () => {
  const $publishes = Array.from(getAllElement('.publish'));
  $publishes.forEach(($publish) => {
    $publish.addEventListener('click', (e) => {
      fetch('/poet/me/publishPost', getOptions({ url: e.target.id }))
        .then((res) => res.json())
        .then(removePublishButton($publish));
    });
  });
};

const main = () => {
  loadPartialHtml();
  renderPosts();
  setTimeout(listenerOnPublish, 1000);
};

window.onload = main;

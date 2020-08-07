const updatePost = async function (e) {
  try {
    e.preventDefault();
    const options = getPostOptions();
    const res = await fetchData('/poet/updatePost', getOptions(options));
    if (res.status) return (location.href = '/poet');
    renderResponse();
  } catch (error) {
    renderResponse();
  }
};

const main = async function () {
  await listenerOfAddNewCategoryAndTag();
  await listenerOnUrl();
  update.addEventListener('click', updatePost);
};

window.onload = main;

const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const fetchData = async function (url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error('fetch error');
  }
  return await res.json();
};

const getPostOptions = function () {
  const title = getElement('#title').value;
  const url = getElement('.url input').value;
  const _id = getElement('#post-url').title;
  const content = CKEDITOR.instances['content'].getData();
  const categories = getAll('category');
  const tags = getAll('tag');
  return { _id, title, content, url, categories, tags };
};

const renderCategories = (categories) => {
  const categoryCheckbox = categories.map((category) => {
    return `<label><input type="checkbox" name="category" value="${category.url}">${category.name}</label>`;
  });
  getElement('#category-list').innerHTML = categoryCheckbox.join('');
};

const renderTags = (tags) => {
  const tagCheckbox = tags.map((tag) => {
    return `<label><input type="checkbox" name="tag" value="${tag.url}">${tag.name}</label>`;
  });
  getElement('#tag-list').innerHTML = tagCheckbox.join('');
};

const fetchCategoryAndTags = async function () {
  try {
    const categories = await fetchData('/poet/categories');
    renderCategories(categories);
    const tags = await fetchData('/poet/tags');
    renderTags(tags);
  } catch (error) {
    console.log(error);
  }
};

const addNewCategory = function (category) {
  const htmlCategory = `<label><input type="checkbox" name="${category.url}" value="${category.url}">${category.name}</label>`;
  getElement('#category-list').innerHTML += htmlCategory;
};

const addNewTag = function (tag) {
  const htmlTag = `<label><input type="checkbox" name="${tag.url}" value="${tag.url}">${tag.name}</label>`;
  getElement('#tag-list').innerHTML += htmlTag;
};

const addNew = async (event, name, callback) => {
  event.preventDefault();
  const value = getElement(`#add-new-${name} input`).value;
  if (!value) return;
  try {
    const body = {};
    body[name] = value;
    const url = `/poet/addNew/${name}`;
    const res = await fetchData(url, getOptions(body, 'PUT'));
    callback(res);
  } catch (error) {
    console.error(error);
  }
};

const listenerOfAddNewCategoryAndTag = function () {
  const $addNewCategory = getElement('#add-new-category button');
  $addNewCategory.addEventListener('click', async (event) => {
    await addNew(event, 'category', addNewCategory);
  });

  const $addNewTag = getElement('#add-new-tag button');
  $addNewTag.addEventListener('click', async (event) => {
    await addNew(event, 'tag', addNewTag);
  });
};

const renderURLAvailability = ({ isAvailable }) => {
  const $urlAvailability = getElement('.url-availability');
  $urlAvailability.classList.add('not-available');
  let result = 'URL is not available';
  if (isAvailable) {
    result = 'URL is available';
    $urlAvailability.classList.remove('not-available');
  }
  $urlAvailability.innerText = result;
};

const listenerOnUrl = function () {
  const currentUrl = localStorage.getItem('url') || '';
  const $urlInput = getElement('.url input');
  $urlInput.addEventListener('input', async () => {
    const url = $urlInput.value;
    if (!url) return;
    try {
      const options = getOptions({ url, currentUrl });
      const res = await fetchData('/poet/isURLAvailable', options);
      renderURLAvailability(res);
    } catch (error) {
      console.error(error);
    }
  });
};

const getAll = function (getItem) {
  const values = Array.from(
    getAllElement(`#${getItem}-list input[type="checkbox"]:checked`)
  );
  return values.map((checkbox) => checkbox.value);
};

const renderResponse = function () {
  const $form = getElement('form');
  $form.innerHTML = `<div style="margin:0 auto;color: red">Something went wrong</div>${$form.innerHTML}`;
};

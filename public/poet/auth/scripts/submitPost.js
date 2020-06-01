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

const fetchCategoryAndTags = function () {
  fetch('/poet/me/categories')
    .then((res) => res.json())
    .then((categories) => renderCategories(categories));
  fetch('/poet/me/tags')
    .then((res) => res.json())
    .then((tags) => renderTags(tags));
};

const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const addNewCategory = function (category) {
  const htmlCategory = `<label><input type="checkbox" name="${category.url}" value="${category.url}">${category.name}</label>`;
  getElement('#category-list').innerHTML += htmlCategory;
};

const addNewTag = function (tag) {
  const htmlTag = `<label><input type="checkbox" name="${tag.url}" value="${tag.url}">${tag.name}</label>`;
  getElement('#tag-list').innerHTML += htmlTag;
};

const listenerOfAddNewCategoryAndTag = function () {
  const $addNewCategory = getElement('#add-new-category button');
  $addNewCategory.addEventListener('click', () => {
    const category = getElement('#add-new-category input').value;
    if (!category) return;
    fetch('/poet/me/addNew/category', getOptions({ category }, 'PUT'))
      .then((res) => res.json())
      .then((category) => addNewCategory(category));
  });

  const $addNewTag = getElement('#add-new-tag button');
  $addNewTag.addEventListener('click', () => {
    const tag = getElement('#add-new-tag input').value;
    if (!tag) return;
    fetch('/poet/me/addNew/tag', getOptions({ tag }, 'PUT'))
      .then((res) => res.json())
      .then((tag) => addNewTag(tag));
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
  $urlInput.addEventListener('input', () => {
    const url = $urlInput.value;
    if (!url) return;
    fetch('/poet/me/isURLAvailable', getOptions({ url, currentUrl }))
      .then((res) => res.json())
      .then(renderURLAvailability);
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

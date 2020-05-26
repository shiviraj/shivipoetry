const renderCategories = (categories) => {
  const categoryCheckbox = categories.map((category) => {
    return `<label><input type="checkbox" name="${category.url}" value="${category.url}">${category.name}</label>`;
  });
  getElement('#category-list').innerHTML = categoryCheckbox.join('');
};

const renderTags = (tags) => {
  const tagCheckbox = tags.map((tag) => {
    return `<label><input type="checkbox" name="${tag.url}" value="${tag.url}">${tag.name}</label>`;
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

const getOptions = (body) => {
  return {
    method: 'POST',
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
    fetch('/poet/me/addNew/category', getOptions({ category }))
      .then((res) => res.json())
      .then((category) => addNewCategory(category));
  });

  const $addNewTag = getElement('#add-new-tag button');
  $addNewTag.addEventListener('click', () => {
    const tag = getElement('#add-new-tag input').value;
    if (!tag) return;
    fetch('/poet/me/addNew/tag', getOptions({ tag }))
      .then((res) => res.json())
      .then((tag) => addNewTag(tag));
  });
};

const main = function () {
  loadPartialHtml();
  fetchCategoryAndTags();
  listenerOfAddNewCategoryAndTag();
};

window.onload = main;

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

const main = function () {
  loadPartialHtml();
  fetchCategoryAndTags();
};

window.onload = main;

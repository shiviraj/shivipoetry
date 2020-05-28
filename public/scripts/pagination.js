const SHOWN_PAGES = 10;

const getCurrentRange = function (currentPage, totalPages) {
  let startWith = currentPage - Math.ceil(SHOWN_PAGES / 2);
  let endWith = currentPage + Math.floor(SHOWN_PAGES / 2);
  if (startWith < 0) {
    startWith = 0;
    endWith = SHOWN_PAGES;
  }
  if (endWith > totalPages) {
    startWith = totalPages - SHOWN_PAGES;
    endWith = totalPages;
  }
  return [startWith, endWith];
};

const showCurrentRange = function ($pages, currentPage) {
  $pages.forEach(($page) => $page.classList.add('hidden'));
  const [startWith, endWith] = getCurrentRange(currentPage, $pages.length);
  const $currentRange = $pages.slice(startWith, endWith);
  $currentRange.forEach(($page) => $page.classList.remove('hidden'));
  getElement('#pre').classList.remove('hidden');
  getElement('#next').classList.remove('hidden');
};

const highlightCurrentPage = function (pageNo) {
  const $currentPage = getElement('.current-page');
  if ($currentPage) $currentPage.classList.remove('current-page');
  getElement(`#page_${pageNo}`).classList.add('current-page');
};

const renderPagination = function (currentPage) {
  const $pagination = getElement('.pagination');
  const lastPage = $pagination.childElementCount - 2;
  const $pages = Array.from($pagination.childNodes).slice(1, lastPage + 1);
  showCurrentRange($pages, currentPage);
  highlightCurrentPage(currentPage);
  if (currentPage == 1) getElement('#pre').classList.add('hidden');
  if (currentPage == lastPage) getElement('#next').classList.add('hidden');
};

const showPagination = function ({ pages }) {
  if (pages === 1) return;
  const pagesArray = new Array(pages).fill('');
  const html = pagesArray.map((p, index) => {
    return `<div id="page_${index + 1}">${index + 1}</div>`;
  });
  html.unshift('<div id="pre">Prev</div>');
  const $pagination = getElement('.pagination');
  $pagination.innerHTML = html.join('') + '<div id="next">Next</div>';
  renderPagination(1);
};

const fetchPagination = function (url) {
  fetch(url)
    .then((res) => res.json())
    .then(showPagination);
};

const getPageNo = function (pageId) {
  return +pageId.split('_')[1];
};

const fetchCurrentPosts = function (event, fetchPosts) {
  const currentPageId = getElement('.current-page').attributes.id.value;
  const currentPage = getPageNo(currentPageId);
  const wantedPageId = event.target.id;
  const wantedPage = getPageNo(wantedPageId);
  let pageNo = wantedPage;
  if (wantedPageId === 'next') pageNo = currentPage + 1;
  if (wantedPageId === 'pre') pageNo = currentPage - 1;
  fetchPosts(pageNo);
  renderPagination(pageNo);
};

const addListenerOnPages = function () {
  const $pages = getElement('.pagination');
  $pages.addEventListener('click', () => fetchCurrentPosts(event, fetchPosts));
};

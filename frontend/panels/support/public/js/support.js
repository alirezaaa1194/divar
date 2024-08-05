import { Header } from "../../../../components/Header/header.js";
import { baseUrl, localHost } from "../../../../public/js/utils/shared.js";
window.customElements.define("site-header", Header);

window.addEventListener("load", () => {
  getSupportArticles();
});
const getSupportArticles = async () => {
  const loader_container = document.querySelector(".loader_container");
  let datas = await fetch(`${baseUrl}/v1/support/category-articles`);
  let articlesCategories = await datas.json();

  let supportCategories = articlesCategories.data.categories;
  let supportArticles = supportCategories.flatMap((categories) => categories.articles);

  supportCategoriesGenerator(supportCategories);
  supportArticlesGenerator(supportArticles);

  searchResultGenerator(supportArticles);

  loader_container.classList.add("hidden");
};

const supportCategoriesGenerator = (categories) => {
  const supportCategoriesContainer = document.querySelector(".support-categories-container");

  supportCategoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    supportCategoriesContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="col-12 col-lg-6">
                <div class="p-4 rounded-2 border border-gray d-flex align-items-center">
                    <img src="${baseUrl}/${category.pic.path}" width="64" height="64" style="object-fit: cover" alt="" />
                    <div class="d-flex flex-column mx-4">
                        <h3 class="text-dark my-4">${category.name}</h3>
                        <p>ساخت حساب کاربری، ورود و خروج حساب کاربری، دیوار من، تنظیمات حساب کاربری و...</p>
                    </div>
                    <div style="width: 38px; height: 38px;">
                        <a href="${localHost}frontend/panels/support/articles.html?id=${category._id}" id="${category._id}" class="bg-light" style="display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 100%;">
                            <i class="bi bi-chevron-left"></i>
                        </a>
                    </div>
                </div>
            </div>
      `
    );
  });
};

const supportArticlesGenerator = (datas) => {
  const supportArticlesContainer = document.querySelector(".support-articles-container");

  supportArticlesContainer.innerHTML = "";

  datas.forEach((art) => {
    supportArticlesContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col-12 col-lg-6">
            <div class="px-3 py-4 rounded-2 border border-gray">
                <h3 class="text-dark">${art.title}</h3>
                <p class="my-4" style=" overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;-webkit-line-clamp: 3; white-space: pre-wrap;">${art.body}</p>
                <a href="${localHost}frontend/panels/support/article.html?id=${art._id}" id="${art._id}" class="d-flex align-items-center fw-bold" style="color: #a62626">ادامه مقاله <i class="bi bi-arrow-left mx-3" style="color: #a62626"></i></a>
            </div>
        </div>
    `
    );
  });
};

const searchResultGenerator = (articles) => {
  const removeIcon = document.querySelector("#remove-icon");
  const searchInput = document.querySelector("#search-input");
  const searchResult = document.querySelector("#search-result");

  searchInput.addEventListener("keyup", (e) => {
    if (searchInput.value.trim()) {
      removeIcon.classList.add("active");
      searchResult.classList.add("active");

      searchResult.innerHTML = "";
      searchResult.insertAdjacentHTML("beforeend", `<div class="loader active"></div>`);

      let articlesSearchResult = articles.filter((article) => article.title.includes(searchInput.value.trim()));

      setTimeout(() => {
        searchResult.innerHTML = "";
        searchResult.insertAdjacentHTML(
          "afterbegin",
          `        <div class="mainSearch px-2 py-4 w-100 ${articlesSearchResult.length ? "border-bottom" : ""} border-gray">
      <i class="bi bi-search"></i>
      <a href="./search.html?key=${searchInput.value.trim()}">${searchInput.value.trim()}</a>
    </div>`
        );

        articlesSearchResult.forEach((article) => {
          searchResult.insertAdjacentHTML(
            "beforeend",
            `
            <div class="allSearch px-2 py-4 w-100 border-bottom border-gray">
              <i class="bi bi-card-text"></i>
              <div class="">
                <a href="${localHost}frontend/panels/support/article.html?id=${article._id}">${article.title}</a>
              </div>
            </div>
            `
          );
        });
      }, 1000);

      if (e.keyCode === 13) {
        location.href = `http://127.0.0.1:5501/frontend/panels/support/search.html?key=${searchInput.value.trim()}`;
      }
    } else {
      searchInput.value = "";
      removeIcon.classList.remove("active");
      searchResult.classList.remove("active");
    }
  });
  removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    removeIcon.classList.remove("active");
    searchResult.classList.remove("active");
  });
};

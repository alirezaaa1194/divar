import { Header } from "../../../../components/Header/header.js";
import { baseUrl, getQueryParams, localHost } from "../../../../public/js/utils/shared.js";
window.customElements.define("site-header", Header);

window.addEventListener("load", () => {
  getMainAllCategory();
});

const getMainAllCategory = async () => {
  let categoryId = getQueryParams("id");
  let data = await fetch(`${baseUrl}/v1/support/categories/${categoryId}/articles`);
  let categories = await data.json();

  catgoryInfoGenerator(categories);
  categoryArticlesGenerator(categories.data.articles);

  const loader_container = document.querySelector(".loader_container");
  loader_container.classList.add("hidden");
};

const catgoryInfoGenerator = (category) => {
  const articleCategoryBreadcrumbTitle = document.querySelector(".article-category-breadcrumbTitle");
  const categoryInfoIcon = document.querySelector(".category-info-icon");
  const categoryInfoTitle = document.querySelector(".category-info-title");

  articleCategoryBreadcrumbTitle.innerHTML = category.data.category.name;
  categoryInfoIcon.src = `${baseUrl}/${category.data.category.pic.path}`;
  categoryInfoTitle.innerHTML = category.data.category.name;

  document.title=`${category.data.category.name} - مرکز پشتیبانی دیوار`
};

const categoryArticlesGenerator = (articles) => {
  const articlesContainer = document.querySelector(".articles");
  articlesContainer.innerHTML=''
  articles.forEach((article) => {
    articlesContainer.insertAdjacentHTML(
      "beforeend",
      `        <div class="article px-3 py-4 rounded-2 border border-gray">
    <div>
      <h3>${article.title}</h3>
      <p style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;-webkit-line-clamp: 5; white-space: pre-wrap;">${article.body}</p>
    </div>
    <div class="icon">
      <a href="${localHost}/frontend/panels/support/article.html?id=${article._id}" class="bg-light">
        <i class="bi bi-chevron-left"></i>
      </a>
    </div>
    </div>`
    );
  });
};

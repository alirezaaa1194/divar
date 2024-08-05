import { baseUrl, getQueryParams, localHost } from "../../../../public/js/utils/shared.js";
import { Header } from "../../../../components/Header/header.js";
window.customElements.define("site-header", Header);
window.addEventListener("load", () => {
  getArticleById();
});
const getArticleById = async () => {
  const loader_container = document.querySelector(".loader_container");

  let articleId = getQueryParams("id");
  const data = await fetch(`${baseUrl}/v1/support/articles/${articleId}`);
  const mainArticle = await data.json();
  mainArticleGenerator(mainArticle.data.article);
  getAndShowSameArtilces(mainArticle.data.article);

  loader_container.classList.add("hidden");
};
const mainArticleGenerator = (article) => {
  const mainArticleBreadcrumbTitle = document.querySelector(".mainArticle-breadcrumb-title");
  const articleTitle = document.querySelector("#article-title");
  const articleBody = document.querySelector("#article-body");

  mainArticleBreadcrumbTitle.innerHTML = article.title;
  articleTitle.innerHTML = article.title;
  articleBody.innerHTML = article.body;

  document.title=`${article.title} - مرکز پشتیبانی دیوار`
};
const getAndShowSameArtilces = async (mainArticle) => {
  let mainArticleCatId = mainArticle.categories.toString();
  let data = await fetch(`${baseUrl}/v1/support/categories/${mainArticleCatId}/articles`);
  let article = await data.json();
  let likeArticle = article.data.articles.filter((article) => article._id !== mainArticle._id);

  const sameArticles = document.querySelector("#same-articles");

  likeArticle.forEach((art) => {
    sameArticles.insertAdjacentHTML("beforeend", `<a href="${localHost}frontend/panels/support/article.html?id=${art._id}">${art.title}</a>`);
  });
};

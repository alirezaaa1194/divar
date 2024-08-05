import { Header } from "../../../../components/Header/header.js";
import { baseUrl, getQueryParams, localHost } from "../../../../public/js/utils/shared.js";
window.customElements.define("site-header", Header);

window.addEventListener("load", () => {
  getAndShowSearchResult();
});

const getAndShowSearchResult = async () => {
  const loader_container = document.querySelector(".loader_container");
  let searchQueryElem = document.querySelector(".search-query-elem");
  let searchResults = document.querySelector(".search-results");
  let searchQuery = getQueryParams("key");
  searchQueryElem.innerHTML = `«${searchQuery}»`;

  let data = await fetch(`${baseUrl}/v1/support/articles/search?s=${searchQuery}`);
  let searchResult = await data.json();

  let mainArticlesSearched = searchResult.data.articles;

  searchResults.innerHTML = "";
  if (mainArticlesSearched.length) {
    mainArticlesSearched.forEach((article) => {
      searchResults.insertAdjacentHTML(
        "beforeend",
        `
        <a href="${localHost}frontend/panels/support/article.html?id=${article._id}" class="">
            <p>${article.title}</p>
            <i class="bi bi-chevron-left"></i>
        </a>
    `
      );
    });
  }else{
    // searchResults.insertAdjacentHTML(
    //     "beforeend",
    //     `<p style="color:#a62626; text-align:center; font-size:2rem; font-weight:bold; padding-top:3rem;">نتیجه ای یافت نشد</p>`)

    searchResults.insertAdjacentHTML(
        "beforeend",
        `
        <p class="my-3">نتیجه ای برای جستجوی شما یافت نشد</p>
        <span class="my-3">پیشنهاد میکنیم: </span>
        <span class="my-3">نگارش کلمات خودرا بررسی کنید.</span>
        <span class="my-3">کلمات کلیدی دیگری را انتخاب کنید.</span>
        `)
  }

  loader_container.classList.add("hidden");
};

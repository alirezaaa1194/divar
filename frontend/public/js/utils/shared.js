import { getNotes } from "../../../panels/userPanel/public/js/notes.js";
import { getUrlParam, setUrlParam, showSwal } from "../utils/utils.js";

export const baseUrl = `https://divarapi.liara.run`;
// export const localHost = `http://127.0.0.1:5501/`;
export const localHost = `https://alirezaaa1194.github.io/divar/`;
export const getAllCity = async () => {
  const cities = await fetch(`${baseUrl}/v1/location`);
  const parsedCities = cities.json();
  return parsedCities;
};

export const saveDataInCookie = (key, value) => {
  let nowTime = new Date();

  nowTime.setTime(nowTime.getTime() + 24 * 60 * 60 * 1000 * 15);

  document.cookie = `${key}=${value}; expires=${nowTime}; path=/;`;
};

export const getDataFromCookie = (key) => {
  let mainData = null;
  if (document.cookie.includes(key)) {
    let cookies = document.cookie.split(`; `);
    cookies.forEach((cookie) => {
      if (cookie.split("=")[0] === key) {
        mainData = cookie.split(`${key}=`).join("");
      }
    });
    return mainData;
  }
};

export const removeDataFromCookie = (key) => {
  let nowTime = new Date();

  nowTime.setTime(nowTime.getTime() + 24 * 60 * 60 * 1000 * -15);

  document.cookie = `${key}=''; expires=${nowTime}; path=/;`;
};

let start = null;
let limit = null;
let end = null;
let totalPostsLength = null;

export const getPosts = async () => {
  let categoryId = getQueryParams("categoryId");
  let searchValue = getQueryParams("q");
  let userCities = JSON.parse(localStorage.getItem("cities")) || [];
  let userCitiesId = "";
  userCitiesId = [];

  let exchangePosts = document.getElementById("exchange-posts");
  exchangePosts ? (exchangePosts.checked = getQueryParams("exchange") ? true : false) : "";

  let mainPrice = getUrlParam("maxPrice") - getUrlParam("minPrice");

  userCities.forEach((city) => userCitiesId.push(city.id));
  userCitiesId = userCitiesId.join("|");
  const userCityPosts = await fetch(`${baseUrl}/v1/post/?city=${userCitiesId}${categoryId ? `&categoryId=${categoryId}` : ""}${searchValue ? `&search=${searchValue}` : ""}${exchangePosts ? (exchangePosts.checked ? "&exchange=true" : "") : ""}${mainPrice > 0 ? `&price=${mainPrice}` : ""}`);
  const posts = await userCityPosts.json();
  // console.log(posts);

  start = 0;
  limit = posts.data.pagination.limit;
  end = limit < posts.data.posts.length ? limit : posts.data.posts.length;

  totalPostsLength = posts.data.posts.length;

  // console.log(start, end);
  return posts;
};
export const infiniteScrollHandler = (posts) => {
  // for infinite scroll
  let container = document.getElementById("datas_container");
  let containerHeight = getComputedStyle(container).height;
  containerHeight = +containerHeight.split("px").join("");
  // console.log(containerHeight);

  window.addEventListener("scroll", (e) => {
    // if (window.scrollY >= endOfPage.offsetTop) {
    if (window.scrollY + window.innerHeight - 95 == containerHeight) {
      start += end - start == limit ? limit : end - start;
      end += totalPostsLength - end > limit ? limit : totalPostsLength - end;
      console.log(start, end);
      if (location.href.includes("notes.html")) {
        notesGenerator(posts);
      } else {
        postsGenerator(posts);
      }
    }
  });
};

export const postsGenerator = (datas) => {
  start = start || 0;
  limit = limit || datas.data.pagination.limit > 10 ? datas.data.pagination.limit : datas.data.posts.length;
  end = end || limit;

  totalPostsLength = totalPostsLength || datas.data.posts.length;
  let container = document.getElementById("datas_container");
  let date = null;

  let posts = datas.data.posts;
  if (posts.length) {
    for (let i = start; i < end; i++) {
      date = calcuteRelativeTime(posts[i].createdAt);
      container.insertAdjacentHTML(
        "beforeend",
        `
          <div class="col-4">
              <div class="product-card">
                  <div class="product-card__right">
                      <div class="product-card__right-top">
                          <a class="product-card__link" href="${localHost}frontend/pages/post.html?id=${posts[i]._id}">${posts[i].title}</a>
                      </div>
                      <div class="product-card__right-bottom">
                          <span class="product-card__condition">${posts[i].dynamicFields[0].data}</span>
                          <span class="product-card__price">${posts[i].price ? posts[i].price.toLocaleString() + " تومان" : "توافقی"}</span>
                          <span class="product-card__time">${date}</span>
                      </div>
                  </div>

                  <div class="product-card__left">
                      ${
                        posts[i].pics.length
                          ? `
                        <img class="product-card__img" src="${baseUrl}/${posts[i].pics[0].path}"></img>
                      `
                          : `
                        <img class="product-card__img img-fluid" src="${localHost}frontend/public/images/main/no-profile.png"></img>
                      `
                      }
                  </div>
              </div>
          </div>
`
      );
    }
  } else {
    container.insertAdjacentHTML(
      "beforeend",
      `
        <p style="color:#a62626; text-align:center; font-size:2rem; font-weight:bold; padding-top:3rem;">آگهی یافت نشد</p>
      `
    );
  }
};
export const notesGenerator = (datas) => {
  start = start || 0;
  limit = limit || (datas.data.pagination.limit > 2 && datas.data.pagination.limit < datas.data.posts.length) ? datas.data.pagination.limit : datas.data.posts.length;
  end = end || limit;
  totalPostsLength = totalPostsLength || datas.data.posts.length;
  let container = document.getElementById("datas_container");
  let date = null;

  let posts = datas.data.posts;
  if (posts.length) {
    container.innerHTML = "";
    for (let i = start; i < end; i++) {
      date = calcuteRelativeTime(posts[i].createdAt);

      container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="col-9 p-4 border border-gray rounded-2 d-flex flex-column justify-content-evenly">
        <div class="d-flex align-items-center">

          ${
            posts[i].pics.length
              ? `
            <img class="product-card__img" src="${baseUrl}/${posts[i].pics[0].path}" class="rounded-1" style="width: 80px; height: 80px"></img>
          `
              : `
            <img class="product-card__img img-fluid" src="${localHost}/frontend/images/main/no-profile.png" class="rounded-1" style="width: 80px; height: 80px"></img>
          `
          }
          <div class="d-flex flex-column pe-3">
            <a href="${localHost}/frontend/pages/post.html?id=${posts[i]._id}" class="my-2 text-dark h5">${posts[i].title}</a>
            <span class="my-2">${date} در ${posts[i].neighborhood.name}</span>
            <p class="my-2 h5">${posts[i].note.content}</p>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <i class="bi bi-trash h4 remove-note-btn" style="cursor: pointer;" id="${posts[i].note._id}"></i>
        </div>
      </div>
`
      );
    }
  } else {
    container.insertAdjacentHTML(
      "beforeend",
      `
        <p style="color:#a62626; text-align:center; font-size:2rem; font-weight:bold; padding-top:3rem;">آگهی یافت نشد</p>
      `
    );
  }

  let removeNoteBtns = document.querySelectorAll(".remove-note-btn");
  removeNoteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showSwal("آیا از حذف یادداشت اطمینان دارید؟", "warning", ["خیر", "بله"], (result) => {
        if (result) {
          fetch(`${baseUrl}/v1/note/${btn.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getDataFromCookie("token")}`,
            },
          }).then((res) => {
            if (res.status === 200) {
              start = null;
              limit = null;
              end = null;
              totalPostsLength = null;
              getNotes();
            }
          });
        }
      });
    });
  });
};

export const calcuteRelativeTime = (time) => {
  const currentTime = new Date();
  let createdTime = null;
  let differneTime = null;

  createdTime = new Date(time);
  differneTime = currentTime - createdTime;
  differneTime = Math.floor(differneTime / (60 * 60 * 1000));

  if (differneTime < 1) {
    return `لحظاتی پیش`;
  } else if (differneTime > 1 && differneTime < 24) {
    return `${differneTime} ساعت پیش`;
  } else if (differneTime > 24 && differneTime < 168) {
    return `${Math.floor(differneTime / 24)} روز پیش`;
  } else if (differneTime > 168 && differneTime < 720) {
    return Math.floor(differneTime / 24) % 7 == 0 ? `${Math.floor(differneTime / 24 / 7)} هفته پیش` : `${Math.floor(differneTime / 24)} روز پیش`;
  } else if (differneTime % 24 === 0) {
    return `${Math.floor(differneTime / 24 / 30)} ماه پیش`;
  } else {
    return `${Math.floor(differneTime / 24)} روز پیش`;
  }
};
export let userSavedCities = JSON.parse(localStorage.getItem("cities"));

export const saveCitiesInLocal = (name, id) => {
  let newCity = {
    name,
    id: Number(id),
  };
  userSavedCities = JSON.parse(localStorage.getItem("cities")) || [];
  let isHaveCityInLocal = userSavedCities.some((city) => city.id == newCity.id);
  if (!isHaveCityInLocal) {
    userSavedCities.push(newCity);
  }
  localStorage.setItem("cities", JSON.stringify(userSavedCities));
  userSavedCities = JSON.parse(localStorage.getItem("cities")) || [];
};

export const saveCitiesInTemporaryArray = (name, id) => {
  let newCity = {
    name,
    id: Number(id),
  };

  let isHaveInTemporary = userSavedCities.some((city) => city.id == id);
  if (!isHaveInTemporary) {
    userSavedCities.push(newCity);
  }
};

export const removeCityFromTemporary = (id) => {
  let cityIndexInTemporary = userSavedCities.findIndex((city) => +city.id === +id);
  userSavedCities.splice(cityIndexInTemporary, 1);
};

export const clearTemporaryArrayForCancel = () => {
  userSavedCities = JSON.parse(localStorage.getItem("cities"));
};

export const setDefaultCityInLocal = () => {
  if (userSavedCities) {
    if (!userSavedCities.length) {
      localStorage.setItem("cities", JSON.stringify([{ name: "تهران", id: 301 }]));
    }
  } else {
    localStorage.setItem("cities", JSON.stringify([{ name: "تهران", id: 301 }]));
  }
  userSavedCities = JSON.parse(localStorage.getItem("cities"));
};

const getAndShowSocial = async () => {
  const socialMediaContainer = document.querySelector(".socialMedia-container");
  const socialMedia = await fetch(`${baseUrl}/v1/social`);
  const socialMediaData = await socialMedia.json();
  socialMediaData.data.socials.forEach((social) => {
    socialMediaContainer.insertAdjacentHTML(
      "beforeend",
      `
        <li class="footer__item">
            <a class="footer__link" href="${social.link}">
                <img src="${social.icon.path}" alt="${social.name}" class="bi bi-twiter"/>
            </a>
        </li>
    `
    );
  });
  //   return socialMediaData
};

export const getCategories = async () => {
  let categories = await fetch(`${baseUrl}/v1/category`);
  categories = await categories.json();
  return categories;
};

export const getQueryParams = (key) => {
  let queryValue = new URLSearchParams(location.search).get(key);
  return queryValue;
};
export const setQueryParams = (key, value) => {
  let queryValue = new URLSearchParams(location.search).set(key, value);
};

export const setLocationSearch = (key, value) => {
  let url = new URL(location.href);
  url.searchParams.set(key, value);
  window.history.replaceState(null, null, url);
  location.reload();
};
window.setLocationSearch = setLocationSearch;

export const removeUrlParams = (key) => {
  let url = new URL(location.href);
  url.searchParams.delete(key);
  window.history.replaceState(null, null, url);
  location.reload();
};
window.removeUrlParams = removeUrlParams;

export const showModal = (id, className) => {
  const elem = document.getElementById(`${id}`);
  elem.classList.add(className);
};
export const hideModal = (id, className) => {
  const elem = document.getElementById(`${id}`);
  elem.classList.remove(className);
};

export const removeThisCityFromLocal = (id) => {
  let cityIndexInLocal = userSavedCities.findIndex((city) => {
    return +city.id == +id;
  });
  userSavedCities.splice(cityIndexInLocal, 1);
  localStorage.setItem("cities", JSON.stringify(userSavedCities));
};
window.removeThisCityFromLocal = removeThisCityFromLocal;

export const setPageTitleBySelectedCities = () => {
  if (userSavedCities.length === 1) {
    document.title = `دیوار ${userSavedCities[0].name} - نیازمندی‌ های رایگان، آگهی‌های خرید، فروش نو و دست دوم و کارکرده، استخدام و خدمات`;
  } else {
    document.title = `دیوار ${userSavedCities[0].name} و ${userSavedCities[userSavedCities.length - 1].name} - نیازمندی‌ های رایگان، آگهی‌های خرید، فروش نو و دست دوم و کارکرده، استخدام و خدمات`;
  }
};

export const isLogin = () => {
  return Boolean(getDataFromCookie("token"));
  // let res = await fetch(`${baseUrl}/v1/auth/me`, {
  //   headers: {
  //     Authorization: `Bearer ${getDataFromCookie("token")}`,
  //   },
  // });
  // return res.status === 200 ? true : false;
};

export const paginationGenerator = (totalPages, paginationContainerId) => {
  let paginationContainer = document.querySelector(`.${paginationContainerId}`);
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.insertAdjacentHTML("beforeend", `<li><a href="?page=${i}" class="${getQueryParams("page") == i ? "active" : ""}">${i}</a></li>`);
  }
};

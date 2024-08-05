import { baseUrl, calcuteRelativeTime, getDataFromCookie, getQueryParams, isLogin, localHost, paginationGenerator } from "../../../../public/js/utils/shared.js";
import { showModal } from "../../../../public/js/utils/utils.js";

window.addEventListener("load", () => {
  if (!isLogin()) {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");

    showModal("login-modal", "login-modal--active");
    showModal("login-overlay", "overlay--active");
  } else {
    if (!getQueryParams("page")) {
      location.search = `page=${1}`;
    }
    getUserPosts();
  }
});

const getUserPosts = async () => {
  let data = await fetch(`${baseUrl}/v1/user/posts?page=${getQueryParams("page")}`, {
    headers: {
      Authorization: `Bearer ${getDataFromCookie("token")}`,
    },
  });

  let userPosts = await data.json();

  if (userPosts.data.posts.length) {
    postsGenerator(userPosts);
  } else {
    const datasContainer = document.querySelector("#datas_container");
    datasContainer.innerHTML = "";

    let paginationContainer = document.querySelector(`.pagination-container`);
    paginationContainer.innerHTML = "";

    let empty = document.querySelector(".empty");
    empty.classList.remove("d-none");
    empty.classList.add("d-flex");
  }

  const loader_container = document.querySelector(".loader_container");
  loader_container.classList.add("hidden");
};

const postsGenerator = (data) => {
  let posts = data.data.posts;

  paginationGenerator(data.data.pagination.totalPages, "pagination-container");

  let date = null;

  const datasContainer = document.querySelector("#datas_container");

  datasContainer.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    date = calcuteRelativeTime(posts[i].createdAt);

    datasContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col-12">
      <div class="d-flex align-items-center justify-content-between p-4 border-bottom border-bottom-1 border-bottom-gray">
        <div class="d-flex" style="gap: 15px">
          ${
            posts[i].pics.length
              ? `
            <img style="width: 80px; height: 80px; border-radius: 4px" src="${baseUrl}/${posts[i].pics[0].path}"></img>
          `
              : `
            <img style="width: 80px; height: 80px; border-radius: 4px" src="${localHost}frontend/public/images/main/no-profile.png"></img>
          `
          }
          <div class="d-flex flex-column justify-content-between py-2">
            <a class="product-card__link">${posts[i].title}</a>
            <div class="d-flex flex-column">
              <span class="product-card__price h5">${posts[i].price ? posts[i].price.toLocaleString() + " تومان" : "توافقی"}</span>
              <span class="product-card__price h5">${date} در ${posts[i].neighborhood.name}</span>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-between">
          <p class="product-card__link">وشعیت آکهی: <span class="product-card__link product-card__status ${posts[i].status}">${posts[i].status==='published'?'منتشر شده':posts[i].status==='rejected'?'رد شده':posts[i].status==='pending'?'در صف انتظار':''}</span></p>
          <a  href="${localHost}frontend/panels/userPanel/preview.html?id=${posts[i]._id}" style="text-align:center;padding: 10px 12px; border: 2px solid #a62626; color: #a62626; font-size: 1.5rem; font-weight: bold; border-radius: 4px; margin: 10px 0;" id="${posts[i]._id}" class="manage-post-btn">مدیریت آگهی</a>
        </div>
      </div>
    </div>
     
      `
    );
  }
};

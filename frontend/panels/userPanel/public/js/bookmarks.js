import { baseUrl, calcuteRelativeTime, getDataFromCookie, getQueryParams, infiniteScrollHandler, localHost, paginationGenerator, postsGenerator, setQueryParams } from "../../../../public/js/utils/shared.js";
import { showSwal } from "../../../../public/js/utils/utils.js";

window.addEventListener("load", () => {
  if (!getQueryParams("page")) {
    location.search = `page=${1}`;
  }
  getUserBookmarks();
});

const getUserBookmarks = async () => {
  let userDatas = await fetch(`${baseUrl}/v1/user/bookmarks?page=${getQueryParams("page")}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getDataFromCookie("token")}`,
    },
  });
  let userBookmarks = await userDatas.json();
  
  if (userBookmarks) {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");
  }
  if (userBookmarks.data.posts.length) {
    bookmarksGenerator(userBookmarks);
  } else {
    const datasContainer = document.querySelector("#datas_container");
    datasContainer.innerHTML = "";

    let paginationContainer = document.querySelector(`.pagination-container`);
    paginationContainer.innerHTML = "";

    let emptyBookmarksSection = document.querySelector(".empty");
    emptyBookmarksSection.classList.remove("d-none");
    emptyBookmarksSection.classList.add("d-flex");
  }
};

const bookmarksGenerator = (data) => {
  let bookmarks = data.data.posts;

  paginationGenerator(data.data.pagination.totalPages, "pagination-container");

  let date = null;

  const datasContainer = document.querySelector("#datas_container");

  datasContainer.innerHTML = "";

  for (let i = 0; i < bookmarks.length; i++) {
    date = calcuteRelativeTime(bookmarks[i].createdAt);

    datasContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="col-12 col-xl-6">
    <div class="d-flex flex-column p-4 rounded-1" style="border: 1px solid rgba(0, 0, 0, 0.2)">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex flex-column">
          <a href="${localHost}frontend/pages/post.html?id=${bookmarks[i]._id}" class="product-card__link">${bookmarks[i].title}</a>
          <span class="product-card__price h5 d-block my-4">${bookmarks[i].price ? bookmarks[i].price.toLocaleString() + " تومان" : "توافقی"}</span>
          <span class="product-card__time h5">${date} در ${bookmarks[i].neighborhood.name}</span>
        </div>
        ${
          bookmarks[i].pics.length
            ? `
          <img class="product-card__img" src="${baseUrl}/${bookmarks[i].pics[0].path}"></img>
        `
            : `
          <img class="product-card__img img-fluid" src="${localHost}frontend/public/images/main/no-profile.png"></img>
        `
        }
      </div>
      <div class="d-flex mt-5" style="gap: 10px">
        <button class="w-100 p-2 py-3 share-bookmark-btn" id="${bookmarks[i]._id}" style="border: 2px solid black; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: black"><i class="bi bi-share mx-3" style="color: black"></i> اشتراک گذاری</button>
        <button class="w-100 p-2 py-3 delete-bookmark-btn" id="${bookmarks[i]._id}" style="border: 2px solid black; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: black"><i class="bi bi-trash mx-3" style="color: black"></i> حذف نشان</button>
      </div>
    </div>
  </div>
    `
    );
  }
  let shareBookmarkBtns = document.querySelectorAll(".share-bookmark-btn");
  let deleteBookmarkBtns = document.querySelectorAll(".delete-bookmark-btn");

  shareBookmarkBtns.forEach((shareBtn) => {
    shareBtn.addEventListener("click", async () => {
      await navigator.share({
        title: document.title,
        text: "ارسال آگهی",
        url: window.location.href,
      });
    });
  });
  deleteBookmarkBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async () => {
      showSwal("آیا از حذف نشان اطمینان دارید؟", "warning", ["خیر", "بله"], async (result) => {
        if (result) {
          await fetch(`${baseUrl}/v1/bookmark/${deleteBtn.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getDataFromCookie("token")}`,
            },
          }).then((res) => {
            getUserBookmarks();
          });
        }
      });
    });
  });
};

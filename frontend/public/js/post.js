import { Header } from "../../components/Header/header.js";
import { authorize, submitPhoneNumber } from "./utils/auth.js";
window.customElements.define("site-header", Header);

import { baseUrl, calcuteRelativeTime, getAllCity, getCategories, getDataFromCookie, getPosts, getQueryParams, hideModal, isLogin, localHost, showModal } from "./utils/shared.js";
import { getUrlParam } from "./utils/utils.js";

let isUserLogedIn = await isLogin();
let noteId = null;
let isBookmarked = null;

const getPostById = async () => {
  let postId = getQueryParams("id");
  let getPost = await fetch(`${baseUrl}/v1/post/${postId}`, {
    headers: {
      Authorization: getDataFromCookie("token") ? `Bearer ${getDataFromCookie("token")}` : "",
    },
  });
  let postInfo = await getPost.json();
  postInfo = postInfo.data;
  noteId = postInfo.post.note?._id;
  isBookmarked = postInfo.post.bookmarked;
  return postInfo;
};

const postInfoHandler = (postInfo) => {
  getCategories().then((res) => {
    postInfoGenerator(postInfo);
    const loaderContainer = document.querySelector(".loader_container");
    loaderContainer.classList.add("hidden");
  });
};

// insert post info to DOM
const postInfoGenerator = (postInfo) => {
  // console.log(postInfo.post);
  const mainBreadcrumb = document.querySelector(".main__breadcrumb");
  const productNameElem = document.querySelector(".product__name");
  const productLocationElem = document.querySelector(".product__location");
  const postDynamicFieldsContainer = document.querySelector(".product__info-list");
  const productDescriptionElem = document.querySelector(".product__intro-desc");
  const productBtnShare = document.querySelector(".product__btn-share");
  const productBtnTel = document.querySelector(".product__btn-tel");
  const postFeedbackBtns = document.querySelectorAll(".post-feedback-btn");
  const productPreviewInput = document.querySelector(".product-preview__input");
  const loginModal = document.querySelector(".login-modal");
  const loginOverlay = document.querySelector("#login-overlay");
  const loginModalHeaderBtn = document.querySelectorAll(".login-modal__header-btn");
  const loginStep1ModalBtn = document.querySelector(".login-step1-modal-btn");
  const loginModalForm = document.querySelector(".login-modal__form");
  const phoneNumberInput = document.querySelector(".phone-number-input");
  const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
  const loginChangeNumber = document.querySelector(".login-change-number");
  const codeForm = document.querySelector(".code-form");
  const codeInput = document.querySelector(".code_input");
  const loginBtn = document.querySelector(".login_btn");
  const saveProductBtn = document.querySelector(".product__btn-save");
  const saveProductBtnIcon = document.querySelector(".product__btn-save i");

  // handle page title to post title
  document.title = postInfo.post.title;

  //   handle breadcrumb
  mainBreadcrumb.insertAdjacentHTML(
    "beforeend",
    `
      <li class="main__breadcrumb-item">
        <a class="main__breadcrumb-link" href="${localHost}frontend/pages/posts.html?categoryId=${postInfo.post.breadcrumbs.category._id}">
          ${postInfo.post.breadcrumbs.category.title}
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </a>
      </li>

      <li class="main__breadcrumb-item">
        <a class="main__breadcrumb-link" href="${localHost}frontend/pages/posts.html?categoryId=${postInfo.post.breadcrumbs.subCategory._id}">
          ${postInfo.post.breadcrumbs.subCategory.title}
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </a>
      </li>

      <li class="main__breadcrumb-item">
        <a class="main__breadcrumb-link" href="${localHost}frontend/pages/posts.html?categoryId=${postInfo.post.breadcrumbs.subSubCategory._id}">
          ${postInfo.post.breadcrumbs.subSubCategory.title}
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </a>
      </li>

      <li class="main__breadcrumb-item">
        <a class="main__breadcrumb-link" href="${localHost}frontend/pages/post.html?id=${postInfo.post._id}">
          ${postInfo.post.title}
        </a>
      </li>
  `
  );
  // handle post name title
  productNameElem.innerHTML = postInfo.post.title;

  //   handle post created time and location by text
  let createdPostTime = calcuteRelativeTime(postInfo.post.createdAt);

  productLocationElem.innerHTML = `${createdPostTime} در ${postInfo.post.city.name}${postInfo.post.neighborhood ? "، " + postInfo.post.neighborhood.name : ""}`;

  // handle post dynamicFields
  postInfo.post.dynamicFields.forEach((field) => {
    postDynamicFieldsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <li class="product__info-item">
            <span class="product__info-key">${field.name}</span>
            <span class="product__info-value">${typeof field.data === "boolean" ? (field.data ? "دارد" : "ندارد") : field.data}</span>
        </li>
    `
    );
  });

  // handle post static field(price)
  postDynamicFieldsContainer.insertAdjacentHTML(
    "beforeend",
    `
      <li class="product__info-item">
          <span class="product__info-key">قیمت</span>
          <span class="product__info-value">${postInfo.post.price.toLocaleString()} تومان</span>
      </li>
  `
  );

  // handle post description
  productDescriptionElem.innerHTML = postInfo.post.description;

  //   handle share post
  productBtnShare.addEventListener("click", async () => {
    await navigator.share({
      title: document.title,
      text: "ارسال آگهی",
      url: window.location.href,
    });
  });

  // handle post pics
  let postPics = postInfo.post.pics;
  if (postPics.length) {
    const mainSwiper = document.querySelector("#main-swiper");
    const secondSwiper = document.querySelector("#second-swiper");

    postPics.forEach((pic) => {
      mainSwiper.insertAdjacentHTML(
        "beforeend",
        `
          <div class="swiper-slide">
            <img src="${baseUrl}/${pic.path}" />
          </div>
        `
      );
      if (postPics.length > 1) {
        secondSwiper.insertAdjacentHTML(
          "beforeend",
          `
          <div class="swiper-slide">
            <img src="${baseUrl}/${pic.path}" />
          </div>
        `
        );
      }
    });

    var swiper1 = new Swiper(".mySwiper", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".mySwiper2", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-prev-btn",
        prevEl: ".swiper-next-btn",
      },
      thumbs: {
        swiper: swiper1,
      },
    });
  } else {
    const productPreview = document.querySelector(".product-preview");

    productPreview.children[0].classList.add("d-none");
  }

  // handle user phone info
  productBtnTel.addEventListener("click", () => {
    swal({
      title: `شماره تماس: ${postInfo.post.creator.phone}`,
      button: {
        text: "تماس گرفتن",
      },
    });
  });

  // handle feedback btns
  postFeedbackBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      postFeedbackBtns.forEach((btn) => {
        btn.classList.remove("active");

        if (btn.querySelector("i").className == "bi bi-hand-thumbs-down-fill") {
          btn.querySelector("i").className = "bi bi-hand-thumbs-down";
        } else if (btn.querySelector("i").className == "bi bi-hand-thumbs-up-fill") {
          btn.querySelector("i").className = "bi bi-hand-thumbs-up";
        }
      });

      if (btn.querySelector("i").className == "bi bi-hand-thumbs-down") {
        btn.querySelector("i").className = "bi bi-hand-thumbs-down-fill";
      }
      if (btn.querySelector("i").className == "bi bi-hand-thumbs-up") {
        btn.querySelector("i").className = "bi bi-hand-thumbs-up-fill";
      }
      btn.classList.add("active");
    });
  });

  // handle user note to post
  productPreviewInput.addEventListener("focus", async () => {
    if (!isUserLogedIn) {
      showModal("login-modal", "login-modal--active");
      showModal("login-overlay", "overlay--active");
    }
  });

  productPreviewInput.addEventListener("blur", async () => {
    if (isUserLogedIn) {
      if (productPreviewInput.value.trim()) {
        if (noteId) {
          fetch(`${baseUrl}/v1/note/${noteId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getDataFromCookie("token")}`,
            },
            body: JSON.stringify({
              content: productPreviewInput.value.trim(),
            }),
          });
        } else {
          fetch(`${baseUrl}/v1/note`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getDataFromCookie("token")}`,
            },
            body: JSON.stringify({
              postId: getQueryParams("id"),
              content: productPreviewInput.value.trim(),
            }),
          });
        }
      }
    }
  });

  productPreviewInput.value = postInfo.post.note?.content || "";
  // close login modal
  loginOverlay.addEventListener("click", () => {
    hideModal("login-modal", "login-modal--active");
    hideModal("login_modal_step_2", "login_modal_step_2--active");
    hideModal("login-overlay", "overlay--active");
  });
  loginModalHeaderBtn.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      hideModal("login-modal", "login-modal--active");
      hideModal("login_modal_step_2", "login_modal_step_2--active");
      hideModal("login-overlay", "overlay--active");
    });
  });

  // handle auth
  loginStep1ModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitPhoneNumber();
  });

  phoneNumberInput.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
      submitPhoneNumber();
    }
  });

  loginModalForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  reqNewCodeBtn.addEventListener("click", submitPhoneNumber);

  loginChangeNumber.addEventListener("click", () => {
    showModal("login-modal", "login-modal--active");
    hideModal("login_modal_step_2", "login_modal_step_2--active");
  });

  loginBtn.addEventListener("click", () => {
    if (codeInput.value.trim()) {
      authorize(phoneNumberInput.value.trim(), codeInput.value.trim());
    }
  });
  codeInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      if (codeInput.value.trim()) {
        authorize(phoneNumberInput.value.trim(), codeInput.value.trim());
      }
    }
  });
  codeForm.addEventListener("submit", (e) => e.preventDefault());

  // handle save product
  saveProductBtn.addEventListener("click", async () => {
    if (isBookmarked) {
      await fetch(`${baseUrl}/v1/bookmark/${postInfo.post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getDataFromCookie("token")}`,
        },
      }).then((res) => {
        saveProductBtnIcon.classList.remove("bi-bookmark-fill");
        saveProductBtnIcon.classList.add("bi-bookmark");
        isBookmarked = false;
      });
    } else if (isBookmarked === false) {
      await fetch(`${baseUrl}/v1/bookmark/${postInfo.post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getDataFromCookie("token")}`,
        },
      }).then((res) => {
        saveProductBtnIcon.classList.remove("bi-bookmark");
        saveProductBtnIcon.classList.add("bi-bookmark-fill");
        isBookmarked = true;
      });
    } else {
      showModal("login-modal", "login-modal--active");
      showModal("login-overlay", "overlay--active");
    }
  });
  if (isBookmarked) {
    saveProductBtnIcon.classList.remove("bi-bookmark");
    saveProductBtnIcon.classList.add("bi-bookmark-fill");
  } else {
    saveProductBtnIcon.classList.add("bi-bookmark");
    saveProductBtnIcon.classList.remove("bi-bookmark-fill");
  }

  // post location handler
  if (postInfo.post.map.x) {
    postLocationHandler(postInfo.post.map);
  }

  // post image viewer handler
  new Viewer(document.getElementById("main-swiper"), {
    toolbar: false,
  });
};
const reDirectUserToPostsPage = () => {
  if (!getQueryParams("id")) {
    location.href = "./posts.html";
  }
};

const postLocationHandler = (mapInfo) => {
  var map = L.map("map").setView([mapInfo.x, mapInfo.y], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let myIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [38, 95],
  });
  L.marker([mapInfo.x, mapInfo.y], { icon: myIcon }).addTo(map);
};


const savePostInLastSeen = () => {
  let lastSeenArray = JSON.parse(localStorage.getItem("lastSeen")) || [];

  let isInLastSeen = lastSeenArray.some((id) => id === getUrlParam("id"));

  if (!isInLastSeen) {
    lastSeenArray.push(getUrlParam("id"));
    localStorage.setItem("lastSeen", JSON.stringify(lastSeenArray));
  }
};

window.addEventListener("load", () => {
  reDirectUserToPostsPage();

  savePostInLastSeen();
  
  getPostById().then((res) => {
    postInfoHandler(res);
  });

});
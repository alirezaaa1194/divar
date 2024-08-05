import { baseUrl, calcuteRelativeTime, getAllCity, getDataFromCookie, getQueryParams, isLogin, localHost } from "../../../../public/js/utils/shared.js";
import { getUrlParam, showModal, showSwal } from "../../../../public/js/utils/utils.js";
window.addEventListener("load", () => {
  if (getQueryParams("id")) {
    getPostById();
  } else {
    location.href = `${localHost}frontend/panels/userPanel/posts.html`;
  }

  const navLinks = document.querySelectorAll(".nav-link");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", () => {
      navLinks.forEach((navLink) => {
        navLink.classList.remove("active");
      });
      navLink.classList.add("active");

      tabPanes.forEach((tab) => {
        tab.classList.remove("show");
        tab.classList.remove("active");
      });
      tabPanes.forEach((tab) => {
        if (tab.id === navLink.dataset.bsTarget) {
          tab.classList.add("show");
          tab.classList.add("active");
        }
      });
    });
  });
  // delete post handler
  const deleteBtn = document.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", async () => {
    showSwal("آیا از حذف پست اطمینان دارید؟", "warning", ["خیر", "بله"], async (result) => {
      if (result) {
        let data = await fetch(`${baseUrl}/v1/post/${getUrlParam("id")}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getDataFromCookie("token")}`,
          },
        });
        if (data.status === 200) {
          location.href = `${localHost}frontend/panels/userPanel/posts.html`;
        }
      }
    });
  });
});

let mapView = {
  x: 35.737564062669016,
  y: 51.33531385175183,
};

const getPostById = async () => {
  let postId = getQueryParams("id");
  let getPost = await fetch(`${baseUrl}/v1/post/${postId}`, {
    headers: {
      Authorization: getDataFromCookie("token") ? `Bearer ${getDataFromCookie("token")}` : "",
    },
  });
  let postInfo = await getPost.json();
  postInfo = postInfo.data;
  postInfoGenerator(postInfo);
  editPostDetailGenerator(postInfo);
  return postInfo;
};

// insert post info to DOM
const postInfoGenerator = (postInfo) => {
  const productNameElem = document.querySelector(".product__name");
  const productLocationElem = document.querySelector(".product__location");
  const postDynamicFieldsContainer = document.querySelector(".product__info-list");
  const productDescriptionElem = document.querySelector(".product__intro-desc");
  const productBtnShare = document.querySelector(".product__btn-share");

  // handle page title to post title
  document.title = postInfo.post.title;

  //   handle breadcrumb

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
  productBtnShare.style.display = `${postInfo.post.status === "published" ? "block" : "none"}`;
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

  // post location handler
  if (postInfo.post.map.x) {
    postLocationHandler(postInfo.post.map);
  }
  // post image viewer handler
  new Viewer(document.getElementById("main-swiper"), {
    toolbar: false,
  });
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

// update post
const mainCategoryLabel = document.querySelector(".main-category-label");
const changeCatgory = document.querySelector(".change-catgory");
const showMapInput = document.querySelector("#show-map-input");
const editMap = document.querySelector("#edit-map");
const imagesContainer = document.querySelector("#images-container");
const postTitleInput = document.querySelector("#post-title-input");
const postDescriptionInput = document.querySelector("#post-description-input");
const registerBtn = document.querySelector("#register-btn");
const citySelectBox = document.querySelector("#city-select");
const neighborhoodSelectBox = document.querySelector("#neighborhood-select");
const postPriceInput = document.querySelector("#post-price-input");
const exchangeCheckbox = document.querySelector("#exchange-checkbox");
let isHaveMap = null;
let categoryFields = {};

let pics = [];

showMapInput.addEventListener("change", () => {
  if (showMapInput.checked) {
    isHaveMap = false;
    editMap.style.display = "none";
  } else {
    isHaveMap = true;
    editMap.style.display = "block";
  }
});

const editPostDetailGenerator = (postInfo) => {
  let post = postInfo.post;

  mainCategoryLabel.innerHTML = post.category.title;

  isHaveMap = post.map ? true : false;
  showMapInput.checked = post.map ? false : true;

  if (post.map.x && post.map.y) {
    editPostLocationHandler(post.map);
  } else {
    editPostLocationHandler({
      x: 35.737564062669016,
      y: 51.33531385175183,
    });
    isHaveMap = false;
    showMapInput.checked = true;
    editMap.style.display = "none";
  }

  postTitleInput.value = post.title;
  postDescriptionInput.value = post.description;

  postPriceInput.value = post.price;
  exchangeCheckbox.checked = post.exchange;

  pics = post.pics;
  postCategoryInfosGenerator(post.category, post.dynamicFields);
  registerPost();
  generateCategoryDynamicFields(post.city, post.neighborhood);

  postPicsGenerator();
  postPicsHandler();
};

const editPostLocationHandler = (postMap) => {
  var map = L.map("edit-map").setView([postMap.x || 35.737564062669016, postMap.y || 51.33531385175183], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let myIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [38, 95],
  });
  let mapMarker = L.marker([postMap.x || 35.737564062669016, postMap.y || 51.33531385175183], { icon: myIcon }).addTo(map);

  map.on("move", () => {
    let center = map.getSize().divideBy(2);
    let targetPoint = map.containerPointToLayerPoint(center);
    let targetLating = map.layerPointToLatLng(targetPoint);

    mapMarker.setLatLng(targetLating);

    isHaveMap = true;

    mapView = {
      x: targetLating.lat,
      y: targetLating.lng,
    };
  });
};

const postPicsGenerator = () => {
  imagesContainer.innerHTML = "";
  if (pics.length) {
    pics.forEach((pic) => {
      // let src = URL.createObjectURL(pic);
      let src = pic.path || URL.createObjectURL(pic);
      imagesContainer.insertAdjacentHTML(
        "beforeend",
        `
      <div class="image-box">
          <i class="bi bi-trash" onclick="deletePostImage('${pic.filename || pic.name}')"></i>
        <img src="${pic.path ? `${baseUrl}/${src}` : src}" />
      </div>
    `
      );
      new Viewer(document.getElementById("images-container"), {
        toolbar: false,
      });
    });
  }
};

const postPicsHandler = () => {
  const uploader = document.querySelector("#uploader");
  uploader.addEventListener("change", () => {
    if (uploader.files.length === 1) {
      let isHaveImg = pics.some((pic) => pic.name === uploader.files[0].name);
      if (!isHaveImg) {
        if (uploader.files[0].type === "image/jpeg" || uploader.files[0].type === "image/jpeg" || uploader.files[0].type === "image/png") {
          if (pics.length < 10) {
            pics.push(uploader.files[0]);
          } else {
            showSwal("تعداد تصاویر باید کمتر از 10 باشد", "error", "اوکی", () => null);
          }
        } else {
          showSwal("لطفا تصویر را با فرمت درست انتخاب کنید", "error", "اوکی", () => null);
        }
      }
    } else if (uploader.files.length > 1) {
      for (let i in uploader.files) {
        if (!isNaN(i)) {
          let isHaveImg = pics.some((pic) => pic.name === uploader.files[i].name);
          if (!isHaveImg) {
            if (uploader.files[0].type === "image/jpeg" || uploader.files[0].type === "image/jpeg" || uploader.files[0].type === "image/png") {
              if (pics.length < 10) {
                pics.push(uploader.files[i]);
              } else {
                showSwal("تعداد تصاویر باید کمتر از 10 باشد", "error", "اوکی", () => null);
              }
            } else {
              showSwal("لطفا تصویر را با فرمت درست انتخاب کنید", "error", "اوکی", () => null);
            }
          }
        }
      }
    }
    postPicsGenerator();
  });
};

const deletePostImage = (picName) => {
  pics = pics.filter((pic) => (pic.name ? pic.name !== picName : pic.filename !== picName));
  postPicsGenerator();
};

window.deletePostImage = deletePostImage;

const postCategoryInfosGenerator = (mainCategory, dynamicFields) => {
  const dynamicFieldsContainer = document.querySelector("#dynamic-fields");
  let categoryDynamicFields = mainCategory.productFields;

  categoryDynamicFields.forEach((field, i) => {
    dynamicFieldsContainer.insertAdjacentHTML(
      "afterbegin",

      field.type === "selectbox"
        ? `
        <div class="group">
            <p class="field-title">${field.name}</p> 
            <select class="select-fields" id="${field.slug}" required="required">
            <option value="${field.name === dynamicFields[i].name ? dynamicFields[i].data : ""}">${field.name === dynamicFields[i].name ? dynamicFields[i].data : ""}</option>
            ${field.options.map((option) => (option !== dynamicFields[i].data ? `<option value="${option}">${option}</option>` : ""))}
            </select> 
        </div>
        `
        : `
        <div class="group checkbox-group">
            <input class="checkbox checkBox-fields" id="${field.slug}" type="checkbox">
            <p>${field.name}</p>
        </div>

        `
    );
  });

  const selectFileds = document.querySelectorAll(".select-fields");
  const checkBoxFields = document.querySelectorAll(".checkBox-fields");

  selectFileds.forEach((select) => {
    categoryFields[select.id] = select.value;
    select.addEventListener("change", () => {
      categoryFields[select.id] = select.value;
    });
  });

  checkBoxFields.forEach((checkBox) => {
    categoryFields[checkBox.id] = checkBox.checked;
    checkBox.addEventListener("change", () => {
      categoryFields[checkBox.id] = checkBox.checked;
    });
  });
};

const generateCategoryDynamicFields = (postCity, neighborhood) => {
  getAllCity().then((res) => {
    let data = res.data;

    const cityChoices = new Choices(citySelectBox);
    const neighborhoodChoices = new Choices(neighborhoodSelectBox);

    const tehranNeighborhood = data.neighborhoods.filter(
      (neighborhood) => neighborhood.city_id === postCity.id // 301 is tehran code
    );

    const neighborhoodChoicesConfigs = [
      {
        value: neighborhood.id,
        label: neighborhood.name,
        disabled: true,
        selected: true,
      },
      ...tehranNeighborhood.map((neighborhood) => ({
        value: neighborhood.id,
        label: neighborhood.name,
      })),
    ];

    neighborhoodChoices.setChoices(neighborhoodChoicesConfigs, "value", "label", false);

    cityChoices.setChoices(
      data.cities.map((city) => {
        return {
          value: city.id,
          label: city.name,
          customProperties: { id: city.id },
          selected: city.name === postCity.name ? true : false,
        };
      }),
      "value",
      "label",
      false
    );

    citySelectBox.addEventListener("addItem", (event) => {
      neighborhoodChoices.clearStore();
      const neighborhoods = data.neighborhoods.filter((neighborhood) => neighborhood.city_id === event.detail.customProperties.id);

      if (neighborhoods.length) {
        const neighborhoodChoicesConfigs = [
          {
            value: "default",
            label: "انتخاب محله",
            disabled: true,
            selected: true,
          },
          ...neighborhoods.map((neighborhood) => ({
            value: neighborhood.id,
            label: neighborhood.name,
          })),
        ];

        neighborhoodChoices.setChoices(neighborhoodChoicesConfigs, "value", "label", false);
      } else {
        neighborhoodChoices.setChoices(
          [
            {
              value: 0,
              label: "محله‌ای یافت نشد",
              disabled: true,
              selected: true,
            },
          ],
          "value",
          "label",
          false
        );
      }
    });
  });
  const loader_container = document.querySelector(".loader_container");
  loader_container.classList.add("hidden");
};

const registerPost = () => {
  registerBtn.addEventListener("click", () => {
    let isAllAnswered = [];
    let filedArray = Object.entries(categoryFields);
    filedArray.forEach((field) => {
      if (typeof field[1] == "string") {
        isAllAnswered.push(field[1]);
      }
    });
    isAllAnswered = isAllAnswered.every((answred) => answred);

    let newPostInfo = new FormData();

    if (citySelectBox.value && uploader && postPriceInput.value && postTitleInput.value.trim() && postDescriptionInput.value.trim() && isAllAnswered) {
      newPostInfo.append("city", citySelectBox.value);
      newPostInfo.append("neighborhood", neighborhoodSelectBox.value || citySelectBox.value);
      newPostInfo.append("title", postTitleInput.value.trim());
      newPostInfo.append("description", postDescriptionInput.value.trim());
      newPostInfo.append("price", postPriceInput.value);
      newPostInfo.append("exchange", exchangeCheckbox.checked);
      newPostInfo.append("map", isHaveMap ? JSON.stringify(mapView) : JSON.stringify({}));
      newPostInfo.append("categoryFields", JSON.stringify(categoryFields));
      pics.map((pic) => {
        newPostInfo.append("pics", pic);
      });

      let postId = getUrlParam("id");

      fetch(`${baseUrl}/v1/post/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getDataFromCookie("token")}`,
        },
        body: newPostInfo,
      }).then((res) => {
        if (res.status === 200) {
          showSwal("آکهی با موفقیت ویرایش و در صف انتشار قرار گرفت", "success", "اوکی", () => {
            location.reload();
          });
        }
      });
    } else {
      showSwal("لطفا تمامی فیلد هارا پرکنید", "error", "اوکی", () => null);
    }
  });
};

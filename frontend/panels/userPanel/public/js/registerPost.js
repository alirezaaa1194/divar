import { baseUrl, getAllCity, getCategories, getDataFromCookie, isLogin, localHost } from "../../../../public/js/utils/shared.js";
import { getUrlParam, showModal, showSwal } from "../../../../public/js/utils/utils.js";
window.addEventListener("load", () => {
  if (!isLogin()) {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");

    showModal("login-modal", "login-modal--active");
    showModal("login-overlay", "overlay--active");
  } else {
    if (!getUrlParam("categoryId")) {
      location.href = `${localHost}frontend/panels/userPanel/newPost.html`;
    } else {
      createPostHandler();
    }
  }
});

const changeCatgory = document.querySelector(".change-catgory");
const showMapCheckbox = document.querySelector("#showMap-checkbox");
const postPriceInput = document.querySelector("#post-price-input");
const exchangeCheckbox = document.querySelector("#exchange-checkbox");
const postTitleInput = document.querySelector("#post-title-input");
const postDescriptionTextarea = document.querySelector("#post-description-textarea");
const registerBtn = document.querySelector("#register-btn");
const imagesContainer = document.getElementById("images-container");

const citySelectBox = document.querySelector("#city-select");
const neighborhoodSelectBox = document.querySelector("#neighborhood-select");

const mapContainer = document.querySelector("#map");

let categoryFields = {};
let pics = [];
let isHaveMap = true;

changeCatgory.addEventListener("click", () => {
  location.href = `${localHost}frontend/panels/userPanel/newPost.html`;
});

showMapCheckbox.addEventListener("change", () => {
  if (showMapCheckbox.checked) {
    isHaveMap = false;
    mapContainer.style.display = "none";
  } else {
    isHaveMap = true;
    mapContainer.style.display = "block";
  }
});

const createPostHandler = async () => {
  let catgoryId = getUrlParam("categoryId");

  let categories = await getCategories();
  categories = categories.data.categories;
  let allCategories = [];
  categories.forEach((category) => {
    allCategories.push(category);
    category.subCategories.forEach((subCategory) => {
      allCategories.push(subCategory);
      subCategory.subCategories.forEach((subSubCategory) => {
        allCategories.push(subSubCategory);
      });
    });
  });
  let mainCategory = allCategories.find((category) => category._id == catgoryId);

  postCategoryInfosGenerator(mainCategory);
  generateCategoryDynamicFields();
  postPicsHandler();
  postGetLocationHandler();
  registerPost();
};

const postCategoryInfosGenerator = (mainCategory) => {
  const mainCategoryLabel = document.querySelector(".main-category-label");
  mainCategoryLabel.innerHTML = mainCategory.title;

  const dynamicFieldsContainer = document.querySelector("#dynamic-fields");
  let categoryDynamicFields = mainCategory.productFields;

  categoryDynamicFields.forEach((field) => {
    dynamicFieldsContainer.insertAdjacentHTML(
      "afterbegin",

      field.type === "selectbox"
        ? `
        <div class="group">
            <p class="field-title">${field.name}</p> 
            <select class="select-fields" id="${field.slug}" required="required">
            <option value="">انتخاب</option>
            ${field.options.map((option) => `<option value="${option}">${option}</option>`)}
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

const generateCategoryDynamicFields = () => {
  getAllCity().then((res) => {
    let data = res.data;

    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");

    const cityChoices = new Choices(citySelectBox);
    const neighborhoodChoices = new Choices(neighborhoodSelectBox);

    const tehranNeighborhood = data.neighborhoods.filter(
      (neighborhood) => neighborhood.city_id === 301 // 301 is tehran code
    );

    const neighborhoodChoicesConfigs = [
      {
        value: "default",
        label: "انتخاب محله",
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
          selected: city.name === "تهران" ? true : false,
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

const postPicsGenerator = () => {
  imagesContainer.innerHTML = "";

  pics.forEach((pic) => {
    let src = URL.createObjectURL(pic);

    imagesContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="image-box">
          <i class="bi bi-trash" onclick="deletePostImage('${pic.name}')"></i>
        <img src="${src}" />
      </div>
    `
    );
    new Viewer(document.getElementById("images-container"), {
      toolbar: false,
    });
  });
};

const deletePostImage = (picName) => {
  pics = pics.filter((pic) => pic.name !== picName);
  postPicsGenerator();
};
window.deletePostImage = deletePostImage;

let mapView = {
  x: 0,
  y: 0,
};
// let mapView = {
//   x: 35.737564062669016,
//   y: 51.33531385175183,
// };
const postGetLocationHandler = () => {
  var map = L.map("map").setView([35.737564062669016, 51.33531385175183], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let myIcon = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [38, 95],
  });
  let mapMarker = L.marker([35.737564062669016, 51.33531385175183], { icon: myIcon }).addTo(map);

  map.on("move", () => {
    let center = map.getSize().divideBy(2);
    let targetPoint = map.containerPointToLayerPoint(center);
    let targetLating = map.layerPointToLatLng(targetPoint);

    isHaveMap=true

    mapMarker.setLatLng(targetLating);

    mapView = {
      x: targetLating.lat,
      y: targetLating.lng,
    };
  });
};

const registerPost = () => {
  registerBtn.addEventListener("click", () => {
    console.log(categoryFields);
    let isAllAnswered = [];
    let filedArray = Object.entries(categoryFields);
    filedArray.forEach((field) => {
      if (typeof field[1] == "string") {
        isAllAnswered.push(field[1]);
      }
    });
    isAllAnswered = isAllAnswered.every((answred) => answred);

    let newPostInfo = new FormData();

    if (citySelectBox.value && neighborhoodSelectBox.value && uploader && postPriceInput.value && postTitleInput.value.trim() && postDescriptionTextarea.value.trim() && isAllAnswered) {
      newPostInfo.append("city", citySelectBox.value);
      newPostInfo.append("neighborhood", neighborhoodSelectBox.value);
      newPostInfo.append("title", postTitleInput.value.trim());
      newPostInfo.append("description", postDescriptionTextarea.value.trim());
      newPostInfo.append("price", postPriceInput.value);
      newPostInfo.append("exchange", exchangeCheckbox.checked);
      newPostInfo.append("map", isHaveMap ? JSON.stringify(mapView) : JSON.stringify({x:0, y:0}));
      newPostInfo.append("categoryFields", JSON.stringify(categoryFields));
      pics.map((pic) => {
        newPostInfo.append("pics", pic);
      });

      let categoryId = getUrlParam("categoryId");

      fetch(`${baseUrl}/v1/post/${categoryId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getDataFromCookie("token")}`,
        },
        body: newPostInfo,
      }).then((res) => {
        if (res.status === 201) {
          showSwal("آکهی با موفقیت ثبت شد و در صف انتشار قرار گرفت", "success", "اوکی", () => {
            location.href = `${localHost}frontend/pages/posts.html`;
          });
        }
      });
    } else {
      showSwal("لطفا تمامی فیلد هارا پرکنید", "error", "اوکی", () => null);
    }
  });
};

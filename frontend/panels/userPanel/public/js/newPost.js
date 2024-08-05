import { getCategories, localHost } from "../../../../public/js/utils/shared.js";
import { isLogin } from "../../../../public/js/utils/shared.js";
import { showModal } from "../../../../public/js/utils/shared.js";
window.addEventListener("load", () => {
  if (!isLogin()) {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");

    showModal("login-modal", "login-modal--active");
    showModal("login-overlay", "overlay--active");
  } else {
    searchBetweenCategories();
  }
});

let mainCategoies = [];
let subCategoies = [];
let subSubCategoies = [];

const searchBetweenCategories = async () => {
  let categories = await getCategories();
  categories = categories.data.categories;

  let allCategories = [];
  categories.forEach((category) => {
    mainCategoies.push(category);
    allCategories.push({
      description: category.description,
      slug: category.slug,
      title: category.title,
      _id: category._id,
    });
    category.subCategories.forEach((subCategory) => {
      subCategoies.push(subCategory);
      allCategories.push({
        description: subCategory.description,
        slug: subCategory.slug,
        title: subCategory.title,
        _id: subCategory._id,
      });
      subCategory.subCategories.forEach((subSubCategory) => {
        subSubCategoies.push(subSubCategory);
        allCategories.push({
          description: subSubCategory.description,
          slug: subSubCategory.slug,
          title: subSubCategory.title,
          _id: subSubCategory._id,
        });
      });
    });
  });

  const loader_container = document.querySelector(".loader_container");
  loader_container.classList.add("hidden");

  const searchInput = document.querySelector("#search-input");
  const removeIcon = document.querySelector("#remove-icon");
  const resultContainer = document.querySelector("#result-container");
  const showCategoies = document.querySelector("#show-categoies");
  const guideBox = document.querySelector(".guide");
  const categoriesContainer = document.querySelector("#categories");
  const descriptionCheckbox = document.querySelector("#description-checkbox");

  categoiesGenerator(categories);

  searchInput.addEventListener("keyup", (e) => {
    if (searchInput.value.trim()) {
      resultContainer.classList.add("active");
      removeIcon.classList.add("active");
      showCategoies.classList.remove("active");
      guideBox.classList.remove("active");
      categoriesContainer.classList.remove("active");

      let filteredCategories = subSubCategoies.filter((category) => category.title.includes(searchInput.value.trim()) || category.description.includes(searchInput.value.trim()));
      resultContainer.innerHTML = "";
      if (filteredCategories.length) {
        filteredCategories.forEach((category) => {
          resultContainer.insertAdjacentHTML(
            "beforeend",
            `
          <a href="${localHost}frontend/panels/userPanel/registerPost.html?categoryId=${category._id}">${category.title}</a>
        `
          );
        });
      } else {
        resultContainer.insertAdjacentHTML("beforeend", `<p>موردی یافت نشد</p>`);
      }
    } else {
      resultContainer.classList.remove("active");
      removeIcon.classList.remove("active");
      showCategoies.classList.add("active");
    }
  });
  removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    resultContainer.classList.remove("active");
    removeIcon.classList.remove("active");
    showCategoies.classList.add("active");
  });
  showCategoies.addEventListener("click", () => {
    showCategoies.classList.remove("active");
    guideBox.classList.add("active");
    categoriesContainer.classList.add("active");
  });
  descriptionCheckbox.addEventListener("change", () => {
    let categoryDescription = document.querySelectorAll(".category-description");

    if (descriptionCheckbox.checked) {
      categoryDescription.forEach((p) => {
        p.style.height = p.scrollHeight + "px";
        p.style.marginTop = "12px";
      });
    } else {
      categoryDescription.forEach((p) => {
        p.style.height = "0px";
        p.style.marginTop = "0px";
      });
    }
  });
};

const categoiesGenerator = (categories) => {
  const categoriesMainContainer = document.querySelector(".categories-container");
  categoriesMainContainer.innerHTML = "";
  categories.forEach((category) => {
    categoriesMainContainer.insertAdjacentHTML(
      "beforeend",
      `
              <li class="categories-list-item" id="${category._id}">
                <div>
                  <span>${category.title}</span>
                  <i class="bi bi-chevron-left"></i>
                </div>
                <p class="category-description">${category.description}</p>
              </li>
  `
    );
  });

  const categoriesListItems = document.querySelectorAll(".categories-list-item");
  categoriesListItems.forEach((item) => {
    item.addEventListener("click", () => {
      let mainCategory = categories.find((category) => category._id === item.id);
      subCategoiesGenerator(categories, mainCategory.subCategories);
    });
  });
};

const subCategoiesGenerator = (allCategories, subCategoies) => {
  const guideBox = document.querySelector(".guide");
  guideBox.classList.remove("active");
  const categoriesMainContainer = document.querySelector(".categories-container");
  categoriesMainContainer.innerHTML = "";

  categoriesMainContainer.insertAdjacentHTML(
    "afterbegin",
    `
  <li class="categories-list-item" id="go-back-to-allCatgories">
                <div>
                  <span style="font-weight-bold; color:#000;">بازگشت به همه ی دسته بندی ها</span>
                  <i class="bi bi-chevron-right"></i>
                </div>
              </li>
  `
  );

  subCategoies.forEach((subCategory) => {
    categoriesMainContainer.insertAdjacentHTML(
      "beforeend",
      `
              <li class="subCategories-list-item" id="${subCategory._id}">
                <div>
                  <span>${subCategory.title}</span>
                  <i class="bi bi-chevron-left"></i>
                </div>
              </li>
  `
    );
  });

  let goBackToAllCatgories = document.querySelector("#go-back-to-allCatgories");
  goBackToAllCatgories.addEventListener("click", () => {
    const guideBox = document.querySelector(".guide");
    guideBox.classList.add("active");

    const descriptionCheckbox = document.querySelector("#description-checkbox");
    descriptionCheckbox.checked = false;

    categoiesGenerator(allCategories);
  });

  let subCategoriesListItem = document.querySelectorAll(".subCategories-list-item");
  subCategoriesListItem.forEach((subItem) => {
    subItem.addEventListener("click", () => {
      let mainSubCategory = subCategoies.find((subCat) => subCat._id === subItem.id);
      subSubCategoiesGenerator(allCategories, mainSubCategory);
    });
  });
};

const subSubCategoiesGenerator = (allCategories, mainSubCategory) => {
  const guideBox = document.querySelector(".guide");
  guideBox.classList.remove("active");

  let mainCategory = allCategories.find((category) => category._id === mainSubCategory.parent);

  const categoriesMainContainer = document.querySelector(".categories-container");

  categoriesMainContainer.innerHTML = "";

  categoriesMainContainer.insertAdjacentHTML(
    "afterbegin",
    `
  <li class="categories-list-item" id="go-back-to-subCategories">
                <div>
                  <span style="font-weight-bold; color:#000;">بازگشت به همه ${mainCategory.title}</span>
                  <i class="bi bi-chevron-right"></i>
                </div>
              </li>
  `
  );

  const goBackToSubCategories = document.querySelector("#go-back-to-subCategories");

  goBackToSubCategories.addEventListener("click", () => {
    subCategoiesGenerator(allCategories, mainCategory.subCategories);
  });

  mainSubCategory.subCategories.forEach((subSubCategory) => {
    categoriesMainContainer.insertAdjacentHTML(
      "beforeend",
      `
              <li class="subCategories-list-item" id="${subSubCategory._id}">
                <div>
                  <a href="${localHost}frontend/panels/userPanel/registerPost.html?categoryId=${subSubCategory._id}">${subSubCategory.title}</a>
                </div>
              </li>
  `
    );
  });
};

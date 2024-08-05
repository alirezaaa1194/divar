import { Header } from "../../components/Header/header.js";
window.customElements.define("site-header", Header);

import { getCategories, getPosts, postsGenerator, getQueryParams, setLocationSearch, removeUrlParams, hideModal, setDefaultCityInLocal, getAllCity, setPageTitleBySelectedCities, infiniteScrollHandler } from "./utils/shared.js";

const categoriesContainer = document.querySelector(".sidebar__category-list");

const haveImagePosts = document.getElementById("have-image-posts");
const exchangePosts = document.getElementById("exchange-posts");

const minPriceInput = document.getElementById("min-price-input");
const maxPriceInput = document.getElementById("max-price-input");

let posts = null;
let backupPosts = null;
let filteredPosts = null;

let dynamicFilters = {};

window.addEventListener("load", () => {
  getPosts().then((res) => {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");

    posts = res.data.posts;
    backupPosts = res.data.posts;
    filteredPosts = backupPosts;

    postsGenerator(res);
    infiniteScrollHandler(res);
    
    haveImagePosts.checked = getQueryParams("has-photo") ? true : false;
    exchangePosts.checked = getQueryParams("exchange") ? true : false;
    applyFiltersForLoad();
  });

  getCategories().then((res) => {
    categoriesAndSubCategoriesHandler(categoriesContainer, res);
  });

  setDefaultCityInLocal();

  setPageTitleBySelectedCities();
});
const categoryId = getQueryParams("categoryId");

const categoriesAndSubCategoriesHandler = (container, categories) => {
  container.innerHTML = "";

  // when have categoryId query params
  if (categoryId) {
    // find main category whole user selected
    let mainCategory = categories.data.categories.find((category) => category._id === categoryId);

    if (!mainCategory) {
      let subCategory = findSubCategory(categories.data.categories, categoryId);
      let mainCategory = findMainCategory(categories.data.categories, categoryId);

      if (subCategory) {
        container.insertAdjacentHTML(
          "beforeend",
          `
          <button class="see-all-categories_btn d-flex" onclick="removeUrlParams('categoryId')">همه آگهی ها <i class="bi bi-arrow-left"></i></button>
          <li class="sidebar__category-item" id="category-${mainCategory._id}">
            <a class="sidebar__category-link  ${subCategory._id === categoryId ? "active" : ""}" onclick="setLocationSearch('categoryId', '${mainCategory._id}')" title="${mainCategory.description}">
              <i class="sidebar__category-icon bi bi-house"></i>
              ${mainCategory.title}
            </a>
      
            <ul class="sub-category-container">
                <li class="sidebar__category-item" id="category-${subCategory._id}">
                  <a class="sidebar__category-link  ${subCategory._id === categoryId ? "active" : ""}" onclick="setLocationSearch('categoryId', '${subCategory._id}')" title="${subCategory.description}">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  ${subCategory.title}
                  </a>
                  <ul class="sub-sub-category-container">
                    ${subCategory.subCategories.map(createSubCategoryTempalte).join("")}
                  </ul>
              </li>
            <ul>
          <li>
      `
        );
        filterGenerator(subCategory.filters);
      } else {
        // code for sub sub3
        let findSubCategoryL3 = findSubSubCategory(categories.data.categories, categoryId);
        let subCategory = findSubCategoryL3.subCategories.find((subCat) => {
          return subCat.subCategories.find((subSubCat) => subSubCat._id === categoryId);
        });

        let searchInSubSubCategory = subCategory.subCategories.find((subSubCat) => subSubCat._id === categoryId);
        filterGenerator(searchInSubSubCategory.filters);

        container.insertAdjacentHTML(
          "beforeend",
          `
          <button class="see-all-categories_btn d-flex" onclick="removeUrlParams('categoryId')">همه آگهی ها <i class="bi bi-arrow-left"></i></button>
          <li class="sidebar__category-item" id="category-${findSubCategoryL3._id}">
            <a class="sidebar__category-link  ${subCategory ? "active" : ""}" onclick="setLocationSearch('categoryId', '${findSubCategoryL3._id}')" title="${findSubCategoryL3.description}">
              <i class="sidebar__category-icon bi bi-house"></i>
              ${findSubCategoryL3.title}
            </a>
      
            <ul class="sub-category-container">
                <li class="sidebar__category-item" id="category-${subCategory._id}">
                  <a class="sidebar__category-link  ${subCategory ? "active" : ""}" onclick="setLocationSearch('categoryId', '${subCategory._id}')" title="${subCategory.description}">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  ${subCategory.title}
                  </a>
                  <ul class="sub-sub-category-container">
                    ${subCategory.subCategories.map(createSubCategoryTempalte).join("")}
                  </ul>
              </li>
            <ul>
          <li>
      `
        );
      }
    } else {
      container.insertAdjacentHTML(
        "beforeend",
        `
      <button class="see-all-categories_btn d-flex" onclick="removeUrlParams('categoryId')">همه آگهی ها <i class="bi bi-arrow-left"></i></button>
      <li class="sidebar__category-item" id="category-${mainCategory._id}">
        <a class="sidebar__category-link ${mainCategory._id === categoryId ? "active" : ""}" onclick="setLocationSearch('categoryId', '${mainCategory._id}')" title="${mainCategory.description}">
        <i class="sidebar__category-icon bi bi-house"></i>
        ${mainCategory.title}
        </a>

        <ul class="sub-category-container">
          ${mainCategory.subCategories.map(createSubCategoryTempalte).join("")}
        </ul>
      </li>
    `
      );
    }
  }
  // when dontHave categoryId query params
  else {
    categories.data.categories.forEach((category) => {
      container.insertAdjacentHTML(
        "beforeend",
        `
        <li class="sidebar__category-item" id="category-${category._id}">
          <span class="sidebar__category-link" onclick="setLocationSearch('categoryId', '${category._id}')" title="${category.description}">
          <i class="sidebar__category-icon bi bi-house"></i>
          ${category.title}
          </span>
        </li>
      `
      );
    });
  }
};

const createSubCategoryTempalte = (subCategory) => {
  return `
          <li class="sidebar__category-item ${subCategory._id === categoryId ? "active" : ""}" id="category-${subCategory._id}" ${subCategory.subCategories ? `onclick="setLocationSearch('categoryId', '${subCategory._id}')"` : ""}>
            <a class="sidebar__category-link subcategory-btn" onclick="setLocationSearch('categoryId', '${subCategory._id}')"  title="${subCategory.description}">
            <i class="sidebar__category-icon bi bi-house"></i>
            ${subCategory.title}
            </a>

            <ul class="sub-sub-category-container"></ul>
          </li>
        `;
};
const findMainCategory = (categories, subCatId) => {
  let mainCategory = categories.find((category) => {
    return category.subCategories.find((subCat) => subCat._id == subCatId);
  });
  return mainCategory;
};
const findSubCategory = (categories, categoryId) => {
  let allSubCategories = categories.flatMap((category) => {
    return category.subCategories;
  });
  let findSubCategory = allSubCategories.find((subCategory) => subCategory._id == categoryId);
  return findSubCategory;
};
const findSubSubCategory = (categories, subSubCatId) => {
  let subSubMainCatgory = categories.find((category) => {
    return category.subCategories.find((subCat) => {
      return subCat.subCategories.find((subSubCat) => {
        return subSubCat._id == subSubCatId;
      });
    });
  });
  return subSubMainCatgory;
};

const filterGenerator = (filters) => {
  const filtersAccordion = document.querySelector(".filters-accordion");
  filters.forEach((filter) => {
    filtersAccordion.insertAdjacentHTML(
      "afterbegin",
      `${
        filter.type === "selectbox"
          ? `
        <div class="accordion-item border-0 border-bottom py-3">
          <h2 class="accordion-header" title="${filter.description}">
            <button class="accordion-button shadow-none bg-white collapsed"type="button" data-bs-toggle="collapse" data-bs-target="#${filter.slug}-accordion" aria-expanded="true" aria-controls="collapseOne">
              ${filter.name}
              <i class="bi bi-chevron-down"></i>
            </button>
          </h2>
          <div id="${filter.slug}-accordion" class="accordion-collapse collapse">
            <div class="accordion-body">
              <select name="" id="" onchange="setNewFilter('${filter.slug}', event.target.value)">
              ${filter.options.sort((a, b) => b - a).map((option) => `<option value="${option}">${option}</option>`)}
              </select>
            </div>
          </div>
        </div>
    `
          : ""
      }
      
      ${
        filter.type === "checkbox"
          ? `
          <div class="px-3 py-4 border-bottom">
          <input type="checkbox" class="filter-checkbox" id="${filter.slug}">
          <label for="${filter.slug}" class="posts-checkBox have-image-posts-label">
            <div class="">
              <span></span>
            </div>
            <span class="filter-label-text">${filter.name}</span>
          </label>
        </div>
    `
          : ""
      }
      
      
      `
    );
  });
};

// handle delete checkBoxes
const deleteAllFilters = document.querySelector(".delete-all-filters");
const statusFilterCheckbox = document.querySelectorAll(".status-filter-checkbox");

statusFilterCheckbox.forEach((ch) => {
  ch.addEventListener("change", () => {
    if (ch.checked) {
      deleteAllFilters.classList.add("active");
    } else {
      let isHaveChecked = Array.from(statusFilterCheckbox).some((ch) => ch.checked === true);
      isHaveChecked ? deleteAllFilters.classList.add("active") : deleteAllFilters.classList.remove("active");
    }
  });
});
deleteAllFilters.addEventListener("click", () => {
  statusFilterCheckbox.forEach((ch) => {
    ch.checked = false;
    deleteAllFilters.classList.remove("active");
    applyFilters();
  });
});

const applyFilters = () => {
  // has photo filter
  if (haveImagePosts.checked) {
    filteredPosts = filteredPosts.filter((posts) => posts.pics.length);
    setLocationSearch("has-photo", true);
  } else {
    removeUrlParams("has-photo");
  }

  // exchange filter
  if (exchangePosts.checked) {
    filteredPosts = filteredPosts.filter((posts) => posts.exchange);
    setLocationSearch("exchange", true);
  } else {
    removeUrlParams("exchange");
  }

  // price filter

  let minPrice = minPriceInput.value;
  let maxPrice = maxPriceInput.value;

  if (minPrice !== "default") {
    if (maxPrice !== "default") {
      filteredPosts = filteredPosts.filter((post) => post.price >= minPrice && post.price <= maxPrice);
      setLocationSearch("minPrice", minPrice);
      setLocationSearch("maxPrice", maxPrice);
    } else {
      filteredPosts = filteredPosts.filter((post) => post.price >= minPrice);
      setLocationSearch("minPrice", minPrice);
      removeUrlParams("maxPrice");
    }
  } else {
    if (maxPrice !== "default") {
      filteredPosts = filteredPosts.filter((post) => post.price <= maxPrice);
      removeUrlParams("minPrice");
      setLocationSearch("maxPrice", maxPrice);
    } else {
      removeUrlParams("minPrice");
      removeUrlParams("maxPrice");
    }
  }

  // dynamic filter
};

const applyFiltersForLoad = () => {
  // has image posts filter

  if (haveImagePosts.checked) {
    filteredPosts = filteredPosts.filter((posts) => posts.pics.length);
  }

  if (exchangePosts.checked) {
    filteredPosts = filteredPosts.filter((posts) => posts.exchange);
  }

  let statusAccordionBody = document.getElementById("status-accordion-body");
  let statusAccordionBtn = document.getElementById("status-accordion-btn");

  let isHaveChecked = Array.from(statusFilterCheckbox).some((ch) => ch.checked === true);

  isHaveChecked ? deleteAllFilters.classList.add("active") : deleteAllFilters.classList.remove("active");

  isHaveChecked ? statusAccordionBtn.classList.remove("collapsed") : statusAccordionBtn.classList.add("collapsed");
  isHaveChecked ? statusAccordionBody.classList.add("show") : statusAccordionBody.classList.remove("show");

  // price filter

  const priceAccordionBtn = document.getElementById("price-accordion-btn");
  const priceAccordionBody = document.getElementById("price-accordion");

  if (getQueryParams("minPrice")) {
    minPriceInput.value = getQueryParams("minPrice");
    priceAccordionBtn.classList.remove("collapsed");
    priceAccordionBody.classList.add("show");
  }
  if (getQueryParams("maxPrice")) {
    maxPriceInput.value = getQueryParams("maxPrice");
    priceAccordionBtn.classList.remove("collapsed");
    priceAccordionBody.classList.add("show");
  }

  let minPrice = minPriceInput.value;
  let maxPrice = maxPriceInput.value;
  if (minPrice !== "default") {
    if (maxPrice !== "default") {
      filteredPosts = filteredPosts.filter((post) => post.price >= minPrice && post.price <= maxPrice);
    } else {
      filteredPosts = filteredPosts.filter((post) => post.price >= minPrice);
    }
  } else {
    if (maxPrice !== "default") {
      filteredPosts = filteredPosts.filter((post) => post.price <= maxPrice);
    }
  }

  // postsGenerator(filteredPosts);
};
haveImagePosts.addEventListener("change", applyFilters);
exchangePosts.addEventListener("change", applyFilters);

minPriceInput.addEventListener("change", applyFilters);
maxPriceInput.addEventListener("change", applyFilters);

window.setNewFilter = (slug, value) => {
  dynamicFilters[slug] = value;
  setDynamicFilters();
};
//**
const setDynamicFilters = () => {
  // console.log(dynamicFilters);

  let a = filteredPosts.filter((post) => {
    let b = post.dynamicFields.find((field) => {
      return dynamicFilters[field.slug];
    });
    return b.data === dynamicFilters[b.slug];
  });
  // console.log(filteredPosts);
  postsGenerator(a);
  // console.log(a);
};

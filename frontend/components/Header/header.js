import { getUserInfos, logOut } from "../../public/js/utils/auth.js";
import { getAllCity, getQueryParams, removeUrlParams, setDefaultCityInLocal, setLocationSearch, userSavedCities, saveCitiesInTemporaryArray, removeCityFromTemporary, clearTemporaryArrayForCancel, getCategories, isLogin, baseUrl, saveDataInCookie, localHost } from "../../public/js/utils/shared.js";

let headerTemplate = document.createElement("template");
headerTemplate.innerHTML = `

<link rel="stylesheet" href="${localHost}frontend/vendor/bootstrap/bootstrap.css">
<link href="${localHost}frontend/public/css/main.css" rel="stylesheet" />
<link href="${localHost}frontend/public/css/index.css" rel="stylesheet" />
<link href="${localHost}frontend/public/css/share.css" rel="stylesheet" />
<link href="${localHost}frontend/public/css/product.css" rel="stylesheet" />




    <header class="header" style="z-index:5 !important;">
    <div class="container-fluid">
      <div class="header__wrapper">
        <div class="header__right">
          <a class="header__logo-link" href="${localHost}frontend/pages/posts.html">
            <img class="header__logo-img" src="" alt="logo" />
          </a>
          <button class="header__country">
            <i class="header__country-icon bi bi-geo-alt"></i>
            <span class="header__country-title"></span>
          </button>
          <div class="header__category">
            <button class="header__category-btn">
              <span class="header__category-btn-title">دسته ها</span>
              <i class="header__category-btn-icon bi bi-chevron-down"></i>
            </button>
            <div class="header__category-menu" id="header__category-menu">
              <div class="header__category-menu-right">
                <a class="header__category-menu-btn" style="cursor:pointer;">
                  <i class="header__category-menu-btn-icon bi bi-arrow-right"></i>
                  همه آگهی ها
                </a>
                <ul class="haeder__category-menu-list"></ul>
              </div>
            </div>
          </div>
          <div class="header__searchbar">
            <form class="header__form">
              <input class="header__form-input" type="text" placeholder="جستجو در تمام آگهی ها..." />
            </form>
            <i class="bi bi-x" id="remove_searchBox_value--btn"></i>
            <i class="header__searchbar-icon bi bi-search"></i>
            <div class="header__searchbar-dropdown" id="most-seen-keyword-container">
              <span class="header__searchbar-dropdown-title">بیشترین جستجوهای دیوار</span>
              <ul class="header__searchbar-dropdown-list"></ul>
            </div>
          </div>
        </div>
        <div class="header__left">
          <button class="header__left-link header-profile-btn">
            <i class="header__left-icon bi bi-person"></i>
            دیوار من
          </button>
          <div class="header__left-dropdown" id="header__left-dropdown">
            <ul class="header__left-dropdown-list"></ul>
          </div>
          <a class="header__left-link" href="${localHost}frontend/panels/support/support.html" style="display: flex;align-items: center;font-size: var(--font-size-sm);margin: 0 1.5rem;padding: 1rem 1.3rem; border-radius: 0.3rem;"> پشتیبانی </a>
          <button class="header__left-btn header-register-newPost-btn">ثبت آگهی</button>
        </div>
      </div>
    </div>
  </header>
  <section class="overlay-header" id="overlay-header" style="right:0; z-index:2 !important;"></section>
  <section class="country-modal" id="country-modal">
  <div class="country-modal__header">
    <div class="country-modal__header-wrapper">
      <div class="country-modal__title-wrapper">
        <span class="country-modal__title">انتخاب شهر</span>
        <button class="country-modal__btn remove-all-citites">حذف همه</button>
      </div>
      <div class="country-modal__selected"></div>
      <div class="country-modal__searchbar">
        <form class="country-modal__form">
          <input class="country-modal__input" type="text" placeholder="جستجو در شهرها" />
          <i class="country-modal__icon bi bi-search"></i>
        </form>
      </div>
    </div>
  </div>
  <div class="country-modal__cities">
    <ul class="country-modal__cities-list"></ul>
  </div>
  <div class="country-modal__footer">
    <div class="country-modal__footer-wrapper">
      <button class="country-modal__btn-footer country-modal__close">انصراف</button>
      <button class="country-modal__btn-footer country-modal__accept">تایید</button>
    </div>
  </div>
</section>
<section class="overlay categories-overlay" id="categories-overlay"></section>


<!--!==========================================Login Modal==========================================!-->
<section class="login-modal" id="login-modal">
  <div class="login-modal-step1-loader"></div>
  <div class="login-modal__header">
    <div class="login-modal__header-wrapper">
      <span class="login-modal__title">ورود به حساب کاربری</span>
      <button class="login-modal__header-btn">
        <i class="login-modal__icon bi bi-x"></i>
      </button>
    </div>
  </div>
  <div class="login-modal__main">
    <span class="login-modal__main-title">شماره موبایل خود را وارد کنید.</span>
    <p class="login-modal__main-notic">قبل از ثبت آگهی، لطفاً وارد حساب خود شوید.</p>
    <p class="login-modal__main-notic">کد تأیید به این شماره پیامک می‌شود.</p>
    <div class="login-modal__form-wrapper">
      <form class="login-modal__form" action="#">
        <input class="login-modal__input phone-number-input" style="text-align: left" type="text" placeholder="شماره موبایل" />
      </form>
      <span class="login-modal__form-text">+98</span>
    </div>

    <p class="auth-error-text-elem" style="font-size: 1.2rem; color: #a62626; padding: 0 0 20px 0"></p>

    <div class="login-modal__condition">
      <a class="login-modal__condition-link" href="#">شرایط استفاده از خدمات</a>
      <span class="login-modal__condition-text">و</span>
      <a class="login-modal__condition-link" href="#">حریم خصوصی</a>
      <span class="login-modal__condition-text">دیوار را میپذیرم.</span>
    </div>
  </div>
  <div class="login-modal__footer">
    <button class="login-modal__footer-btn login-step1-modal-btn">تایید</button>
  </div>
</section>
<section class="login_modal_step_2" id="login_modal_step_2">
  <div class="login-modal-step2-loader"></div>
  <div class="login-modal__header">
    <div class="login-modal__header-wrapper">
      <span class="login-modal__title">ورود به حساب کاربری</span>
      <button class="login-modal__header-btn">
        <i class="login-modal__icon bi bi-x"></i>
      </button>
    </div>
  </div>
  <div class="login-modal__main">
    <span class="login-modal__main-title">کد تأیید را وارد کنید</span>
    <p class="login-modal__main-notic">کد پیامک‌شده به شمارۀ «<span class="user_number_notice"></span>» را وارد کنید.</p>

    <div class="login-modal__form-wrapper">
      <form class="login-modal__form code-form" action="#">
        <input class="login-modal__input code_input" maxlength="4" placeholder="کد تایید 4 رقمی" />
        <span class="step-2-login-form__error"></span>
      </form>
    </div>
    <div class="login-modal__condition d-flex justify-content-between">
      <span style="color: #a62626; display: none; font-size: 1.3rem; margin: 0;" class="invalid-otp-code"></span>
      <span class="login-modal__condition-text login-change-number">تغییر شماره موبایل</span>
    </div>
  </div>
  <div class="login-modal__footer">
    <button class="login-modal__footer-btn req_new_code_btn">درخواست کد</button>
    <div class="request_timer">
      <p>درخواست مجدد</p>
      <span class="otp-time-counter-label">10</span>
    </div>
    <button class="login-modal__footer-btn login_btn">ورود</button>
  </div>
</section>
<div class="overlay" id="login-overlay" style="top: 0 !important; z-index: 5 !important"></div>

  `;

export class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(headerTemplate.content.cloneNode(true));

    //call methods

    this.logoHandler();

    // searchbox methods
    {
      this.elemes();
      this.searchPostsHandler();
    }
    // city modal methods
    {
      this.showUserCityLengthTitle();
      this.showAndHideHeaderCityModal();
      this.generateUserCitiesInModal();
      this.removeAllUserSavedCities();

      getAllCity().then((res) => {
        this.headerModalCitiesGenerator(res.data);
        this.allCities = res;
      });
      this.saveUserChangeInCities();
      this.closeCityModalByClickCloseBtn();

      this.searchInCitiesInModal();
    }
    // category modal methods
    {
      this.showAndHideHeaderCategoriesModal();
      this.selectCategoryUserWant();

      getCategories().then((res) => {
        this.allCategories = res.data.categories;
        this.modalCategoriesInfoHandler();
      });
    }
    // profile dropdown methods
    {
      this.profileDropdownHandler();
    }
    this.createNewPostBtnHAndler();
  }

  elemes() {
    // searchbar elems
    this.headerForm = this.shadowRoot.querySelector(".header__form");
    this.headerFormInput = this.shadowRoot.querySelector(".header__form-input");
    this.remove_searchBox_valueBtn = this.shadowRoot.querySelector("#remove_searchBox_value--btn");

    this.overlayHeader = this.shadowRoot.querySelector(".overlay-header");

    // cities modal elemes
    this.headerCountryTitle = this.shadowRoot.querySelector(".header__country-title");

    this.headerCountryBtn = this.shadowRoot.querySelector(".header__country");
    this.headerCountryModal = this.shadowRoot.querySelector(".country-modal");

    this.removeAllCitites = this.shadowRoot.querySelector(".remove-all-citites");

    this.countryModalSelected = this.shadowRoot.querySelector(".country-modal__selected");

    this.countryModalCities = this.shadowRoot.querySelector(".country-modal__cities");
    this.countryModalCitiesList = this.shadowRoot.querySelector(".country-modal__cities-list");

    this.countryModalClose = this.shadowRoot.querySelector(".country-modal__close");
    this.countryModalAccept = this.shadowRoot.querySelector(".country-modal__accept");

    this.countryModalForm = this.shadowRoot.querySelector(".country-modal__form");
    this.countryModalInput = this.shadowRoot.querySelector(".country-modal__input");

    // categories modal elems
    this.headerCategoryBtn = this.shadowRoot.querySelector(".header__category-btn");
    this.headerCategoryMenu = this.shadowRoot.querySelector(".header__category-menu");
    this.headerCategoryMenuBtn = this.shadowRoot.querySelector(".header__category-menu-btn");

    this.haederCategoryMenuList = this.shadowRoot.querySelector(".haeder__category-menu-list");

    this.categoriesOverlay = this.shadowRoot.querySelector("#categories-overlay");

    // account dropdown elems
    this.headerProfileBtn = this.shadowRoot.querySelector(".header-profile-btn");
    this.headerLeftDropdown = this.shadowRoot.querySelector(".header__left-dropdown");
    this.headerLeftDropdownList = this.shadowRoot.querySelector(".header__left-dropdown-list");

    // login modal elems
    this.loginOverlay = this.shadowRoot.querySelector("#login-overlay");
    this.loginModalHeaderBtn = this.shadowRoot.querySelectorAll(".login-modal__header-btn");
    this.loginStep1ModalBtn = this.shadowRoot.querySelector(".login-step1-modal-btn");
    this.loginModalForm = this.shadowRoot.querySelector(".login-modal__form");
    this.phoneNumberInput = this.shadowRoot.querySelector(".phone-number-input");
    this.reqNewCodeBtn = this.shadowRoot.querySelector(".req_new_code_btn");
    this.loginChangeNumber = this.shadowRoot.querySelector(".login-change-number");
    this.codeForm = this.shadowRoot.querySelector(".code-form");
    this.codeInput = this.shadowRoot.querySelector(".code_input");
    this.loginBtn = this.shadowRoot.querySelector(".login_btn");

    this.loginModalStep1Loadr = this.shadowRoot.querySelector(".login-modal-step1-loader");
    this.loginModalStep2Loadr = this.shadowRoot.querySelector(".login-modal-step2-loader");

    this.authErrorTextElem = this.shadowRoot.querySelector(".auth-error-text-elem");

    this.userNumberNotice = this.shadowRoot.querySelector(".user_number_notice");
    this.otpTimeCounterLabel = this.shadowRoot.querySelector(".otp-time-counter-label");
    this.reqNewCodeBtn = this.shadowRoot.querySelector(".req_new_code_btn");
    this.requestTimer = this.shadowRoot.querySelector(".request_timer");

    this.invalidOtpCode = this.shadowRoot.querySelector(".invalid-otp-code");
    this.headerRegisterNewPostBtn = this.shadowRoot.querySelector(".header-register-newPost-btn");
  }

  logoHandler() {
    this.logoElem = this.shadowRoot.querySelector(".header__logo-img");
    this.logoElem.src = `${localHost}frontend/public/images/header/logo.svg`;
  }

  // search box methods
  searchPostsHandler() {
    this.headerForm.addEventListener("submit", (e) => e.preventDefault());

    // show and hide delete value btn to searchbar input
    this.headerFormInput.addEventListener("keyup", (e) => {
      if (this.headerFormInput.value.trim()) {
        this.remove_searchBox_valueBtn.style.display = "block";
      } else {
        this.remove_searchBox_valueBtn.style.display = "none";
      }
      if (e.keyCode === 13) {
        e.preventDefault();
        location.href=`${localHost}frontend/pages/posts.html?q=${e.target.value.trim()}`
      }
    });
    // show and hide most search keywords modal
    this.headerFormInput.addEventListener("focus", () => {
      this.showModal("most-seen-keyword-container", "header__searchbar-dropdown--active");
      this.showModal("overlay-header", "overlay-header--active");

      // close other modals
      this.hideModal("country-modal", "country-modal--active");
      this.hideModal("header__category-menu", "header__category-menu--active");
      this.hideModal("categories-overlay", "overlay--active");

      this.shadowRoot.querySelector(".header__category-menu-item").classList.remove("active");
    });
    this.headerFormInput.addEventListener("blur", () => {
      this.hideModal("most-seen-keyword-container", "header__searchbar-dropdown--active");
      this.hideModal("overlay-header", "overlay-header--active");
    });

    if (getQueryParams("q")) {
      this.headerFormInput.value = getQueryParams("q");
    }

    this.remove_searchBox_valueBtn.addEventListener("click", () => {
      if (getQueryParams("q") == this.headerFormInput.value) {
        removeUrlParams("q");
      }
      this.headerFormInput.value = "";
      this.remove_searchBox_valueBtn.style.display = "none";
    });

    if (this.headerFormInput.value.trim()) {
      this.remove_searchBox_valueBtn.style.display = "block";
    } else {
      this.remove_searchBox_valueBtn.style.display = "none";
    }
    this.mostSeenPostsHandler();
  }

  mostSeenPostsHandler() {
    this.mostSeenKeywords = ["خودروسواری", "فروش آپارتمان", "اجاره آپارتمان", "موبایل", "صندلی و نیمکت", "حیوانات", "وسایل شخصی", "خدمات", "استخدام", "تلویزیون", "گوشی", "سامسونگ"];
    this.keywordsContainer = this.shadowRoot.querySelector(".header__searchbar-dropdown-list");
    this.mostSeenKeywords.forEach((keyWord) => {
      this.keywordsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <li class="header__searchbar-dropdown-item">
          <a class="header__searchbar-dropdown-link" href="${localHost}frontend/pages/posts.html?q=${keyWord}" style="cursor:pointer;">${keyWord}</a>
        </li>
      `
      );
    });
  }
  // global methods
  showModal(id, className) {
    this.elem = this.shadowRoot.getElementById(`${id}`);
    this.elem.classList.add(className);
  }

  hideModal(id, className) {
    this.elem = this.shadowRoot.getElementById(`${id}`);
    this.elem.classList.remove(className);
  }
  // city modal methods
  showUserCityLengthTitle() {
    setDefaultCityInLocal();
    this.headerCountryTitle.innerHTML = userSavedCities.length == 1 ? userSavedCities[0].name : userSavedCities.length + " شهر";
  }

  showAndHideHeaderCityModal() {
    // open and close this modal
    this.headerCountryBtn.addEventListener("click", () => {
      if (this.headerCountryModal.className.includes("--active")) {
        this.hideModal("country-modal", "country-modal--active");
        this.hideModal("overlay-header", "overlay-header--active");

        clearTemporaryArrayForCancel();
        this.generateUserCitiesInModal();

        this.headerModalCitiesGenerator(this.allCities.data);

        this.countryModalInput.value = "";

        this.showUserCityLengthTitle();

        this.countryModalCities.scrollTo(0, 0);
      } else {
        this.showModal("country-modal", "country-modal--active");
        this.showModal("overlay-header", "overlay-header--active");

        this.hideModal("header__category-menu", "header__category-menu--active");
        this.hideModal("categories-overlay", "overlay--active");
        this.shadowRoot.querySelector(".header__category-menu-item").classList.remove("active");

        this.countryModalCities.scrollTo(0, 0);
      }
    });

    this.overlayHeader.addEventListener("click", () => {
      this.hideModal("country-modal", "country-modal--active");
      this.hideModal("overlay-header", "overlay-header--active");

      this.generateUserCitiesInModal();
      clearTemporaryArrayForCancel();

      this.headerModalCitiesGenerator(this.allCities.data);

      this.countryModalInput.value = "";

      this.showUserCityLengthTitle();
    });
  }

  generateUserCitiesInModal() {
    this.countryModalSelected.innerHTML = "";

    if (userSavedCities && userSavedCities.length) {
      userSavedCities.forEach((city) => {
        this.countryModalSelected.insertAdjacentHTML(
          "beforeend",
          `
            <div class="country-modal__selected-item">
              <span class="country-modal__selected-text">${city.name}</span>
              <button class="country-modal__selected-btn" data-city-id="${city.id}">
                  <i class="country-modal__selected-icon bi bi-x" data-city-id="${city.id}"></i>
              </button>
            </div>

    `
        );
      });

      this.countryModalSelectedBtn = this.shadowRoot.querySelectorAll(".country-modal__selected-btn");
      this.countryModalSelectedBtn.forEach((removBtn) => {
        removBtn.addEventListener("click", () => {
          removeCityFromTemporary(removBtn.dataset.cityId);
          this.generateUserCitiesInModal();

          this.quickRemoveCityBtn = this.shadowRoot.querySelectorAll(".country-modal__cities-input");
          this.quickRemoveCityBtn.forEach((btn) => {
            if (btn.dataset.cityId == removBtn.dataset.cityId) {
              btn.checked = false;
            }
          });

          this.countryModalAccept.classList.add("country-modal__accept--active");
        });
      });

      this.quickRemoveCityBtn = this.shadowRoot.querySelectorAll(".country-modal__cities-input");
      this.quickRemoveCityBtn.forEach((btn) => {
        this.isHaveInTemporary = userSavedCities.some((city) => +city.id === +btn.dataset.cityId);
        btn.checked = this.isHaveInTemporary;
      });

      this.removeAllCitites.style.display = "block";
    } else {
      this.countryModalSelected.insertAdjacentHTML(
        "beforeend",
        `
          <span style="color:rgba(0,0,0,0.75); font-size:1.4rem;">حداقل یک شهر را انتخاب کنید</span>
        `
      );
      this.removeAllCitites.style.display = "none";
    }
  }

  removeAllUserSavedCities() {
    this.removeAllCitites.addEventListener("click", () => {
      userSavedCities.length = 0;

      this.generateUserCitiesInModal();

      this.countryModalAccept.classList.add("country-modal__accept--active");
      this.removeAllCitites.style.display = "none";

      this.countryModalCitiesInput = this.shadowRoot.querySelectorAll(".country-modal__cities-input");

      this.allCityOfThisProvinceCheckBox = this.shadowRoot.querySelector(".all-cityOf-this-province");

      this.countryModalCitiesInput.forEach((cityCheckbox) => {
        cityCheckbox.checked = false;
        this.allCityOfThisProvinceCheckBox.checked = false;
      });
    });
  }

  headerModalCitiesGenerator(cities) {
    this.allProvinces = cities.provinces;

    this.countryModalCitiesList.innerHTML = "";

    this.allProvinces.forEach((city) => {
      this.countryModalCitiesList.insertAdjacentHTML(
        "beforeend",
        `
          <li class="country-modal__cities-item provinces-item" data-province-id="${city.id}">
            ${city.name}
            <i class="country-modal__cities-icon bi bi-chevron-left"></i>
          </li>
      `
      );
    });

    this.provincesItems = this.shadowRoot.querySelectorAll(".provinces-item");

    this.provincesItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.provinceName = item.innerText;
        this.provinceId = item.dataset.provinceId;
        this.showProvinceCities(cities, this.provinceId, this.provinceName);
      });
    });
  }

  showProvinceCities(cities, id, name) {
    this.provinceCities = cities.cities.filter((city) => +city.province_id == +id);

    this.countryModalCitiesList.innerHTML = `
      <li class="country-modal__cities-item justify-content-start" id="showAllProvincesBtn">
        <i class="country-modal__cities-arrow-icon bi bi-arrow-right" style="font-weight:bold; color:black;"></i> 
        <span class="mx-4" style="font-weight:bold; color:black;">همه شهر ها</span>
      </li>

      <li class="country-modal__cities-item">
        <span style="font-weight:bold; color:black;">همه شهر های ${name}</span>
        <input class="country-modal__cities-checkbox all-cityOf-this-province" type="checkbox">
      </li>

    `;
    this.isHaveCityInLocal = null;

    this.provinceCities.forEach((city) => {
      this.isHaveCityInLocal = userSavedCities?.some((saved) => {
        return +saved.id == +city.id;
      });
      this.countryModalCitiesList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="country-modal__cities-item">
          ${city.name}
          <input class="country-modal__cities-checkbox country-modal__cities-input" data-city-id="${city.id}" ${this.isHaveCityInLocal ? "checked" : ""} name="${city.name}" type="checkbox">
        </li>
  
  `
      );
    });

    this.showAllProvincesBtn = this.shadowRoot.getElementById("showAllProvincesBtn");

    this.showAllProvincesBtn.addEventListener("click", () => {
      this.headerModalCitiesGenerator(cities);
    });

    this.allCityOfThisProvinceCheckBox = this.shadowRoot.querySelector(".all-cityOf-this-province");

    this.countryModalCitiesInput = this.shadowRoot.querySelectorAll(".country-modal__cities-input");

    this.allCheckBoxStatus = [];
    this.isAllChecked = null;

    this.countryModalCitiesInput.forEach((cityCheckbox) => {
      this.allCheckBoxStatus.push(cityCheckbox.checked);
      this.isAllChecked = this.allCheckBoxStatus.every((item) => item);
      this.allCityOfThisProvinceCheckBox.checked = this.isAllChecked;

      cityCheckbox.addEventListener("change", () => {
        if (cityCheckbox.checked) {
          saveCitiesInTemporaryArray(cityCheckbox.name, Number(cityCheckbox.dataset.cityId));
          this.generateUserCitiesInModal();
        } else {
          removeCityFromTemporary(cityCheckbox.dataset.cityId);

          this.generateUserCitiesInModal();
        }

        this.allCheckBoxStatus = [];

        this.countryModalCitiesInput.forEach((cityCheckbox) => {
          this.allCheckBoxStatus.push(cityCheckbox.checked);
          this.isAllChecked = this.allCheckBoxStatus.every((item) => item);
        });

        this.allCityOfThisProvinceCheckBox.checked = this.isAllChecked;

        this.countryModalAccept.classList.add("country-modal__accept--active");
      });
    });

    this.allCityOfThisProvinceCheckBox.addEventListener("change", () => {
      this.countryModalCitiesInput.forEach((cityCheckbox) => {
        cityCheckbox.checked = this.allCityOfThisProvinceCheckBox.checked;
      });
      this.addUserSelectedCitiesInModal();
      this.generateUserCitiesInModal();
      this.countryModalAccept.classList.add("country-modal__accept--active");
    });

    this.countryModalCities.scrollTo(0, 0);
  }

  addUserSelectedCitiesInModal() {
    this.countryModalCitiesInput = this.shadowRoot.querySelectorAll(".country-modal__cities-input");
    this.countryModalCitiesInput.forEach((cityCheckbox) => {
      if (cityCheckbox.checked) {
        saveCitiesInTemporaryArray(cityCheckbox.name, Number(cityCheckbox.dataset.cityId));
      } else {
        removeCityFromTemporary(cityCheckbox.dataset.cityId);
      }
    });
  }

  closeCityModalByClickCloseBtn() {
    this.countryModalClose.addEventListener("click", () => {
      clearTemporaryArrayForCancel();

      this.generateUserCitiesInModal();
      this.hideModal("country-modal", "country-modal--active");
      this.hideModal("overlay-header", "overlay-header--active");

      this.headerModalCitiesGenerator(this.allCities.data);

      this.countryModalInput.value = "";

      this.showUserCityLengthTitle();

      this.countryModalCities.scrollTo(0, 0);
    });
  }

  saveUserChangeInCities() {
    this.countryModalAccept.addEventListener("click", () => {
      localStorage.setItem("cities", JSON.stringify(userSavedCities));
      location.reload();
    });
  }

  searchInCitiesInModal() {
    this.countryModalForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    this.countryModalInput.addEventListener("keyup", (e) => {
      getAllCity().then((res) => {
        if (this.countryModalInput.value.trim()) {
          this.cities = res.data.cities;
          this.filteredCities = this.cities.filter((city) => city.name.startsWith(this.countryModalInput.value));

          this.isHaveCityInLocal = null;

          this.countryModalCitiesList.innerHTML = "";

          this.filteredCities.forEach((city) => {
            this.isHaveCityInLocal = userSavedCities.some((saved) => {
              return +saved.id == +city.id;
            });
            this.countryModalCitiesList.insertAdjacentHTML(
              "beforeend",
              `
                <li class="country-modal__cities-item">
                  ${city.name}
                  <input class="country-modal__cities-checkbox country-modal__cities-input" data-city-id="${city.id}" ${this.isHaveCityInLocal ? "checked" : ""} name="${city.name}" type="checkbox">
                </li>
              `
            );
          });

          this.countryModalCitiesInput = this.shadowRoot.querySelectorAll(".country-modal__cities-input");

          this.countryModalCitiesInput.forEach((cityCheckbox) => {
            cityCheckbox.addEventListener("change", () => {
              if (cityCheckbox.checked) {
                saveCitiesInTemporaryArray(cityCheckbox.name, Number(cityCheckbox.dataset.cityId));
                this.generateUserCitiesInModal();
              } else {
                removeCityFromTemporary(cityCheckbox.dataset.cityId);
                this.generateUserCitiesInModal();
              }

              this.countryModalAccept.classList.add("country-modal__accept--active");
            });
          });
        } else {
          this.headerModalCitiesGenerator(res.data);
        }
      });
    });
  }

  // select category modal methods
  showAndHideHeaderCategoriesModal() {
    this.headerCategoryBtn.addEventListener("click", () => {
      if (this.headerCategoryMenu.className.includes("--active")) {
        this.hideModal("header__category-menu", "header__category-menu--active");
        this.hideModal("categories-overlay", "overlay--active");
        this.shadowRoot.querySelector(".header__category-menu-item").classList.remove("active");
      } else {
        this.showModal("header__category-menu", "header__category-menu--active");
        this.showModal("categories-overlay", "overlay--active");
        this.shadowRoot.querySelector(".header__category-menu-item").classList.add("active");

        // hide city modal when open categori modal
        this.hideModal("country-modal", "country-modal--active");
        this.hideModal("overlay-header", "overlay-header--active");
      }
    });
    this.categoriesOverlay.addEventListener("click", () => {
      if (this.headerCategoryMenu.className.includes("--active")) {
        this.hideModal("header__category-menu", "header__category-menu--active");
        this.hideModal("categories-overlay", "overlay--active");
        this.shadowRoot.querySelector(".header__category-menu-item").classList.remove("active");
      } else {
        this.showModal("header__category-menu", "header__category-menu--active");
        this.showModal("categories-overlay", "overlay--active");
        this.shadowRoot.querySelector(".header__category-menu-item").classList.add("active");

        // hide city modal when open categori modal
        this.hideModal("country-modal", "country-modal--active");
        this.hideModal("overlay-header", "overlay-header--active");
      }
    });
  }

  selectCategoryUserWant() {
    this.headerCategoryMenuBtn.addEventListener("click", () => {
      removeUrlParams("categoryId");
    });
  }
  modalCategoriesInfoHandler() {
    this.haederCategoryMenuList.innerHTML = "";
    this.allCategories.forEach((category) => {
      this.haederCategoryMenuList.insertAdjacentHTML(
        "beforeend",
        `
          <li class="header__category-menu-item">
          <a class="header__category-menu-link ${getQueryParams("categoryId") == category._id ? "active" : ""}" onclick="setLocationSearch('categoryId', '${category._id}')" style="cursor:pointer;">
            <div class="header__category-menu-link-right">
              <i class="header__category-menu-icon bi bi-house"></i>
              ${category.title}
            </div>
            <div class="header__category-menu-link-left">
              <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
            </div>
          </a>
          <div class="header__category-dropdown">
            <div class="row">
              ${this.headerModalSubCategoriesGenerator(category.subCategories)}
            </div>
          </div>
        </li>
      `
      );
    });
  }
  headerModalSubCategoriesGenerator(subCategories) {
    return subCategories.map((subCategory) => {
      return `        
        <div class="col-4">
          <ul class="header__category-dropdown-list">
            <a class="header__category-dropdown-title ${getQueryParams("categoryId") == subCategory._id ? "active" : ""}" onclick="setLocationSearch('categoryId', '${subCategory._id}')" style="cursor:pointer;">${subCategory.title}</a>
            ${subCategory.subCategories.map((subSubCategory) => {
              return `
              <li class="header__category-dropdown-item">
                <a href="${localHost}frontend/pages/posts.html?categoryId=${subSubCategory._id}" class="header__category-dropdown-link ${getQueryParams("categoryId") == subSubCategory._id ? "active" : ""}" style="cursor:pointer;">${subSubCategory.title}</a>
              </li>`;
            })}
          </ul>
      </div>
    `;
    });
  }
  async submitPhoneNumber() {
    this.phoneNumber = this.phoneNumberInput.value.trim();
    this.phoneNumberPatternRegex = RegExp(/^(09)[0-9]{9}$/);

    this.phoneNumberOtpTimeCounter = 60;
    this.otpTimeCounterLabel.innerHTML = this.phoneNumberOtpTimeCounter;

    this.isValidPhoneNumber = this.phoneNumberPatternRegex.test(this.phoneNumber);
    if (this.isValidPhoneNumber) {
      this.authErrorTextElem.innerHTML = "";
      this.loginModalStep1Loadr.classList.add("active");
      this.authSendInfo = await fetch(`${baseUrl}/v1/auth/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: this.phoneNumber }),
      });
      this.parsedAuthInfo = await this.authSendInfo.json();
      if (this.parsedAuthInfo.status === 200) {
        this.loginModalStep1Loadr.classList.remove("active");
        this.hideModal("login-modal", "login-modal--active");
        this.showModal("login_modal_step_2", "login_modal_step_2--active");

        this.reqNewCodeBtn.style.display = "none";
        this.requestTimer.style.display = "block";

        this.userNumberNotice.innerHTML = this.phoneNumber;
        this.otpReaprtTimer = setInterval(() => {
          if (this.phoneNumberOtpTimeCounter > 0) {
            this.phoneNumberOtpTimeCounter--;
            this.otpTimeCounterLabel.innerHTML = this.phoneNumberOtpTimeCounter;
          } else {
            clearInterval(this.otpReaprtTimer);
            this.reqNewCodeBtn.style.display = "block";
            this.requestTimer.style.display = "none";
          }
        }, 1000);
      }
    } else {
      if (!this.phoneNumber) {
        this.authErrorTextElem.innerHTML = "لطفا شماره موبایل را وارد کنید";
      } else {
        this.authErrorTextElem.innerHTML = "لطفا شماره موبایل را صحیح وارد کنید";
      }
    }
  }

  async authorize(phoneNumber, OTPCode) {
    this.loginModalStep2Loadr.classList.add("active");
    this.authSendInfo = await fetch(`${baseUrl}/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumber,
        otp: OTPCode,
      }),
    });
    this.parsedAuthInfo = await this.authSendInfo.json();
    this.loginModalStep2Loadr.classList.remove("active");
    if (this.parsedAuthInfo.status === 200 || this.parsedAuthInfo.status === 201) {
      saveDataInCookie("token", this.parsedAuthInfo.data.token);
      this.invalidOtpCode.style.display = "none";
      location.reload();
      this.hideModal("login-modal", "login-modal--active");
      this.hideModal("login_modal_step_2", "login_modal_step_2--active");
      this.hideModal("login-overlay", "overlay--active");
    } else {
      this.invalidOtpCode.style.display = "block";
    }
  }

  async profileDropdownHandler() {
    this.headerProfileBtn.addEventListener("click", () => {
      // console.log("ali");
      if (this.headerLeftDropdown.className.includes("--active")) {
        this.headerLeftDropdown.classList.remove("header__left-dropdown--active");
      } else {
        this.headerLeftDropdown.classList.add("header__left-dropdown--active");
      }
    });

    this.isUserLogedIn = isLogin();
    this.userDatas = await getUserInfos();
    if (this.isUserLogedIn) {
      this.headerLeftDropdownList.innerHTML = "";
      this.headerLeftDropdownList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="header__left-dropdown-item">
        <button class="header__left-dropdown-link login-modal-btn d-flex flex-column align-items-start" style="width:100%; gap:10px;">
          <a href="${localHost}frontend/panels/userPanel/verify.html" class="d-flex" style="width:100%; color:black; font-size:1.2rem;">
            <i class="header__left-dropdown-icon bi bi-person" style="color:black; font-size:1.4rem;"></i>
            <span style="color:black; font-size:1.2rem;">کاربر دیوار</span>
          </span>

          <a>تلفن: ${this.userDatas.data.user.username}</span>
        </button>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="${localHost}frontend/panels/userPanel/posts.html">
        <i class="header__left-dropdown-icon bi bi-journal"></i>
          آگهی های من
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="${localHost}frontend/panels/userPanel/bookmarks.html">
          <i class="header__left-dropdown-icon bi bi-bookmark"></i>
          نشان ها
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="${localHost}frontend/panels/userPanel/notes.html">
          <i class="header__left-dropdown-icon bi bi-journal"></i>
          یادداشت ها
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="${localHost}frontend/panels/userPanel/recent-seen.html">
          <i class="header__left-dropdown-icon bi bi-clock-history"></i>
          بازدید های اخیر
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <button class="header__left-dropdown-link user-logout-btn">
          <i class="header__left-dropdown-icon bi bi-shop"></i>
          خروج
        </button>
      </li>
      `
      );
      this.userLogoutBtn = this.shadowRoot.querySelector(".user-logout-btn");
    } else {
      this.headerLeftDropdownList.innerHTML = "";
      this.headerLeftDropdownList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="header__left-dropdown-item">
        <button class="header__left-dropdown-link login-modal-btn" style="width:100%;">
          <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
          ورود
        </button>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="${localHost}frontend/panels/userPanel/bookmarks.html">
          <i class="header__left-dropdown-icon bi bi-bookmark"></i>
          نشان ها
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="${localHost}frontend/panels/userPanel/notes.html">
          <i class="header__left-dropdown-icon bi bi-journal"></i>
          یادداشت ها
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="#">
          <i class="header__left-dropdown-icon bi bi-clock-history"></i>
          بازدید های اخیر
        </a>
      </li>
      <li class="header__left-dropdown-item">
        <a class="header__left-dropdown-link" href="#">
          <i class="header__left-dropdown-icon bi bi-shop"></i>
          دیوار برای کسب و کارها
        </a>
      </li>
      `
      );
      this.loginModalBtn = this.shadowRoot.querySelector(".login-modal-btn");
    }

    this.loginModalBtn?.addEventListener("click", () => {
      // console.log('reza');
      this.showModal("login-modal", "login-modal--active");
      this.showModal("login-overlay", "overlay--active");

      this.hideModal("header__left-dropdown", "header__left-dropdown--active");
    });

    // close login modal
    this.loginOverlay.addEventListener("click", () => {
      this.hideModal("login-modal", "login-modal--active");
      this.hideModal("login_modal_step_2", "login_modal_step_2--active");
      this.hideModal("login-overlay", "overlay--active");
    });
    this.loginModalHeaderBtn.forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        this.hideModal("login-modal", "login-modal--active");
        this.hideModal("login_modal_step_2", "login_modal_step_2--active");
        this.hideModal("login-overlay", "overlay--active");
      });
    });

    // handle auth
    this.loginStep1ModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.submitPhoneNumber();
    });

    this.phoneNumberInput.addEventListener("keyup", (e) => {
      if (e.keyCode == 13) {
        this.submitPhoneNumber();
      }
    });

    this.loginModalForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    this.reqNewCodeBtn.addEventListener("click", () => {
      this.submitPhoneNumber();
    });

    this.loginChangeNumber.addEventListener("click", () => {
      this.showModal("login-modal", "login-modal--active");
      this.hideModal("login_modal_step_2", "login_modal_step_2--active");
    });

    this.loginBtn.addEventListener("click", () => {
      if (this.codeInput.value.trim()) {
        this.authorize(this.phoneNumberInput.value.trim(), this.codeInput.value.trim());
      }
    });
    this.codeInput.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        if (this.codeInput.value.trim()) {
          this.authorize(this.phoneNumberInput.value.trim(), this.codeInput.value.trim());
        }
      }
    });
    this.codeForm.addEventListener("submit", (e) => e.preventDefault());

    // log out handler
    this.userLogoutBtn?.addEventListener("click", () => {
      logOut();
    });
  }
  createNewPostBtnHAndler() {
    this.headerRegisterNewPostBtn.addEventListener("click", () => {
      if (isLogin()) {
        location.href = `${localHost}frontend/panels/userPanel/newPost.html`;
      } else {
        this.showModal("login-modal", "login-modal--active");
        this.showModal("login-overlay", "overlay--active");
      }
    });
  }
}

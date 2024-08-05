import { Header } from "../../../../components/Header/header.js";
import { authorize, getUserInfos, logOut, submitPhoneNumber } from "../../../../public/js/utils/auth.js";
import { hideModal, isLogin, showModal } from "../../../../public/js/utils/shared.js";
window.customElements.define("site-header", Header);

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
const logoutBtn = document.querySelector("#logout-btn");
const sidebarPhoneNumber = document.querySelector("#sidebar-phone-number");
window.addEventListener("load", async () => {
  if (!isLogin()) {
    showModal("login-modal", "login-modal--active");
    showModal("login-overlay", "overlay--active");
  } else {
    let userInfos = await getUserInfos();
    sidebarPhoneNumber ? (sidebarPhoneNumber.innerHTML = `تلفن: ${userInfos.data.user.username}`) : "";
  }
});

loginOverlay.addEventListener("click", () => {
  if (isLogin()) {
    hideModal("login-modal", "login-modal--active");
    hideModal("login_modal_step_2", "login_modal_step_2--active");
    hideModal("login-overlay", "overlay--active");
  }
});
loginModalHeaderBtn.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    if (isLogin()) {
      hideModal("login-modal", "login-modal--active");
      hideModal("login_modal_step_2", "login_modal_step_2--active");
      hideModal("login-overlay", "overlay--active");
    } else {
      location.href = "../../pages/posts.html";
    }
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

logoutBtn?.addEventListener("click", () => {
  logOut();
});

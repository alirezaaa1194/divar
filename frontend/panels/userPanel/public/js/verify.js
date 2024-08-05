import { getUserInfos } from "../../../../public/js/utils/auth.js";
import { baseUrl, getDataFromCookie, isLogin } from "../../../../public/js/utils/shared.js";
import { showModal, showSwal } from "../../../../public/js/utils/utils.js";

const verifyContainer = document.querySelector("#verify-container");
const phoneNumberElem = document.querySelector("#phone-number");
const verifyNationalCodeForm = document.querySelector(".verify__national-code-form");
const verifyNationalInput = document.querySelector(".verify__national-input");
const verifyNationalBtn = document.querySelector(".verify__national-btn");

window.addEventListener("load", () => {
  if (!isLogin()) {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");

    showModal("login-modal", "login-modal--active");
    showModal("login-overlay", "overlay--active");
  } else {
    userVerificationGenerator();
  }
});

const userVerificationGenerator = async () => {
  let userInfo = await getUserInfos();
  let user = userInfo.data.user;

  if (user.verified) {
    verifyContainer.innerHTML = "";
    verifyContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="verified">
        <p>تایید هویت شده</p>
        <span class="mt-4">تایید هویت شما در تاریخ مردادماه 1403 از طریق کدملی انجام شده.</span>
        <img 
            width="100"
            height="100"
            src="https://static-00.iconduck.com/assets.00/verified-icon-512x512-5rv3ez90.png"
        />
    </div>
  `
    );
  } else {
    phoneNumberElem.innerHTML = user.phone;
  }
  const loader_container = document.querySelector(".loader_container");
  loader_container.classList.add("hidden");
};

verifyNationalCodeForm.addEventListener("submit", (e) => {
  e.preventDefault();
});
verifyNationalBtn.addEventListener("click", async () => {
  if (verifyNationalInput.value.trim()) {
    let nationalCodeRegex = RegExp(/^\d{10}$/);

    let isValidNationalCode = nationalCodeRegex.test(verifyNationalInput.value.trim());
    if (isValidNationalCode) {
      let data = await fetch(`${baseUrl}/v1/user/identity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getDataFromCookie("token")}`,
        },
        body: JSON.stringify({
          nationalCode: verifyNationalInput.value.trim(),
        }),
      });
      let res = await data.json();
      if (res.status === 200) {
        showSwal("شما با موفقیت احراز هویت شدید", "success", "اوکی", () => {
          location.reload();
        });
      } else if (res.status === 400) {
        showSwal("کدملی متعلق به این شماره تلفن نیست", "error", "اوکی", () => null);
      }
    } else {
      showSwal("لطفا کدملی را درست وارد کنید", "error", "اوکی", () => null);
    }
  } else {
    showSwal("لطفا کدملی را وارد کنید", "error", "اوکی", () => null);
  }
});

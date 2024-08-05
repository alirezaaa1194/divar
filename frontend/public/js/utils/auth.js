import { baseUrl, getDataFromCookie, hideModal, isLogin, removeDataFromCookie, saveDataInCookie, showModal } from "./shared.js";
const loginModalStep1Loadr = document.querySelector(".login-modal-step1-loader");
const loginModalStep2Loadr = document.querySelector(".login-modal-step2-loader");

const phoneNumberInput = document.querySelector(".phone-number-input");
const authErrorTextElem = document.querySelector(".auth-error-text-elem");

const userNumberNotice = document.querySelector(".user_number_notice");
const otpTimeCounterLabel = document.querySelector(".otp-time-counter-label");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const requestTimer = document.querySelector(".request_timer");

const invalidOtpCode = document.querySelector(".invalid-otp-code");

export const submitPhoneNumber = async () => {
  let phoneNumber = phoneNumberInput.value.trim();
  let phoneNumberPatternRegex = RegExp(/^(09)[0-9]{9}$/);

  let phoneNumberOtpTimeCounter = 60;
  otpTimeCounterLabel.innerHTML = phoneNumberOtpTimeCounter;

  let isValidPhoneNumber = phoneNumberPatternRegex.test(phoneNumber);
  if (isValidPhoneNumber) {
    authErrorTextElem.innerHTML = "";
    loginModalStep1Loadr.classList.add("active");
    let authSendInfo = await fetch(`${baseUrl}/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    let parsedAuthInfo = await authSendInfo.json();
    if (parsedAuthInfo.status === 200) {
      loginModalStep1Loadr.classList.remove("active");
      hideModal("login-modal", "login-modal--active");
      showModal("login_modal_step_2", "login_modal_step_2--active");

      reqNewCodeBtn.style.display = "none";
      requestTimer.style.display = "block";

      userNumberNotice.innerHTML = phoneNumber;
      let otpReaprtTimer = setInterval(() => {
        if (phoneNumberOtpTimeCounter > 0) {
          phoneNumberOtpTimeCounter--;
          otpTimeCounterLabel.innerHTML = phoneNumberOtpTimeCounter;
        } else {
          clearInterval(otpReaprtTimer);
          reqNewCodeBtn.style.display = "block";
          requestTimer.style.display = "none";
        }
      }, 1000);
    }
  } else {
    if (!phoneNumber) {
      authErrorTextElem.innerHTML = "لطفا شماره موبایل را وارد کنید";
    } else {
      authErrorTextElem.innerHTML = "لطفا شماره موبایل را صحیح وارد کنید";
    }
  }
};

export const authorize = async (phoneNumber, OTPCode) => {
  loginModalStep2Loadr.classList.add("active");
  let authSendInfo = await fetch(`${baseUrl}/v1/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phoneNumber,
      otp: OTPCode,
    }),
  });
  let parsedAuthInfo = await authSendInfo.json();
  loginModalStep2Loadr.classList.remove("active");
  if (parsedAuthInfo.status === 200 || parsedAuthInfo.status === 201) {
    saveDataInCookie("token", parsedAuthInfo.data.token);
    // saveDataInCookie("userId", parsedAuthInfo.data.user._id);
    // saveDataInCookie("userPhone", parsedAuthInfo.data.user.phone);
    // saveDataInCookie("userRole", parsedAuthInfo.data.user.role);
    invalidOtpCode.style.display = "none";

    location.reload();

    hideModal("login-modal", "login-modal--active");
    hideModal("login_modal_step_2", "login_modal_step_2--active");
    hideModal("login-overlay", "overlay--active");
  } else {
    invalidOtpCode.style.display = "block";
  }
};

export const getUserInfos = async () => {
  if (isLogin()) {
    let userInfos = await fetch(`https://divarapi.liara.run/v1/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getDataFromCookie("token")}`,
      },
    });
    let userDatas = await userInfos.json();
    return userDatas;
  }
};

export const logOut = () => {
  removeDataFromCookie("token");
  localStorage.removeItem('lastSeen')
  location.reload();
};

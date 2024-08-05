// const saveInLocalStorage = (key, value) => {
//   localStorage.setItem(key, JSON.stringify(value));
// };

// const getFromLocalStorage = (key) => {
//   return JSON.parse(localStorage.getItem(key));
// };

// const addParamToUrl = (param, value) => {
//   const url = new URL(location.href);
//   const searchParams = url.searchParams;

//   searchParams.set(param, value);
//   url.search = searchParams.toString();

//   location.href = url.toString();
// };

export const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(param);
};

export const setUrlParam = (key, value) => {
  let urlParams = new URLSearchParams(location.search);
  urlParams.set(key, value);
};

// const removeParamFromUrl = (param) => {
//   const url = new URL(location.href);
//   url.searchParams.delete(param);
//   window.history.replaceState(null, null, url);
//   location.reload();
// };

// const calcuteRelativeTimeDifference = (createdAt) => {
//   const currentTime = new Date();
//   const createdTime = new Date(createdAt);

//   const timeDifference = currentTime - createdTime;
//   const hours = Math.floor(timeDifference / (60 * 60 * 1000));

//   if (hours < 24) {
//     return `${hours} ساعت پیش`;
//   } else {
//     const days = Math.floor(hours / 24);
//     return `${days} روز پیش`;
//   }
// };

export const showModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.add(className);
};

export const hideModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.remove(className);
};

export const showSwal = (title, icon, buttons, callback) => {
  swal({
    title,
    icon,
    buttons,
  }).then((result) => {
    callback(result);
  });
};

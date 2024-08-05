import { baseUrl, getDataFromCookie } from "../../../../public/js/utils/shared.js";

window.addEventListener("load", () => {
  getDashboardInfo();
});

const getDashboardInfo = async () => {
  let data = await fetch(`${baseUrl}/v1/dashboard`, {
    headers: {
      Authorization: `Bearer ${getDataFromCookie("token")}`,
    },
  });
  let dashboardInfo = await data.json();
  console.log(dashboardInfo);
};

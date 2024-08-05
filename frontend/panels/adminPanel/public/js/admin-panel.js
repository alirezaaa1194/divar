import { getUserInfos, logOut } from "../../../../public/js/utils/auth.js";
import { isLogin, localHost } from "../../../../public/js/utils/shared.js";
window.addEventListener("load", async () => {
  if (isLogin()) {
    let userInfo = await getUserInfos();
    // console.log(userInfo);
    if (userInfo.data.user.role !== "ADMIN") {
      // location.href = `${localHost}frontend/pages/posts.html`;
    }
  } else {
    // location.href = `${localHost}frontend/pages/posts.html`;
  }

  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", logOut);
});

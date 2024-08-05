import { baseUrl, calcuteRelativeTime, getPosts, getQueryParams, localHost, paginationGenerator } from "../../../../public/js/utils/shared.js";

window.addEventListener("load", () => {
  if (!getQueryParams("page")) {
    location.search = `page=${1}`;
  }
  filterLastSeenPosts();
});

const filterLastSeenPosts = async () => {
  let allPosts = await getPosts();

  let lastSeenPostsId = JSON.parse(localStorage.getItem("lastSeen")) || [];

  if (lastSeenPostsId.length) {
    let lastSeenPosts = allPosts.data.posts.filter((post) => lastSeenPostsId.includes(post._id));
    postsGenerator(allPosts, lastSeenPosts);
  } else {
    const lastSeensContainer = document.querySelector("#datas-container");
    lastSeensContainer.innerHTML = "";

    let paginationContainer = document.querySelector(`.pagination-container`);
    paginationContainer.innerHTML = "";

    const empty = document.querySelector(".empty");
    lastSeensContainer.classList.remove("d-flex");
    lastSeensContainer.classList.add("d-none");

    empty.classList.remove("d-none");
    empty.classList.add("d-flex");
  }
  const loader_container = document.querySelector(".loader_container");
  loader_container.classList.add("hidden");
};

const postsGenerator = (allPosts, lastSeenPosts) => {
  let posts = lastSeenPosts;
  let total = Math.ceil(lastSeenPosts.length / allPosts.data.pagination.limit);

  paginationGenerator(total, "pagination-container");

  let date = null;

  const datasContainer = document.querySelector("#datas-container");

  datasContainer.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    date = calcuteRelativeTime(posts[i].createdAt);
    datasContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="col-4">
                <div class="product-card">
                    <div class="product-card__right">
                        <div class="product-card__right-top">
                            <a class="product-card__link" href="${localHost}frontend/pages/post.html?id=${posts[i]._id}">${posts[i].title}</a>
                        </div>
                        <div class="product-card__right-bottom">
                            <span class="product-card__condition">${posts[i].dynamicFields[0].data}</span>
                            <span class="product-card__price">${posts[i].price ? posts[i].price.toLocaleString() + " تومان" : "توافقی"}</span>
                            <span class="product-card__time">${date}</span>
                        </div>
                    </div>
  
                    <div class="product-card__left">
                        ${
                          posts[i].pics.length
                            ? `
                          <img class="product-card__img" src="${baseUrl}/${posts[i].pics[0].path}"></img>
                        `
                            : `
                          <img class="product-card__img img-fluid" src="${localHost}frontend/public/images/main/no-profile.png"></img>
                        `
                        }
                    </div>
                </div>
            </div>
  `
    );
  }
};

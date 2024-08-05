import { baseUrl, calcuteRelativeTime, getDataFromCookie, getQueryParams, infiniteScrollHandler, localHost, paginationGenerator } from "../../../../public/js/utils/shared.js";
import { showSwal } from "../../../../public/js/utils/utils.js";

window.addEventListener("load", () => {
  if (location.href.includes("notes.html")) {
    if (!getQueryParams("page")) {
      location.search = `page=${1}`;
    }
    getNotes();
  }
});

export const getNotes = async () => {
  let datas = await fetch(`${baseUrl}/v1/user/notes?page=${getQueryParams("page")}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getDataFromCookie("token")}`,
    },
  });
  let notes = await datas.json();

  if (notes) {
    const loader_container = document.querySelector(".loader_container");
    loader_container.classList.add("hidden");
  }
  if (notes.data.posts.length) {
    notesGenerator(notes);
  } else {
    const notesContainer = document.querySelector("#datas_container");
    notesContainer.innerHTML = "";

    let paginationContainer = document.querySelector(`.pagination-container`);
    paginationContainer.innerHTML = "";

    const empty = document.querySelector(".empty");
    notesContainer.classList.remove("d-flex");
    notesContainer.classList.add("d-none");

    empty.classList.remove("d-none");
    empty.classList.add("d-flex");
  }
};

const notesGenerator = (data) => {

  let notes = data.data.posts;

  paginationGenerator(data.data.pagination.totalPages, "pagination-container");

  let date = null;

  const datasContainer = document.querySelector("#datas_container");

  datasContainer.innerHTML = "";

  for (let i = 0; i < notes.length; i++) {
    date = calcuteRelativeTime(notes[i].createdAt);

    datasContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col-9 p-4 border border-gray rounded-2 d-flex flex-column justify-content-evenly">
      <div class="d-flex align-items-center">

        ${
          notes[i].pics.length
            ? `
          <img class="product-card__img" src="${baseUrl}/${notes[i].pics[0].path}" class="rounded-1" style="width: 80px; height: 80px"></img>
        `
            : `
          <img class="product-card__img img-fluid" src="${localHost}/frontend/images/main/no-profile.png" class="rounded-1" style="width: 80px; height: 80px"></img>
        `
        }
        <div class="d-flex flex-column pe-3">
          <a href="${localHost}/frontend/pages/post.html?id=${notes[i]._id}" class="my-2 text-dark h5">${notes[i].title}</a>
          <span class="my-2">${date} در ${notes[i].neighborhood.name}</span>
          <p class="my-2 h5">${notes[i].note.content}</p>
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <i class="bi bi-trash h4 remove-note-btn" style="cursor: pointer;" id="${notes[i].note._id}"></i>
      </div>
    </div>
`
    );
  }
  let deleteNotekBtns = document.querySelectorAll(".remove-note-btn");

  deleteNotekBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async () => {
      showSwal("آیا از حذف یادداشت اطمینان دارید؟", "warning", ["خیر", "بله"], async (result) => {
        if (result) {
          await fetch(`${baseUrl}/v1/note/${deleteBtn.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getDataFromCookie("token")}`,
            },
          }).then((res) => {
            getNotes();
          });
        }
      });
    });
  });
};

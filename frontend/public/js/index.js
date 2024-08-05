import { getAllCity, saveCitiesInLocal } from "./utils/shared.js";

const searchInput = document.querySelector("#search-input");
const searchResultCities = document.querySelector(".search-result-cities");
const popularCitiesContainer = document.querySelector(".popularCities-container");

// all cities array
let citiesArray = [];

// popular cities array
let popularCitiesArray = [];

window.addEventListener("load", () => {
  const loader_container = document.querySelector(".loader_container");
  // get all city
  getAllCity().then((result) => {
    // set all city in array
    citiesArray = result.data.cities;
    // console.log(citiesArray);

    // set popular city in array
    popularCitiesArray = citiesArray.filter((city) => city.popular);
    popularCitiesGenerator(popularCitiesArray);
    loader_container.classList.add("hidden");
  });

  // search between city handler
  searchCityGenerator();

  // redirect user To city selected page
  redirectUserToCityPage();
});
// show popular city in dom
const popularCitiesGenerator = (cities) => {
  popularCitiesContainer.innerHTML = "";
  cities.forEach((city) => {
    popularCitiesContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col-2 d-flex justify-content-center">
            <li class="main__cities-item">
                <a class="main__cities-link" href="frontend/pages/posts.html" onclick="saveCitiesInLocal('${city.name}', '${city.id}')">${city.name}</a>
            </li>
        </div>
    `
    );
  });
};
// search city generator
const searchCityGenerator = () => {
  //   search input events
  searchInput.addEventListener("keyup", (e) => {
    if (searchInput.value.trim()) {
      searchResultCities.classList.add("active");
      filterCitiesHandler(searchInput.value.trim());
    } else {
      searchResultCities.classList.remove("active");
    }
  });
  searchInput.addEventListener("focus", () => {
    searchResultCities.classList.add("active");
    filterCitiesHandler(searchInput.value.trim());
  });
  searchInput.addEventListener("blur", () => {
    searchResultCities.classList.remove("active");
  });
};
// return user filtered cities
const filterCitiesHandler = (key) => {
  // let searchedCities = citiesArray.filter((city) => city.name.includes(key));
  let searchedCities = citiesArray.filter((city) => city.name.startsWith(key));
  filterCitiesGenerator(searchedCities);
};
// show user searched cities in dom
const filterCitiesGenerator = (cities) => {
  searchResultCities.innerHTML = "";
  if (cities.length) {
    cities.forEach((city) => {
      searchResultCities.insertAdjacentHTML(
        "beforeend",
        `
        <li>
            <a href="frontend/pages/posts.html" onclick="saveCitiesInLocal('${city.name}', '${city.id}')">${city.name}</a>
        </li>
    `
      );
    });
  } else {
    searchResultCities.insertAdjacentHTML(
      "beforeend",
      `
        <li style="background:rgba(255,0,0,.7); color:#fff;">شهر مورد نظر یافت نشد</li>
    `
    );
  }
};
// redirect user to selected city page
const redirectUserToCityPage = () => {
  // if (localStorage.getItem("cities")) {
  //   if (localStorage.getItem("cities").length) {
  //     location.href = `frontend/pages/post.html`;
  //   }
  // }
};

window.saveCitiesInLocal = saveCitiesInLocal;

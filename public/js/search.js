"use strict";
import { myCustomFetch, userId } from "./main.js";

import { populateImages, createPostCards } from "./index.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.querySelector("#search-form input");

const handleSearch = async (e) => {
  const user = e.target.value;
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const query = searchInput.value;

  const response = await myCustomFetch(`./user/?name=${user}`, requestOptions);

  console.log("fetch result:-", response);

  createPostCards(response.json());
};

searchInput.addEventListener("change", (event) => {
  event.preventDefault();
  handleSearch(event);
});

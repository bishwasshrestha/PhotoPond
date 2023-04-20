"use strict";
import { myCustomFetch, userId } from "./main.js";

import { createPostCards } from "./index.js";

const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector("#search-form input");

const handleSearch = async () => {
  const user = searchInput.value;
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //  const query = searchInput.value;
  console.log("search input =", user);
  try {
    const response = await myCustomFetch(
      `./user/?username=${user}`,
      requestOptions
    );         
    
    createPostCards(response, ".gallery")
  } catch (err) {
    console.log("search query failed!", err);
  }
};
// console.log(searchBtn);
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  handleSearch();
});

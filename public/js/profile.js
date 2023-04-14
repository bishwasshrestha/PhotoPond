"use strict";

import {
  modalClickHandler,
  userId,
  userToken,
  fetchProfileStatCount,
  myCustomFetch,
  hideContent,
  showContent,
  hideModal,
} from "./main.js";
import { populateImages } from "./index.js";

// Profile section elements
const displayPicture = document.querySelector(".profile-image");
const dpInput = document.getElementById("dpInput");
const profileAbout = document.querySelector(".profile-bio .profile-bio-only");
const profileUserName = document.querySelector(".profile-user-name");

// Edit profile form elements
const editProfileBtn = document.getElementById("edit-profile");
const editProfileForm = document.getElementById("editProfileForm");
const editProfileUsername = document.getElementById("editProfileUsername");
const editProfileEmail = document.getElementById("editProfileEmail");
const editProfileAbout = document.getElementById("editProfileAbout");

let editFormChanged = false;
const populateProfile = async (id) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + userToken,
      Accept: "application/json",
    },
  };

  const user = await myCustomFetch(`/user/${id}`, fetchOptions);

  // console.log("This is user :-", user.username);
  if (user.user_id) {
    // Check if user profile exits
    if (user.dp) {
      displayPicture.style.backgroundImage = `url(./profiles/${user.dp})`;
    } else {
      displayPicture.style.backgroundImage = `url(./images/logo.png)`;
    }

    // Check if user about exits
    if (user.bio) {
      profileAbout.textContent = user.bio;
    } else {
      profileAbout.textContent = "";
    }
    profileUserName.textContent = user.username;
  }

  editProfileBtn.addEventListener("click", async (event) => {
    editProfileUsername.value = user.username;
    editProfileEmail.value = user.email;
    if (user.bio) {
      editProfileAbout.value = user.bio;
    } else {
      editProfileAbout.value = "";
    }
  });
};

// remove signin button if loggedin
if (userToken) {
  showContent(document.querySelector(".profile"));
  hideContent(document.querySelector(".signin"));
  populateProfile(userId);
}
// remove upload button if not loggedin
if (!userToken) {
  hideContent(document.querySelector(".upload-form"));
  hideContent(document.querySelector(".profile"));
}

fetchProfileStatCount(userId, "image"); //Posts count
fetchProfileStatCount(userId, "like"); //Likes count
fetchProfileStatCount(userId, "comment"); //Comments count

// Eventlistner to catch when file added
dpInput.addEventListener("change", async (e) => {
  // Get the selected file
  const [file] = e.target.files;
  const date = Date.now();
  if (file) {
    try {
      const fd = new FormData();
      fd.append("profile", file);
      fd.append("ownerId", userId);

      const fetchOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
        },
        body: fd,
      };

      const upload = await myCustomFetch("./user/profile", fetchOptions);
      const response = await upload;

      if (response.status) {
        populateProfile(userId);
        populateImages();
      }
    } catch (err) {
      console.log("Error while profile update", err);
    }
  }
});

// Edit profile modal event handlers

const editProfileModal = document.getElementById("edit-profile-modal");

editProfileBtn.addEventListener("click", (event) => {  
  editFormChanged = false; //Set data chaged to false
  editProfileModal.style.display = "block";
});

modalClickHandler(editProfileModal);

// Check if the input has changed
editProfileForm.addEventListener("input", (event) => {
  editFormChanged = true; //Set data changed
});

editProfileForm
  .getElementsByClassName("deletebtn")[0]
  .addEventListener("click", async (event) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", editProfileUsername.value);
    urlencoded.append("email", editProfileEmail.value);
    urlencoded.append("about", editProfileAbout.value);

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userToken,
      },
      body: urlencoded,
      redirect: "follow",
    };

    // Only if input value is changed
    if (editFormChanged) {
      try {
        const result = await myCustomFetch(`./user/${userId}`, requestOptions);        

        if (result.errors) {
          result.errors.forEach((err) => {
            console.log("this is err:-", err);
            if (err.username) {
              editProfileUsername.setCustomValidity(err.username);
              editProfileUsername.reportValidity();
            }

            if (err.email) {
              editProfileEmail.setCustomValidity(err.email);
              editProfileEmail.reportValidity();
            }
          });
        } else if (result.status) {
          console.log("result.statts:-", result.status);
          populateImages();
          populateProfile(userId);
          hideModal(editProfileModal);
        }
      } catch (err) {
        console.log("Error:-", err);
      }
    } else {
      Array.from(editProfileForm.elements) // Array.from() will take an iterable object and return an array of it.
        .filter((tag) =>
          ["textarea", "input"].includes(tag.tagName.toLowerCase())
        )
        .map((element) => {
          element.setCustomValidity("Data not changed");
          element.reportValidity();
          element.className = "error";
        });
    }
  });

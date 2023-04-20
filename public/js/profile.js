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
import { createPostCards } from "./index.js";

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

// a function to display users information on profile page designated to users info. 
const populateProfile = async (id) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + userToken,
      Accept: "application/json",
    },
  };

  const user = await myCustomFetch(`/user/${id}`, fetchOptions);

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

//if user is logged in, profile is populated accordingly

if (userToken) {
  populateProfile(userId);
} else {
  location.assign("login.html");
}
//show total posts by user
fetchProfileStatCount(userId, "image");
//show total likes for user
fetchProfileStatCount(userId, "like"); //Likes count
//show total comments for user
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
  .addEventListener("click", async () => {
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

    // Only change in input value is detected the following will execute to update the database as users change
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

// Logout modal event listners
const logoutModal = document.querySelector("#id01");
modalClickHandler(logoutModal);

//on click of logot button the modal of logout is presented
document.getElementById("profile-logout-btn").addEventListener("click", () => {
  console.log("Profile logout clicked");
  showContent(logoutModal);
});

//if OK is clicked, the page wil be redirected to login page where user can login and come back to this page
logoutModal.querySelector(".deletebtn").addEventListener("click", () => {
  sessionStorage.clear();
  hideContent(logoutModal); 
});

//once everything is setup on profile page we populate the users posts under mypost div
const populatePosts = async () => {
  const posts = await myCustomFetch(`./image/images/${userId}`);
  createPostCards(posts, ".myposts");
};

populatePosts();

export { populatePosts };

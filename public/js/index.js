"use strict";

import * as main from "./main.js";

//<! HTML for Post info--===============================================================================================-->

const postData = `<div class="gallery-item-info">
    <ul>

      <li class="gallery-item-likes">        
       <i class="fas fa-heart" aria-hidden="true"></i> 
        <span id="likes-count"></span>
      </li>

      <li class="gallery-item-comments">  
        <i class="fas fa-comment" aria-hidden="true"></i> 
        <span id="comments-count"></span>
      </li>

      <p class="m-0"></p>

    </ul>
      
    </div>

    <div class="comment-section">
      <div id="posted-comments"></div>
      <form class="comment-form" method="POST">
        <textarea aria-label="Add a comment…" placeholder="Add a comment…" ></textarea>
        <button type="submit" disabled="">Post</button>
      </form>
    </div>

    <div class="modal">
      <span class="close" title="Close Modal">×</span>
      <form class="modal-content">
        <div class="container"> 
          <h1>Delete</h1>
          <p>Are you sure you want to Delete?</p>
        
          <div class="clearfix">
            <button class="cancelbtn" type="button">Cancel</button>
            <button class="deletebtn" type="button">Delete</button>
          </div>
        </div>
      </form>
    </div>
  </div>`;

//Populate each cards
const createPostCards = (posts) => {
  document.querySelector(".gallery").innerHTML = "";
  posts.forEach((post, i) => {
    document.querySelector(".gallery").insertAdjacentHTML(
      "beforeend",
      // Each gallery div is assigned with unique id with index number 'image-index-${i}'
      `<div id="image-index-${i}" class="gallery-item" tabindex=${i}>
        
        <div class="chip">
          <img class="dpPost" src="./profiles/${post.dp}"  alt="Person" width="96" height="96">
          ${post.username}
          <i  id="trash" class="fa fa-trash" aria-hidden="true"></i>
        </div>


        <img src="./uploads/${post.imagename}" class="gallery-image" alt="" />
        
        ${postData}

      </div>`
    );

    const imageWithIndex = document.getElementById(`image-index-${i}`);
    const galleryItemInfo =
      imageWithIndex.getElementsByClassName("gallery-item-info")[0];
    const commentSection =
      imageWithIndex.getElementsByClassName("comment-section")[0];

    /*getElementById() is only available as a method of the global document object,
     and not available as a method on all element objects in the DOM.*/

    const likeBtn = galleryItemInfo.querySelector(".fa-heart");
    const commentBtn = galleryItemInfo.querySelector(".fa-comment");
    const postedComments = commentSection.querySelector("#posted-comments");
    const commentInputField =
      commentSection.getElementsByTagName("textarea")[0];

    const postUplodedTime = galleryItemInfo.getElementsByClassName("m-0")[0];

    // Attach posted time for each post when loded first time
    const date = new Date(post.creation_date);
    postUplodedTime.innerText = main.timeAgo(date);

    // Update posted time for each post every timeinterval
    main.updateTimeInterval(postUplodedTime, post.creation_date);

    // Only owner of the post allowed to delete
    if (main.userId === post.owner_id) {
      main.showContent(imageWithIndex.querySelector(`.chip i`));
    }

    // Populate Likes on each post
    // When like button is clicked
    likeBtn.addEventListener("click", (e) => {
      //check if logged in.
      if (main.userToken) {
        if (likeBtn.style.color != "red") {
          fetchLikes("POST", "add", post.image_id);
          likeBtn.style.color = "red";
        } else {
          fetchLikes("DELETE", "remove", post.image_id);
          likeBtn.style.color = "#b1b5a4";
        }
      } else {
        alert("Please login!");
        window.location.assign("./login.html");
      }
    });

    // Fetch likes of a post from backend for all users
    const getLikes = async (imageId) => {
      const likeCount = imageWithIndex.querySelector(`#likes-count`);
      const like = await main.myCustomFetch(`./like/${imageId}`);

      if (like.likes_count) {
        likeCount.innerHTML = like.likes_count;
      } else {
        likeCount.innerHTML = "";
      }
    };

    // Fetch likes from backend for specific user only (Logged in user)
    const fetchLikes = async (myMethod, route, imageId) => {
      var urlencoded = new URLSearchParams();
      urlencoded.append("userId", main.userId);
      urlencoded.append("imageId", imageId);

      const fetchOptions = {
        method: myMethod,
        headers: {
          Authorization: "Bearer " + main.userToken,
        },
        body: urlencoded,
        redirect: "follow",
      };
      const like = await main.myCustomFetch(`./like/${route}/`, fetchOptions);

      if (like.message) {
        getLikes(imageId);
        main.fetchProfileStatCount(main.userId, "like");
      }
      if (like.status) {
        const image = like.status.image_id;
        likeBtn.style.color = "#b1b5a4";
      }
    };

    // Populate comments on each post

    //Slide down & up comment section
    commentBtn.addEventListener("click", (e) => {
      if (main.userToken) {
        main.slideToggle(commentSection);
      } else {
        alert("Please log in!");
        window.location.assign("./login.html");
      }
    });

    const createComments = async (comments) => {
      postedComments.innerHTML = "";
      const comments_count = comments?.filter(
        (comment) => comment.image_id == post.image_id
      ).length;

      comments.forEach((comment) => {
        const timeStamp = new Date(comment.time_stamp);
        const listItem = `
        <div class="comment-heading">
            <div class="comment-info">
              <a href="#" class="comment-author">${comment.username}</a>
              <p id=${comment.comment_id} class="m-0">
              ${main.timeAgo(timeStamp)}
              </p>
          </div>
        </div>

          <div class="comment-body">
            <p> ${comment.content}</p>
          </div>`;
        postedComments.insertAdjacentHTML("afterbegin", listItem);

        // update time for each comment
        const comments = postedComments.querySelectorAll(`.m-0`);
        Array.from(comments).map((element) => {
          if (element.id == comment.comment_id) {
            main.updateTimeInterval(element, comment.time_stamp);
          }
        });

        // If more than one comment update comment element
        if (comments_count) {
          imageWithIndex.querySelector(`#comments-count`).innerText =
            comments_count;
        }
      });
    };

    // Fetch comments of a post from backend for all users
    const getComments = async (id) => {
      const comments = await main.myCustomFetch(`./comment/${id}`);
      createComments(comments);
      // fetchProfileStatCount(userId, "comment");
    };

    //Validate the comment input is not blank
    commentInputField.addEventListener("keyup", (event) => {
      const inputVal = commentInputField.value;

      if (inputVal != "") {
        commentSection.querySelector(`button`).disabled = false;
      } else {
        commentSection.querySelector(`button`).disabled = true;
      }
    });

    // When comment is posted
    commentSection
      .getElementsByTagName("form")[0]
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const urlencoded = new URLSearchParams();
        urlencoded.append("content", commentInputField.value);
        urlencoded.append("userId", main.userId);
        urlencoded.append("imageId", post.image_id);

        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + main.userToken,
          },
          body: urlencoded,
          redirect: "follow",
        };
        const result = await main.myCustomFetch("./comment/", requestOptions);
        if (result.message) {
          commentInputField.value = "";
          commentSection.querySelector(`button`).disabled = true;
          getComments(post.image_id);
        }
      });

    // show image when a post is clicked
    const galleryItem = imageWithIndex.querySelector(`.gallery-image`);
    const clickedImage = document.getElementById("show-image");
    galleryItem.addEventListener("click", () => {
      //Get original image URL
      const imgUrl = `./uploads/${post.imagename}`;

      //Open clicked image
      main.modalClickHandler(clickedImage);
      clickedImage.style.display = "block";
      clickedImage.querySelector("#image").src = imgUrl;
    });

    // When clicked on the trash icon
    const deleteModal = imageWithIndex.querySelector(".modal");

    imageWithIndex
      .querySelector(`#trash`)
      .addEventListener("click", (event) => {
        if (!main.userToken) {
          alert("Please log in!");
          window.location.assign("./login.html");
        } else {
          main.showContent(deleteModal); // delete picture modal
        }
      });

    main.modalClickHandler(deleteModal);

    // When trash icon is pressed, DELETE a post/image

    deleteModal
      .querySelector(".deletebtn")
      .addEventListener("click", async (event) => {
        event.preventDefault();

        const fetchOptions = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + main.userToken,
          },
        };
        if (post.owner_id == main.userId) {
          const deleteRes = await main.myCustomFetch(
            `./image/${post.image_id}`,
            fetchOptions
          );

          if (deleteRes.status) {
            populateImages();
            main.fetchProfileStatCount(main.userId, "image");
            main.fetchProfileStatCount(main.userId, "like");
            main.fetchProfileStatCount(main.userId, "comment");
            main.hideContent(deleteModal);
          }
        } else {
          main.hideContent(deleteModal);
          alert("Permission denined!");
        }
      });

    //When page is loaded
    getComments(post.image_id); //Get all the comments
    getLikes(post.image_id); //Get all the likes

    // Like and Comment allowed only when logged in
    if (!main.userId) {
      likeBtn.disabled = true;
      commentBtn.disabled = true;
    } else {
      likeBtn.disabled = false;
      commentBtn.disabled = false;
      fetchLikes("POST", "status", post.image_id); //Get the staus of like button
    }
  });
};

// Fetch all the posts and populate them
const populateImages = async () => {
  const images = await main.myCustomFetch("./image/");
  createPostCards(images);
};

populateImages(); // call this when loaded

// Eventlistner to reflect file name
document.getElementById("fileInput").addEventListener("change", (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);

  document.getElementById("fileLabel").innerText = fileName;
  return file;
});
// submit upload image

document
  .querySelector(".upload-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append("image", document.getElementById("fileInput").files[0]);
    fd.append("ownerId", main.userId);

    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + main.userToken,
      },
      body: fd,
    };

    const result = await main.myCustomFetch("./image/", fetchOptions);

    if (result.status) {
      document.getElementById("fileLabel").innerText = "Upload";
      document.querySelector(".upload-form").reset();
      populateImages();
      main.fetchProfileStatCount(main.userId, "image");
    }
  });

// Logout modal event listners
const logoutModal = document.getElementById("id01");

document
  .getElementById("profile-logout-btn")
  .addEventListener("click", (event) => {
    console.log("Profile logout clicked");
    main.showContent(logoutModal);
    document.getElementById("deletebtn").addEventListener("click", () => {
      event.preventDefault();
      console.log("logout");
      sessionStorage.clear();
      location.reload();
      hideContent(logoutModal);
    });
  });

main.modalClickHandler(logoutModal);

logoutModal.querySelector(".deletebtn").addEventListener("click", (event) => {
  event.preventDefault();
  sessionStorage.clear();
  location.reload();
  hideContent(logoutModal);
});

export { populateImages, createPostCards };

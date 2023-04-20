import * as main from "./main.js";
import { populatePosts } from "./profile.js";

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
      populatePosts();
      main.fetchProfileStatCount(main.userId, "image");
    }
  });

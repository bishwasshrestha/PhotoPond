"use strict";
import pool from "../db/database.js";

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const getAllImages = async () => {
  try {
    // query database using promises
    const [rows] = await promisePool.execute(
      "SELECT * FROM `image` INNER JOIN `user` ON image.owner_id = user.user_id ORDER BY `creation_date` DESC;"
    );
    return rows;
  } catch (e) {
    console.log("Could not retrieve images, Error:", e);
  }
};

const getImageById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM `image` WHERE `image_id`=?",
      [id]
    );
    return rows;
  } catch (err) {
    console.log("Getting post with id failed, Error:", err);
  }
};

const getTotalPostsByUser = async (user) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT count(*) as count FROM `image`  JOIN `user` ON image.owner_id = user.user_id WHERE `owner_id` = ?;",
      [user]
    );
    return rows;
  } catch (err) {
    console.log("Getting post count from user failed, Error:", err);
  }
};
const getAllImagesByUser = async (user) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM `image` INNER JOIN `user` ON image.owner_id = user.user_id WHERE `owner_id` = ?",
      [user]
    );    
    return rows;
  } catch (err) {
    console.log("Getting all image from user failed!");
  }
};

const postImage = async (data) => {
  console.log("This is data:-", data);
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO `image` (`imagename`,`owner_id`) VALUES (?,?)",
      data
    );
    return rows;
  } catch (err) {
    console.log("Could not post, Error:", err);
  }
};

const deleteImage = async (id) => {
  try {
    const result = await promisePool.execute(
      "DELETE FROM `image` WHERE `image_id`=?",
      [id]
    );  
  } catch (err) {
    console.log("Could not delete, Error:", err);
  }
};

export {
  getAllImages,
  getImageById,
  postImage,
  deleteImage,
  getTotalPostsByUser,
  getAllImagesByUser,
};

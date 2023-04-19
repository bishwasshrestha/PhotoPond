"use strict";
import * as model from "../models/imageModels.js";

const getImagesList = async (req, res) => {
  const posts = await model.getAllImages();
  // Rest in Object Destructuring to get all the properties of image with image owner except owner password
  const images = posts.map(({ password, ...post }) => post);
  res.json(images);
};

const getImageWithID = async (req, res) => {
  const id = req.params.id;
  const image = await model.getImageById(id);
  res.json(image);
};

const getTotalPostsByUser = async (req, res) => {
  const id = req.params.userId;
  const [posts] = await model.getTotalPostsByUser(id);
  res.json(posts);
};

const getAllImagesByUser = async (req, res) => {
  const id = req.params.userId;  
  const posts = await model.getAllImagesByUser(id);
  const images = posts.map(({ ...post }) => post);
  res.json(images);
};

const uploadImage = async (req, res) => {
  try {
    const data = [req.file.filename, req.body.ownerId];
    await model.postImage(data);
    res.send({ status: "insert ok" });
  } catch (err) {
    console.log("Upload failed, Error:", err);
  }
};

const deletePost = async (req, res) => {

  try {
    const id = req.params.id;
    await model.deleteImage(id);
    res.json({ status: "Sucessfully deleted" });
  } catch (err) {
    console.log("Could not delete, Error:", err);
  }
};

export {
  getImagesList,
  getImageWithID,
  uploadImage,
  deletePost,
  getTotalPostsByUser,
  getAllImagesByUser,
};

import UniversityModel from "../models/University.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


//Create University
export const CreateUniversity = async (req, res) => {
  try {
    const univData = await UniversityModel.create({
      name: req.body.name,
      image: req?.file?.filename,
    });
    if (univData) res.status(201).send({ message: "University Created!!" });
    else res.status(404).send({ message: "Unable to Create University!!" });
  } catch (error) {
    console.log("Fail to Submit Data!!");
  }
};

//Update University
export const UpdateUniversity = async (req, res, baseDir) => {
  try {
    const university = await UniversityModel.findById(req.body.id);
    if (!university) {
      return res.status(404).send({ message: "University not found!" });
    }

    let updatedImage = university.image;

    // If new image uploaded, delete old one
    if (req.file) {
      const oldImagePath = path.join(baseDir, "uploadsUniv", university.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updatedImage = req.file.filename;
    }

    // Update the document
    const updatedUniversity = await UniversityModel.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
        image: updatedImage,
      },
      { new: true }
    );

    if (updatedUniversity) {
      res.status(200).send({ message: "University Updated!!" });
    } else {
      res.status(404).send({ message: "Unable to Update University!!" });
    }

  } catch (error) {
    console.error("Fail to update university:", error);
    res.status(500).send({ message: "Error updating university." });
  }
};


//Delete University
// export const DeleteUniversity = async (req, res) => {
//   try {
//     const univData = await UniversityModel.deleteOne({ _id: req.body.id });


//     if (univData) res.status(200).send({ message: "University Deleted!!" });
//     else res.status(404).send({ message: "Unable to Delete University!!" });
//   } catch (error) {
//     console.log("Fail to Submit Data!!");
//   }
// };
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DeleteUniversity = async (req, res) => {
  try {
    const university = await UniversityModel.findById(req.body.id);
    if (!university) {
      return res.status(404).send({ message: "University not found!" });
    }

    // Delete image from filesystem
    const imagePath = path.join(__dirname, "../uploadsUniv", university.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete university from DB
    await UniversityModel.deleteOne({ _id: req.body.id });
    res.status(200).send({ message: "University Deleted!!" });
  } catch (error) {
    console.error("Fail to delete university:", error);
    res.status(500).send({ message: "Error deleting university" });
  }
};


//Get Universities
export const GetUniversities = async (req, res) => {
  try {
    const univData = await UniversityModel.find();
    res.status(200).send({ univData });
  } catch (error) {
    console.log("Fail to Submit Data!!");
    }
};

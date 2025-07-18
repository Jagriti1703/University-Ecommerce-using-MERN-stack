import DepartmentModel from "../models/Department.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

//Create Department
export const CreateDepartment = async (req, res) => {
  try {
    const depData = await DepartmentModel.create({
      name: req.body.name,
      image: req?.file?.filename,
      university: req.body.universityId,
    });
    if (depData) res.status(201).send({ message: "Department Created!!" });
    else res.status(404).send({ message: "Unable to create Department!!" });
  } catch (error) {
    console.log("Fail to Submit Data!!");
  }
};

//Update Department
// export const UpdateDepartment = async (req, res) => {
//   try {
//     const depData = await DepartmentModel.findByIdAndUpdate(
//       { _id: req.body.id },
//       {
//         name: req.body.name,
//         image: req?.file?.filename,
//         university: req.body.universityId,
//       }
//     );
//     if (depData) res.status(200).send({ message: "Department Updated!!" });
//     else res.status(404).send({ message: "Unable to Update Department!!" });
//   } catch (error) {
//     console.log("Fail to Submit Data!!");
//   }
// };
export const UpdateDepartment = async (req, res, baseDir) => {
  try {
    const department = await DepartmentModel.findById(req.body.id);
    if (!department) {
      return res.status(404).send({ message: "Department not found!" });
    }

    let updatedImage = department.image;

    // If new image uploaded, delete old one
    if (req.file) {
      const oldImagePath = path.join(baseDir, "uploadsDep", department.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updatedImage = req.file.filename;
    }

    // Update the document
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
        image: updatedImage,
      },
      { new: true }
    );

    if (updatedDepartment) {
      res.status(200).send({ message: "Department Updated!!" });
    } else {
      res.status(404).send({ message: "Unable to Update Department!!" });
    }

  } catch (error) {
    console.error("Fail to update Department:", error);
    res.status(500).send({ message: "Error updating Department." });
  }
};

//Delete Department
// export const DeleteDepartment = async (req, res) => {
//   try {
//     const depData = await DepartmentModel.deleteOne({ _id: req.body.id });
//     if (depData) res.status(200).send({ message: "Department Deleted!!" });
//     else res.status(404).send({ message: "Unable to Delete Department!!" });
//   } catch (error) {
//     console.log("Fail to Submit Data!!");
//   }
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DeleteDepartment = async (req, res) => {
  try {
    const department = await DepartmentModel.findById(req.body.id);
    if (!department) {
      return res.status(404).send({ message: "Department not found!" });
    }

    // Delete image from filesystem
    const imagePath = path.join(__dirname, "../uploadsDep", department.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete department from DB
    await DepartmentModel.deleteOne({ _id: req.body.id });
    res.status(200).send({ message: "Department Deleted!!" });
  } catch (error) {
    console.error("Fail to delete department:", error);
    res.status(500).send({ message: "Error deleting department" });
  }
};

//GetDepartmentsBuUniversityId
export const GetDepartmentsByUniversity = async (req, res) => {
  try {
    const depData = await DepartmentModel.find({
      university: req.query.universityId,
    }).populate("university");  
    res.status(200).send({ depData });
  } catch (error) {
    console.log("Fail to Submit Data!!");
  }
};

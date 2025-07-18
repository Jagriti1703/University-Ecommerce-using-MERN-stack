  import jwt from 'jsonwebtoken';
  import bcrypt from 'bcryptjs';
  import UserModel from "../models/User.js";

  // Register
  export const Register = async (req, res) => {
    try {
      let userInDb = await UserModel.findOne({ email: req.body.email });
      if (userInDb) {
        return res.status(400).send({ message: "User already exists with this email!" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let userData = await UserModel.create({
        ...req.body,
        password: hashedPassword,
        profilePic: req?.file?.filename,
      });

      if (userData) {
        // Create token
        const token = jwt.sign(
          { id: userData._id, email: userData.email, role: userData.role },
          process.env.JWT_SECRET,
          { expiresIn: '7h' }
        );
      
        res.status(200).send({ 
          message: "User created successfully!", 
          token 
        });
      } else {
        res.status(400).send({ message: "Unable to create user" });
      }
    } catch (e) {
      res.status(500).send({ error: e?.message });
    }
  };

  // Login
  export const Login = async (req, res) => {
    try {
      let userInDb = await UserModel.findOne({ email: req.body.email });
      if (!userInDb) {
        return res.status(404).send({ message: "User not found!" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(req.body.password, userInDb.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid credentials!" });
      }

      // Create token
      const token = jwt.sign(
        { id: userInDb._id, email: userInDb.email, role: userInDb.role },
        process.env.JWT_SECRET,
        { expiresIn: '7h' }
      );
  console.log("Generated JWT:", token);

      res.status(200).send({ 
        message: "Login successful!", 
        token,
        id: userInDb._id,
        role: userInDb.role 
      });
    } catch (e) {
      res.status(500).send({ error: e?.message });
    }
  };

  // import UserModel from "../models/User.js";

  // //Register
  // export const Register = async (req, res) => {
  //   try {
  //     let userInDb = await UserModel.findOne({
  //       email: req.body.email,
  //     });
  //     if (userInDb) {
  //       res.status(404).send({ message: "User already Created with this E-mail!!" });
  //       return;
  //     }
  //     let userData = await UserModel.create({
  //       ...req.body,
  //       profilePic: req?.file?.filename,
  //     });
  //     if (userData) res.status(200).send({ message: "User Created!!" });
  //     else res.status(404).send({ message: "Unable to Create User!!" });
  //   } catch (e) {
  //     res.status(404).send({ error: e?.message });
  //   }
  // };

  // //Login
  // export const Login = async (req, res) => {
  //   try {
  //     let userInDb = await UserModel.findOne({
  //       email: req.body.email,
  //       password: req.body.password,
  //     });
  //     if (userInDb) res.status(200).send({ message:"Login Successful!!",id:userInDb._id,role:userInDb.role });
  //     else res.status(404).send({ message: "Wrong Username or Password!!" });
  //   } catch (e) {
  //     res.status(400).send({ error: e?.message });
  //   }
  // };

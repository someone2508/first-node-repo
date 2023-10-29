const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.join(process.cwd(), "/data/users.json");

function readFileContent() {
  return new Promise((resolve, reject) => {
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      console.log(err);
      console.log(data);
      if (err) reject(`Error encountered while read file content! ${err}`);
      else resolve(JSON.parse(data));
    });
  });
}

function writeFileContent(content) {
  return new Promise((resolve, reject) => {
    content = JSON.stringify(content);
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(`Error encountered while read file content! ${err}`);
      else resolve();
    });
  });
}

router.get("/api/v1/user", async (req, res, next) => {
  try {
    console.log("Line 30");
    const users = await readFileContent();
    console.log(users);
    res.status(200).json({
      message: "Users retrived successfully!",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some error occured, please check the logs!",
    });
  }
});

router.get("/api/v1/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params; // {id}
    const users = await readFileContent(); // [{}, {}, {}, {}]

    const foundUser = users.find((eUser) => eUser.id == id); // []
    console.log(foundUser);

    if (!foundUser)
      return res.status(404).json({
        message: "User with the given id not found!",
      });

    res.status(200).json({
      message: "User with the given id found!",
      data: foundUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some error occured, please check the logs!",
    });
  }
});

router.post("/api/v1/user", async (req, res, next) => {
  try {
    const { name, email, contactNo } = req.body;

    if (!name || !email || !contactNo)
      return res.status(401).json({
        message:
          "name, email and contactNo are required to register a new user!",
      });

    const users = await readFileContent();

    const user = users.find(
      (e) => e.email == email || e.contactNo == contactNo
    );

    if (user)
      return res.status(401).json({
        message: "Email and contactNo should be unique",
      });

    users.push({
      id: uuidv4(),
      name,
      email,
      contactNo,
    });

    await writeFileContent(users);

    res.status(201).json({
      message: "new user was created!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occured, please check the logs!",
    });
  }
});

router.patch("/api/v1/user", async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log(id);
    if (!id)
      return res.status(401).json({
        message: "Id is a required field to update the user details!",
      });

    let updateObj = {}; // {contactNo: 5555555555}

    const users = await readFileContent();

    const user = users.find((e) => e.id == id);

    if (!user)
      return res.status(404).json({
        message: "user with the given userId not found!",
      });

    if (req.body.name) updateObj.name = req.body.name;

    if (req.body.contactNo) {
      // check if contactNo is unqiue;
      const foundUser = users.find(
        (e) => e.id !== id && e.contactNo == req.body.contactNo
      );
      if (foundUser)
        return res.status(401).json({
          message: "User with the same contactNo already exists!",
        });

      updateObj.contactNo = req.body.contactNo;
    }

    if (req.body.email) {
      // check if email is unqiue
      const foundUser = users.find(
        (e) => e.id != id && e.email == req.body.email
      );

      if (foundUser)
        return res.status(401).json({
          message: "User with the same email already exists!",
        });

      updateObj.email = req.body.email;
    }

    if (Object.keys(updateObj).length === 0)
      return res.status(401).json({
        message: "no update details found!",
      });

    Object.assign(user, updateObj);

    await writeFileContent(users);

    res.status(200).json({
      message: "User details updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some error occured, please check the logs!",
    });
  }
});

router.delete("/api/v1/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(401).json({
        message: "id is a required field to delete a user!",
      });

    const users = await readFileContent();

    const user = users.find((e) => e.id === id);

    if (!user)
      return res.status(404).json({
        message: "user with the given userId not found!",
      });

    const idx = users.indexOf(user);

    users.splice(idx, 1);

    await writeFileContent(users);

    return res.status(200).json({
      message: "user deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some error occured, please check the logs!",
    });
  }
});

module.exports = router;

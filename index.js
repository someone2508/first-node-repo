const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const PORT = 3000;
const IMP_ROLES = ["CEO", "CTO", "CFO", "DIRECTOR"];

// this will parse the req data and store it in req.body
app.use(bodyParser.json());

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

// custom middleware to check users auth
app.use((req, res, next) => {
  // if (req.body.password === "SOME_SECRET_CODE") {
  //   next();
  // }
  // return res.status(401).json({
  //   message: "user is not authorised!",
  // });

  console.log("Hi i am your cute little first middleware!");
  next();
});

app.use(
  (req, res, next) => {
    console.log("Hello i am the second middleware!");
    next();
  },
  (req, res, next) => {
    console.log("Hi i am your third middleware!");
    next();
  }
);

let employees = []; // {empId, name, role, email}

app.get("/employee", (req, res, next) => {
  console.log("1st controller!");
  // res.status(200).send("Done!");
  next();
});

// get api to retrive all employee details
app.get("/employee", (req, res, next) => {
  console.log("/employee get api starts fetching the data!");
  res.status(200).json({
    message: "employee data retrived successfully!",
    data: employees,
  });
});

app.post("/employee", (req, res) => {
  const body = req.body;
  console.log("Post /employee api!");

  //   check for all required data
  if (!body.name || !body.email || !body.role) {
    return res.status(400).json({
      message:
        "name, email and role are required to create an employee record!",
    });
  }

  // check for unique email
  const emp = employees.find((e) => e.email === body.email);

  if (emp)
    return res.status(400).json({
      message: "an employee with the same email already exists!",
    });

  const newEmp = {
    empId: uuidv4(),
    name: body.name,
    role: body.role,
    email: body.email,
  };

  employees.push(newEmp);

  res.status(201).json({
    message: "new employee with the given details was created!",
  });
});

// [
//   {
//     name: "sanjay",
//     role: "analyst",
//     email: "sanjay@gmail.com",
//   },
//   {
//     name: "sarfaraz",
//     role: "sde",
//     email: "sarfaraz@gmail.com",
//   },
// ];

app.patch("/employee", (req, res) => {
  const body = req.body; // {name, empId}       // {name: "sanjayrokz", email: "sanjay@gmail.com"}

  // if an employee with the given empId exists?
  const empIdx = employees.findIndex((e) => e.empId === body.empId); // 0

  if (empIdx === -1)
    return res.status(404).json({
      message: "employee with the given empId not found!",
    });

  if (body.email) {
    // is the email is email unqiue? if not send an error.
    const sameEmailEmp = employees.find((eEmp, idx) => {
      if (idx === empIdx) return false;
      return eEmp.email === body.email;
    });

    if (sameEmailEmp) {
      return res.status(400).json({
        message:
          "Employee with the same email already exists. please add unqiue email!",
      });
    }
  }

  let updateObj = {};

  if (body.email) updateObj.email = body.email;
  if (body.name) updateObj.name = body.name;
  if (body.role) updateObj.role = body.role;

  employees[empIdx] = {
    ...employees[empIdx],
    ...updateObj,
  };

  res.status(200).json({
    message: "given employee details were updated sucessfully!",
  });
});

app.delete("/employee", (req, res) => {
  const body = req.body;

  const empIdx = employees.findIndex((e) => e.empId === body.empId);

  if (empIdx === -1)
    return res.status(404).json({
      message: "employee with the given empId not found!",
    });

  const emp = employees[empIdx];

  if (IMP_ROLES.includes(emp.role))
    return res.status(403).json({
      message: "Access denied!",
    });

  employees.splice(empIdx, 1);

  res.status(200).json({
    message: "the employee with the given empId is deleted!",
  });
});

app.get("/employee/:id", (req, res) => {
  // /employe/sanjay/mitreja
  const { id } = req.params; // {fname: sanjay, lname: mitreja}

  const emp = employees.find((e) => e.empId === id);

  if (!emp)
    return res.status(404).json({
      message: "employee with the given empId not found!",
    });

  return res.status(200).json({
    message: "employee with the given empId is found!",
    data: emp,
  });
});

app.use(productRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});

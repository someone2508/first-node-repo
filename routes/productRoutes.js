const express = require("express");

const router = express.Router();

const fs = require("fs");
const path = require("path");

console.log(process.cwd());
const filePath = path.join(process.cwd(), "/data/products.json");

const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// router.post('/product', (req, res, next) => {
//     // logic
//     next();
// });

router.get("/product", (req, res, next) => {
  res.status(200).json({
    data: products,
  });
});

router.post("/product", (req, res, next) => {
  res.status(200).json({
    data: products,
  });
});

router.patch("/product", (req, res, next) => {
  res.status(200).json({
    data: products,
  });
});

router.get("/product/:id", (req, res, next) => {
  const { id } = req.params;

  const prod = products.find((e) => e.id == id);

  if (!prod)
    return res.status(404).json({
      message: "product with given id not found!",
    });

  res.status(200).json({
    message: "product retrived successfully!",
    data: prod,
  });
});

module.exports = router;

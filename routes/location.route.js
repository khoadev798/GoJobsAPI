const express = require("express");
const route = express.Router();
const fetch = require("node-fetch");

let handleErrors = (res) => {
  if (!res.ok) {
    throw new Error("Request failed " + res.statusText);
  }
  return res;
};
//Lấy về toàn bộ danh mục Tỉnh/Thành phố
route.get("/city", async (req, res) => {
  let listCity = await fetch("https://thongtindoanhnghiep.co/api/city")
    .then(handleErrors)
    .then((res1) => res1.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  let list = [];
  let cityList = [];
  list = listCity.LtsItem;
  list.forEach((title) => {
    cityList.push({ title: title.Title, ID: title.ID });
  });
  let endList = await Promise.all(cityList).then((values) => {
    return values;
  });
  res.send(endList);

});

//Lấy về chi tiết một Tỉnh/Thành phố
route.get("/city/:id", (req, res) => {
  let { id } = req.params;
  console.log(id);
  fetch(`https://thongtindoanhnghiep.co/api/city/${id}`)
    .then(handleErrors)
    .then((res1) => res1.json())
    .then((data) => {
      console.log("Thong tin 1 TP", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
//Lấy về toàn bộ Quận/Huyện theo Tỉnh/Thành phố
route.get("/city/:id/district", async (req, res) => {
  let { id } = req.params;
  let listDistrict = await fetch(`https://thongtindoanhnghiep.co/api/city/${id}/district`)
    .then(handleErrors)
    .then((res1) => res1.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      res.status(400).send(err);
    });
    let list = [];
    let districtList = [];
    list = listDistrict;
    list.forEach((title) => {
      districtList = districtList.concat(title.Title);
    });
    let endList = await Promise.all(districtList).then((values) => {
      return values;
    });
    res.send(endList);
});
//Lấy về chi tiết một Quận/Huyện
route.get("/district/:id", (req, res) => {
  let { id } = req.params;
  console.log(id);
  fetch(`https://thongtindoanhnghiep.co/api/district/${id}`)
    .then(handleErrors)
    .then((res1) => res1.json())
    .then((data) => {
      console.log("Thong tin quan huyen", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
//Lấy về toàn bộ phường, xã & thị trấn thuộc Quận/Huyện
route.get("/disitrct/:id/ward", (req, res) => {
  let { id } = req.params;
  console.log(id);
  fetch(`https://thongtindoanhnghiep.co/api/district/${id}/ward`)
    .then(handleErrors)
    .then((res1) => res1.json())
    .then((data) => {
      console.log("DS Phuong xa", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
//Lấy về chi tiết phường, xã, thị trấn
route.get("/disitrct/ward/{int:id}", (req, res) => {
  let { id } = req.params;
  console.log(id);
  fetch(`https://thongtindoanhnghiep.co/api/ward/${id}`)
    .then(handleErrors)
    .then((res1) => res1.json())
    .then((data) => {
      console.log("Thong tin phuong xa", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
module.exports = route;

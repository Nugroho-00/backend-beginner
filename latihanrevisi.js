const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", (request, response) => {
  response.send("Welcome to my first backend!!!")
});

app.post("/data", (request, response) => {
  console.log(request.body)
  response.send('Oke');
});

app.post("/profile", (request, response) => {
  response.send(request.body)
});

let data = {
  nama: "jane",
  batch: "17.2",
  email: "janedoe@mail.com"
};

app.patch("/profile", (request, response) => {
  data = {
    ...data, ...request.body
  }
  response.send(data)
})

app.put("/profile", (request, response) => {
  const { nama, batch, email } = request.body
  if (nama && batch && email) {
    data = {
      ...request.body
    }
    response.send(data)
  } else {
    response.send({
      success: false,
      message: "All form must be filled"
    })
  }
})

app.get("/profile", (request, response) => {
  response.send(data)
})

app.delete("/profile", (request, response) => {
  data = null,
    response.send(data)
})

app.listen(3030, () => {
  console.log("Server listening on port http://localhost:3030")
})
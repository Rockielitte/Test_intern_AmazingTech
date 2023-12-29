const { default: axios } = require("axios");
const jsonServer = require("json-server");
const { jwtDecode } = require("jwt-decode");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const _ = require("lodash");
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// // Add custom routes before JSON Server router
// server.get("/echo", (req, res) => {
//   res.jsonp(req.query);
// });

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
// server.use((req, res, next) => {
//   if (req.method === "POST") {
//     req.body.createdAt = Date.now();
//   }
//   // Continue to JSON Server router
//   next();
// });
// Use default router
const baseUrl = "http://localhost:4000/";
server.put("/tasks/:id/assignments", async (req, res) => {
  console.log("==========");
  const body = { ...req.body };
  delete body["assignments"];
  console.log(body);
  await axios
    .delete(baseUrl + `tasks/${req.params.id}`)
    .then((res) => {})
    .catch((err) => {
      throw err;
    });
  await axios
    .post(baseUrl + `tasks`, body)
    .then((res) => {})
    .catch((err) => {
      throw err;
    });
  function insert(db, collection, data) {
    const table = db.get(collection);
    if (_.isEmpty(table.find(data).value())) {
      table.push(data).write();
    }
  }
  const db = router.db; // Assign the lowdb instance
  if (Array.isArray(req.body.assignments)) {
    req.body.assignments.forEach((element) => {
      insert(db, "assignments", element); // Add a post
    });
  } else {
    insert(db, "assignments", req.body.assignments); // Add a post
  }
  return res.json("oke").status(200);
});
server.get("/login", async (req, res) => {
  const credential = req.query.credential;
  const decoded = jwtDecode(credential);
  if (decoded.email) {
    console.log();
    const result = await axios.get(baseUrl + `accounts?email=${decoded.email}`);
    if (!result?.data.length) {
      return res.status(401).json("Unauthorized");
    } else if (
      decoded.email == "truongquang2121@gmail.com" ||
      decoded.email == "minhquando43730@gmail.com"
    )
      return res.status(200).json({
        ...result.data[0],
        role: "admin",
      });
    else
      return res.status(200).json({
        ...result.data[0],
        role: "user",
      });
  }

  return res.status(404).json("Google login failed");
});
server.post("/tasks/assignments", async (req, res) => {
  console.log("==========");
  const body = { ...req.body };
  delete body["assignments"];
  console.log(body);
  await axios
    .post(baseUrl + `tasks`, body)
    .then((res) => {})
    .catch((err) => {
      throw err;
    });
  function insert(db, collection, data) {
    const table = db.get(collection);
    if (_.isEmpty(table.find(data).value())) {
      table.push(data).write();
    }
  }
  const db = router.db; // Assign the lowdb instance
  if (Array.isArray(req.body.assignments)) {
    req.body.assignments.forEach((element) => {
      insert(db, "assignments", element); // Add a post
    });
  } else {
    insert(db, "assignments", req.body.assignments); // Add a post
  }
  return res.json("oke").status(200);
});
server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running");
});

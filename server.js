const app = require("./app");
const DB = "mongodb://localhost:27017/artOfFinance";
const mongoose = require("mongoose");

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB Connection Successfull");
  });

app.listen(3000, () => {
  console.log(`Server Started on PORT ${3000}`);
});

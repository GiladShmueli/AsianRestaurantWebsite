const express = require("express");
const path = require("path");

const port = 3200;
const app = express();


app.use("/assets", express.static("static-assets"));
app.use("/js", express.static("static-assets/js"));
app.use("/css", express.static("static-assets/css"));


app.get('/', (req, res) => {
    res.sendFile(path.resolve("homepage.html"));
})

app.get('/order/', (req, res) => {
    res.sendFile(path.resolve("products.html"));
})

app.get('/checkout/', (req, res) => {
    res.sendFile(path.resolve("checkout.html"));
})

app.get('/view-orders/', (req, res) => {
    res.sendFile(path.resolve("orders.html"));
})

app.listen(process.env.PORT || port);
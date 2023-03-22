const { createApp } = require("./app");
const { startServer } = require("./server");
const express = require("express");

(async () => {
  const app = createApp();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World!!");
  });

  startServer(app);
})().catch((err) => {
  console.error(err);
});

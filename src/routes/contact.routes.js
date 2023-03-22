const { Router } = require("express");
const {
  createContact,
  updateContact,
  getContact,
  deleteContact,
} = require("../controller/contact");

const contact = Router();
contact.post("/createContact", createContact);
contact.get("/getContact", getContact)
contact.post("/updateContact", updateContact);
contact.post("/deleteContact", deleteContact);


module.exports = contact;

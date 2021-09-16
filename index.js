const express = require("express");
const cors = require("cors");
const { getContacts, addContact } = require("./services/notion");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/contacts", async (req, res) => {
    const contacts = await getContacts();
    res.json(contacts);
});

app.post("/contacts", async (req, res) => {
    const addedContact = await addContact(req.body);
    res.json(addedContact);
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));

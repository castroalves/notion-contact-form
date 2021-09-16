const contactsEl = document.querySelector("#contact-list");
const loadingEl = document.querySelector("#loading");
const form = document.querySelector("#add-contact");
const btnSubmit = document.querySelector("#btn-submit");
let loading = false;

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", handleForm);
    addContactsToDom();
});

const getContactsFromBackend = async () => {
    loading = true;
    const res = await fetch("http://localhost:5000/contacts");
    const data = await res.json();
    loading = false;
    return data;
};

const addContactsToDom = async () => {
    contactsEl.innerHTML = "";

    const contacts = await getContactsFromBackend();

    if (!loading) {
        loadingEl.innerHTML = "";
    }

    contacts.forEach((contact) => {
        const div = document.createElement("div");
        div.className = "contact";
        div.innerHTML = `
        <div id="${contact.id}">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
        <p>Phone: ${contact.phone}</p>
        <p>Message: ${contact.message}</p>
        </div>
      `;
        contactsEl.appendChild(div);
    });
};

const addContact = (data) => {
    const req = new Request("http://localhost:5000/contacts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    fetch(req)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            addContactsToDom();
        })
        .catch((err) => console.error(err));
};

const handleForm = async (e) => {
    e.preventDefault();
    btnSubmit.innerHTML = "Adding contact...";
    const myForm = e.target;
    const formData = new FormData(myForm);
    const data = convertFormData2JSON(formData);
    addContact(data);
    btnSubmit.innerHTML = "Add Contact";
};

const convertFormData2JSON = (formData) => {
    let obj = {};
    for (let key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
};

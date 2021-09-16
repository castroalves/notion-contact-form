const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;

async function getContacts() {
    const payload = {
        path: `databases/${database_id}/query`,
        method: "POST",
    };

    const { results } = await notion.request(payload);

    const contacts = results.map((contact) => {
        return {
            id: contact.id,
            name: contact.properties.Name.title[0].text.content,
            email: contact.properties.Email.email,
            phone: contact.properties.Phone.phone_number,
            message: contact.properties.Message.rich_text[0].text.content,
            submitted_at: contact.properties["Submitted at"].created_time,
        };
    });

    return contacts;
}

async function addContact(data) {
    const payload = {
        parent: { database_id: database_id },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: data.name,
                        },
                    },
                ],
            },
            Email: {
                email: data.email,
            },
            Phone: {
                phone_number: data.phone,
            },
            Message: {
                rich_text: [
                    {
                        text: {
                            content: data.message,
                        },
                    },
                ],
            },
        },
    };

    const { id } = await notion.pages.create(payload);
    return id;
}

module.exports = {
    getContacts,
    addContact,
};

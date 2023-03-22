const axios = require("axios");
const CONFIG = require("../config");
const db = require("../db");
const DATASTORE_TYPES = ["CRM", "DATABASE"];

const token = CONFIG.token;
const freshwork_baseUrl = CONFIG.freshwork_baseUrl;
const freshwork_filterUrl = `${freshwork_baseUrl}/api/search`;
const freshwork_contactUrl = `${freshwork_baseUrl}/api/contacts`;

const Query = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

const getContact = async (req, res) => {
  try {
    const { contact_id, data_store } = req.body;

    if (!contact_id) {
      throw { message: `Contact id is required!` };
    }

    if (!data_store) {
      throw { message: `Datastore name is required!` };
    }

    if (!DATASTORE_TYPES.includes(data_store.toUpperCase())) {
      throw {
        message: `Incorrect data store value. It should be CRM or DATABASE!!`,
      };
    }
    let user = [];
    if (data_store.toUpperCase() === "DATABASE") {
      const query = `SELECT * FROM contacts WHERE mobile_number = ${contact_id}`;
      user = await Query(query);

      if (!user.length) {
        throw {
          message: "Contact not found in database!!",
        };
      }

      return res.status(200).send({ err: false, data: user });
    }

    const response = await axios.get(
      `${freshwork_filterUrl}?q=${contact_id}&include=contact`,
      {
        headers: {
          Authorization: `Token token=${token}`,
        },
      }
    );

    if (!response.data.length) {
      throw {
        message: "Given contact id is not present in CRM!!",
      };
    }

    return res.status(200).send({ err: false, user: response.data });
  } catch (error) {
    return res.status(400).send({
      err: true,
      message: error.message || "Something went wrong",
    });
  }
};

const createContact = async (req, res) => {
  try {
    const { first_name, last_name, email, mobile_number, data_store } =
      req.body;

    if (!first_name) {
      throw {
        message: "First name is required",
      };
    }

    if (!last_name) {
      throw {
        message: "Last name is required",
      };
    }

    if (!email) {
      throw {
        message: "Email Id is required",
      };
    }

    if (!mobile_number) {
      throw {
        message: "Mobile number is required",
      };
    }

    if (!data_store) {
      throw { message: "Datastore type is required" };
    }

    if (!DATASTORE_TYPES.includes(data_store.toUpperCase())) {
      throw {
        message: "Datastore type must be CRM or DATABASE",
      };
    }

    if (data_store.toUpperCase() === "DATABASE") {
      const query = `INSERT INTO contacts(first_name, last_name , email, mobile_number ) VALUES('${first_name}', '${last_name}', '${email}', '${mobile_number}');`;

      await Query(query);

      return res
        .status(200)
        .send({ err: false, message: "Contact created successfully" });
    }

    const response = await axios.post(
      `${freshwork_baseUrl}/api/contacts`,
      {
        contact: {
          first_name,
          last_name,
          mobile_number,
          email,
        },
      },
      {
        headers: {
          Authorization: `Token token=${token}`,
        },
      }
    );

    return res
      .status(200)
      .send({ err: false, message: "Contact created successfully" });
  } catch (error) {
    console.error(error);

    return res.status(400).send({
      err: true,
      message: error.message || "Something went wrong",
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;

    if (!contact_id) {
      throw { message: `Contact id is required!!` };
    }

    if (!data_store) {
      throw { message: `Datastore name is required!!` };
    }

    if (!new_email) {
      throw {
        message: `New email id is required!!`,
      };
    }

    if (!new_mobile_number) {
      throw {
        message: `New mobile number is required!!`,
      };
    }

    if (!DATASTORE_TYPES.includes(data_store.toUpperCase())) {
      throw {
        message: `Incorrect data store value. It should be CRM or DATABASE!!`,
      };
    }

    if (data_store.toUpperCase() === "DATABASE") {
      query = `UPDATE contacts 
            SET email = '${new_email}', mobile_number = '${new_mobile_number}' WHERE mobile_number = '${contact_id}';`;

      data = await Query(query);

      data = { ...data };

      if (data.affectedRows === 0) {
        throw {
          message: "Nothing to update!!",
        };
      }

      return res
        .status(200)
        .send({ err: false, message: "Contact updated successfully" });
    }

    let response = await axios.get(
      `${freshwork_filterUrl}?q=${contact_id}&include=contact`,
      {
        headers: {
          Authorization: `Token token=${token}`,
        },
      }
    );

    if (!response.data.length) {
      throw {
        message: "Given contact id is not present!!",
      };
    }

    const id = response.data[0].id;

    response = await axios.put(
      `${freshwork_contactUrl}/${id}`,
      {
        contact: {
          mobile_number: new_mobile_number,
          email: new_email,
        },
      },
      {
        headers: {
          Authorization: `Token token=${token}`,
        },
      }
    );

    return res
      .status(200)
      .send({ err: false, message: "Contact updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      err: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contact_id, data_store } = req.body;

    if (!contact_id) {
      throw { message: `Contact id is required!` };
    }

    if (!data_store) {
      throw { message: `Datastore name is required!` };
    }

    if (!DATASTORE_TYPES.includes(data_store.toUpperCase())) {
      throw {
        message: `Incorrect data store value. It should be CRM or DATABASE!!`,
      };
    }

    if (data_store.toUpperCase() === "DATABASE") {
      let query = `select count(*) from contacts where mobile_number = ${contact_id};`;

      let data = await Query(query);
      data = { ...data[0] };

      if (data["count(*)"] === 0) {
        throw {
          message: "contact not found",
        };
      }

      query = `delete from contacts where mobile_number = ${contact_id};`;
      data = await Query(query);

      data = { ...data };
      if (data.affectedRows === 0) {
        throw {
          message: "Something went wrong while deleting the contact!!",
        };
      }

      return res
        .status(200)
        .send({ err: false, message: "contact deleted successfully" });
    }

    let response = await axios.get(
      `${freshwork_filterUrl}?q=${contact_id}&include=contact`,
      {
        headers: {
          Authorization: `Token token=${token}`,
        },
      }
    );

    if (!response.data.length) {
      throw {
        message: "Given contact id is not present!!",
      };
    }

    const id = response.data[0].id;

    response = await axios.delete(`${freshwork_contactUrl}/${id}`, {
      headers: {
        Authorization: `Token token=${token}`,
      },
    });

    if (!response.data) {
      throw {
        message: "Something went wrong while deleting the contact",
      };
    }

    return res
      .status(200)
      .send({ err: false, message: "Contact deleted successfully" });
  } catch (error) {
    return res.status(400).send({
      err: true,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
};

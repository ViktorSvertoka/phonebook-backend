const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  number: {
    type: String,
    required: true,
  },
});

const Contact = model("contacts", contactSchema);

module.exports = {
  Contact,
  contactSchema,
};

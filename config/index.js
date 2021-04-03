const Cloud = require("@google-cloud/storage");
const path = require("path");
const serviceKey = path.join(
  __dirname,
  "./gojobsimagebucket-35e8564411a5.json"
);

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "gojobsimagebucket",
});

module.exports = storage;

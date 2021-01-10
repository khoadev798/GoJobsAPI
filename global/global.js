const GLOBAL = {
  PORT: 3000,
  MONGO_USER: "commonUser",
  MONGO_PASSWORD: "02urEVFYCBHChcUS",
  MONGO_DB: "randomThinking",
  MONGO_URL:
    "mongodb+srv://admin:gojobs123@cluster0.fatxr.mongodb.net/GoJobs?retryWrites=true&w=majority",
  SUCCESS_CODE: 200,
  BAD_REQUEST_CODE: 400,
  NOT_FOUND_CODE: 404,
  CONFLICT_CODE: 409,
  SERVER_ERROR_CODE: 500,
  ACCESS_TOKEN_SECRET: "Secret",
  ACCESS_TOKEN_LIFE:"Life",
  REGISTERATION_MESSAGE_PREFIX: "Registeration",
  UPDATE_MESSAGE_PREFIX: "Update",
  DELTE_MESSAGE_PREFIX: "Delete",
  EXISTED_MESSAGE_SUFFIX: "existed!",
  NOT_EXISTED_MESSAGE_SUFFIX: "not existed!",
  FAILED_MESSAGE_SUFFIX: "failed!",
  SUCCEEDED_MESSAGE_SUFFIX: "succeeded!",
  EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  VNPHONE_REGEX: /((09|03|07|08|05)+([0-9]{8})\b)/g,
  SALT_ROUNDS: 10,
};

module.exports = GLOBAL;

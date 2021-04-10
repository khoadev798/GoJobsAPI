const GLOBAL = {
  PORT: 80,
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
  ACCESS_TOKEN_LIFE: "365d",
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
  SERVICE_ID: "VA9fb49002f0c6108d585bf37148e754f6",
  ACCOUNTS_ID: "AC0ce24f1befd3b080315fdf2342babbac",
  AUTH_TOKEN: "8996186c7d3cb2a6b82b0c5957f912a9",
  API_KEY_MAIL:
    "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",
  EMAIL_ADMIN: "cauhuyso000@gmail.com",
};

module.exports = GLOBAL;

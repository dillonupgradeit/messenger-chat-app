const Sequelize = require("sequelize");
const db = require("../db");

const LastRead = db.define("lastRead", {});

LastRead.findLastRead = async function (conversationId, userId) {
  const lastReads = await LastRead.findOne({
    where: {
      conversationId,
      userId
    }
  });

  // return conversation or null if it doesn't exist
  return lastReads;
};

LastRead.findReadsByConversation = async function (conversationId) {
  const lastReads = await LastRead.findAll({
    where: {
      conversationId,
    }
  });

  // return conversation or null if it doesn't exist
  return lastReads;
};

module.exports = LastRead;
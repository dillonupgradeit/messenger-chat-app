const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const LastRead = require("./last-read");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
LastRead.belongsTo(Conversation);
LastRead.belongsTo(User);
LastRead.belongsTo(Message);
Conversation.hasMany(LastRead);
Message.hasMany(LastRead);

module.exports = {
  User,
  Conversation,
  Message,
  LastRead
};

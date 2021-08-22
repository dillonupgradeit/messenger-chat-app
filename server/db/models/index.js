const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Participant = require("./participant");

// associations

Conversation.belongsToMany(User, { through: Participant });
Conversation.belongsToMany(User, {through: Participant, as: 'filterUser'});
Conversation.hasMany(Message);
Conversation.hasMany(Participant);
Message.belongsTo(Conversation);
Message.hasMany(Participant, { foreignKey: "lastRead" });


module.exports = {
  User,
  Conversation,
  Message,
  Participant
};

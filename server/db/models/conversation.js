const { Op } = require("sequelize");
const db = require("../db");
const User = require("./user");
const Participant = require("./participant");
const Sequelize = require("sequelize");

const Conversation = db.define("conversation", { 
  nickname: {
    type: Sequelize.STRING,
    allowNull: true,
  } 
},{ userId: false });

// (v1) find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      },
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// (v2) : get conversation by conversationId
Conversation.findConversationById = async function (conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId 
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// (v2) : get conversation by conversationId and participant userId
Conversation.findConversationByIdAndUserId = async function (conversationId, userId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    },
    include: [
      {
        model: Participant,
        where: {
          userId: userId
        },
        required: true

      }
    ],
    attributes: ["id"]
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// (v2) find conversation by conversation nickname or name of user in conversation
Conversation.findConversationBySearchTerm = async function (searchTerm) {
  const conversation = await Conversation.findAll({
    include: [
      { 
        model: User,
        as: "filterUser",
        where: {
          [Op.or]: [
            {
              username: {
                [Op.iLike]: `%${searchTerm}%`
              }
            },
            {
              '$conversation.nickname$' : {
                [Op.iLike]: `%${searchTerm}%`
              } 
            }
          ]
        },
        attributes: [] 
      },
      { 
        model: User,
        through: {
            attributes: []
        },
        attributes: ["id","username", "photoUrl"] 
      }
    ],
    attributes: ["id", "nickname"],
    required: true
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;

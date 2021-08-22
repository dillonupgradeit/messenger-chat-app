const db = require("../db");

const Participant = db.define("participant", {});

// find partipant given a conversationId and userId
Participant.findActiveParticipant = async function (conversationId, userId) {
  const participant = await Participant.findOne({
    where: {
      conversationId,
      userId,
    }
  });

  // return participant or null if it doesn't exist
  return participant;
};

Participant.findActiveParticipantsByConversation = async function (conversationId) {
  const participants = await Participant.findAll({
    where: {
      conversationId,
    }
  });

  // return conversation or null if it doesn't exist
  return participants;
};

module.exports = Participant;

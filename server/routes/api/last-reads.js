const router = require("express").Router();
const { LastRead } = require("../../db/models");

// get lastReads for a given conversation
router.get("/:conversationId", async (req, res, next) => {
  try {
    
    const { conversationId } = req.params;
    const lastReads = await LastRead.findReadsByConversation(
      conversationId
    );

    res.json(lastReads);

  } catch (error) {
    next(error);
  }
});

// update current user lastRead for a given conversation
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const data = req.body;

    const { conversationId, messageId } = data.find(read => userId === read.userId);

    let lastRead = await LastRead.findLastRead(
      conversationId,
      userId
    );
    // if lastRead exists update it
    if (lastRead) {

      await LastRead.update({ messageId }, { 
        where: { id: lastRead.id }
      });

      // return with new messageId too
      lastRead.messageId = messageId;

    } else {
      // else create new lastRead for user and conversation
      lastRead = await LastRead.create({ conversationId, userId, messageId });

    }

    return res.json({ lastRead, userId });

  } catch (error) {
    next(error);
  }
});

module.exports = router;

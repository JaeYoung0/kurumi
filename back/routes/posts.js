const express = require("express");
const router = express.Router();
const { Post, User, Image, Comment } = require("../models");
const { Op } = require("sequelize");

//GET /posts

router.get("/", async (req, res, next) => {
  
  try {
    const where = {};

    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //lastId보다 작은거 10개 불러오기
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "ASC"],
      ],
      include: [
        {
          // 좋아요 누른 사람
          model: User,
          as: "PostLikers",
          attributes: ["id"],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
          include: [
            
            {
              model: Image,
              attributes: ["src"],
            },
          ],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              include:[
                {
                  model: Image,
                  attributes: ["src"],
                }
              ]
            },
            {
              model: User,
              as: "CommentLikers",
              attributes: ["id"],
            }
          ],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

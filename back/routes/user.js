const express = require("express");
const router = express.Router();
const { User, Post, Comment, Image,Leaf } = require("../models/index");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); //확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); //제로초
      done(null, basename + "_" + new Date().getTime() + ext); //제로초_152456486.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20MB
});

//POST /user (회원가입)
router.post("/", isNotLoggedIn, upload.none(),async (req, res, next) => {
  try {
    // 데이터베이스에 지금가입하려는 이메일과 중복되는 이메일이 있는지 여부를 확인한다
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    if (req.body.image) {
        //이미지를 하나만 올리면 image: 제로초.png
        console.log(`ttttttttt1개${req.body.image}`)
        const image = await Image.create({ src: req.body.image, UserId:user.id});
      
    }
    

    res.status(201).send("회원가입 완료");
  } catch (error) {
    console.log(error);
    next(error); // = status 500대
  }
});

//POST /user/login
router.post("/login", isNotLoggedIn, (req, res, next) => {
  //err = server error,info = client error,
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

//POST /user/logout
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("logout success");
  // res.redirect('/')
});

//Get /user (내 정보)
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
          {
            model: Image,
            attributes: ["id","src"],
          }
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /user/nickname
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );

    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /user/image
router.patch('/image', isLoggedIn, async (req, res, next) => {
  try {
    console.log(`update avatar bodyyyyyyyy:${JSON.stringify(req.body)}`)
    await Image.update(
      {
        src: req.body.avatar,
      },
      {
        where: { UserId: req.user.id },
      }
    );
    res.status(200).json({ src: req.body.avatar, imageId: req.body.imageId });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

//GET /user/followers
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }

    const followers = await user.getFollowers({
      limit:parseInt(req.query.limit, 10),
      include:[
        {
          model:Image,
          attributes:['src']
        },
        {
          model:Post,
          attributes:['id']
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
        
      ]
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET /user/followings
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }

    const followings = await user.getFollowings({
      limit:parseInt(req.query.limit, 10),
      include:[
        {
          model:Image,
          attributes:['src']
        },
        {
          model:Post,
          attributes:['id']
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ]
      
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get /user/1 (다른 유저 정보)
router.get("/:id", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model:Image,
          attributes:['id','src']
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get /user/1/posts
router.get('/:userId/posts', async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
        model: User,
        attributes: ['id', 'nickname'],
        include:[{
          model:Image,
          attributes: ['id', 'src'],
        }]
        }, 
        {
        model: Image,
        }, 
        {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
          order: [['createdAt', 'DESC']],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'PostLikers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Get /user/2/leafs
router.get("/:userId/leafs", async (req, res, next) => {
  
  try {
    const fullLeafs = await Leaf.findAll({
      where:{UserId: req.params.userId},
      include: [
        {
          // 좋아요 누른 사람
          model: User,
          attributes: ["id",'nickname'],
          include:[
            {
              model:Image,
              attributes: ["id", "src"],    
            }
          ]
        },
        {
          model:Image,
          attributes: ["id", "src"],
        }
        
          ],
        })
    
    res.status(200).json(fullLeafs);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /user/1/follow
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });

    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }

    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});





//DELETE /user/1/follow
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });

    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;

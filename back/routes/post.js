const express = require("express");
const router = express.Router();
const { Post, Comment, Image, User, Hashtag,Leaf,Report } = require("../models");
const { isLoggedIn } = require("./middlewares");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

//uploads폴더 만들기
try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

// S3
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region:'ap-northeast-2', 
})

//POST /post/images (UPLOAD_IMAGES_REQUEST)
// 배포환경
const upload = multer({
  storage: multerS3({
    
    s3: new AWS.S3(),
    bucket: 'kurum2',
    key(req, file, cb){
      console.log(file)
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
    // limits: { fileSize: 2 * 1024 * 1024 }, //20MB
})

// 개발환경
// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, done) {
//       done(null, "uploads");
//     },
//     filename(req, file, done) {
//       const ext = path.extname(file.originalname); //확장자 추출(.png)
//       const basename = path.basename(file.originalname, ext); //제로초
//       done(null, basename + "_" + new Date().getTime() + ext); //제로초_152456486.png
//     },
//   }),
//   limits: { fileSize: 20 * 1024 * 1024 }, //20MB
// });

router.post("/images", upload.array("image"), (req, res, next) => {
  

    res.json({image: req.files.map((v) => v.location.replace(/\/original\//,'/thumb/')), key: req.body.key});
  
});

//POST /post
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, //로그인 이후로 deserializeUser니까
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );

      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러개 올리면 image: [제로초.png, 부기초.png]
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );

        await post.addImages(images);
      } else {
        //이미지를 하나만 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },

        {
          model: Comment,
          include: [
            {
              model: User, //댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          // 게시글 작성자
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          // 좋아요 누른 사람
          model: User,
          as: "PostLikers",
          attributes: ["id"],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });

    res.status(201).json(fullPost); //model에 저장한 post를 프론트로 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/report

router.post("/report", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    
    const report = await Report.create({
      reportId: req.body.reportId,
      UserId: req.user.id,
      postId: req.body.postId,
      commentId: req.body.commentId,
      content: req.body.content,
      
    });

    

   

    res.status(201).json(report); //model에 저장한 post를 프론트로 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//DELETE /post/1
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {



    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });

    await Leaf.destroy({
      where:{ id: req.params.postId, UserId: req.user.id },
    })

  

    res.json({ PostId: parseInt(req.params.postId)});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /post/1
router.patch("/:postId", isLoggedIn,upload.none(), async (req, res, next) => {
  
  try {
    
    const post = await Post.findOne({
      where: { id: req.body.postId },
    });
    const leaf = await Leaf.findOne({
      where: { id: req.body.postId },
    })

    if(req.body.content){
      const hashtags = req.body.content.match(/#[^\s#]+/g);
      if (hashtags) {
        const result = await Promise.all(
          hashtags.map((tag) =>
            Hashtag.findOrCreate({
              where: { name: tag.slice(1).toLowerCase() },
            })
          )
        );
  
        await post.setHashtags(result.map((v) => v[0]));
      }
    }

    

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다!");
    }
    if (!leaf) {
      return res.status(403).send("게시글이 존재하지 않습니다!");
    }

    await Post.update(
    {
      content: req.body.content
    },
    {
      where: {id: req.body.postId,
              UserId: req.user.id}
    })

    



// if (req.body.image) {
//   if (Array.isArray(req.body.image)) {
    
//     const images = await Promise.all(
//       req.body.image.map((image) => Image.create({ src: image }))
//     );

//     await post.addImages(images);
//   } else {
    
//     const image = await Image.create({ src: req.body.image });
//     await post.addImages(image);
//   }
// }


    if (req.body.image) {
      
      await Image.destroy({
        where: {PostId: parseInt(req.params.postId)}
      })
      await Image.destroy({
        where: {LeafId: parseInt(req.params.postId)}
      })

      if (Array.isArray(req.body.image)) {

        const postImages = await Promise.all(
          req.body.image.map((image) => Image.create({
             src: image,
             PostId: parseInt(req.params.postId),
            },
            ))
        );
        await post.addImages(postImages);
        
        
        const leafImages = await Promise.all(
          req.body.image.map((image) => Image.create({
             src: image,
             LeafId: parseInt(req.params.postId),
             }))
        );
        await leaf.addImages(leafImages);

      } else {
    
       const postImage = await Image.create({
          src: req.body.image , 
          PostId: req.body.postId});

        await post.addImages(postImage);

        const leafImage = await Image.create({
           src: req.body.image ,
           LeafId: parseInt(req.params.postId)});

        await leaf.addImages(leafImage);
        
      }
      
    }

    const images = await Image.findAll({
      where: {PostId: parseInt(req.params.postId)}
    })
    

    

    res.status(200).json({
      PostId: parseInt(req.params.postId),
      images,
      content: req.body.content})
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId),
      UserId: req.user.id,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
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
    });

    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//DELETE /post/comment/1
router.delete('/:postId/comment/:commentId', isLoggedIn, async(req,res,next)=>{
  try{

    const comment = Comment.findOne({
      where:{id:req.params.commentId, UserId: req.user.id }
    })

    if(!comment){
      return res.status(403).send("댓글이 존재하지 않습니다!");
    }


    await Comment.destroy({
      where: { id: req.params.commentId, UserId: req.user.id },
    });

res.json({PostId:parseInt(req.params.postId), CommentId: parseInt(req.params.commentId)});

  }catch(e){
console.error(e)
next(e)
  }
})

//PATCH /post/1/like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다!");
    }
    await post.addPostLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//DELETE /post/1/like
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      res.status(403).send("게시글이 존재하지 않습니다!");
    }

    await post.removePostLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /post/1/comment/1/like
router.patch("/:postId/comment/:commentId/like", isLoggedIn, async (req, res, next) => {
  try {
    
    const comment = await Comment.findOne({
      where: { id: req.params.commentId },
    });

    if (!comment) {
      return res.status(403).send("댓글이 존재하지 않습니다!");
    }
    await comment.addCommentLikers(req.user.id);
    res.json({ CommentId: comment.id, UserId: req.user.id, PostId: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//DELETE /post/1/comment/1/like
router.delete("/:postId/comment/:commentId/like", isLoggedIn, async (req, res, next) => {
  try {
    
    
    const comment = await Comment.findOne({
      where: { id: req.params.commentId },
    });

    if (!comment) {
      res.status(403).send("댓글이 존재하지 않습니다!");
    }

    await comment.removeCommentLikers(req.user.id);
    res.json({ CommentId: comment.id, UserId: req.user.id, PostId: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//POST /post/1/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }

    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });

    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
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
        {
          model: User,
          attributes: ["id", "nickname"],
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
            },
          ],
        },
        {
          model: User,
          as: "PostLikers",
          attributes: ["id"],
        },
      ],
    });

    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET /post/1
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId},
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
              include: [
                {
                  model: Image,
                  attributes: ["src"],
                },
              ],
            },
            
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

    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
          as: "PostLikers",
          attributes: ["id"],
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
        
      ],
    });

    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

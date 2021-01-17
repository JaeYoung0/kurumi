const express = require("express");
const { Op } = require("sequelize");

const { User, Hashtag, Image, Post,Comment, Leaf } = require("../models");

const router = express.Router();
const { isLoggedIn } = require("./middlewares");


const multer = require("multer");
const path = require("path");
const fs = require("fs");
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')


//leafs폴더 만들기
try {
  fs.accessSync("leafs");
} catch (error) {
  console.log("leafs 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("leafs");
}

// S3
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region:'ap-northeast-2', 
})

//POST /post/images

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'kurum2',
    key(req, file, cb){
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
    limits: { fileSize: 20 * 1024 * 1024 }, //20MB
})

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, done) {
//       done(null, "leafs");
//     },
//     filename(req, file, done) {
//       const ext = path.extname(file.originalname); //확장자 추출(.png)
//       const basename = path.basename(file.originalname, ext); //제로초
//       done(null, basename + "_" + new Date().getTime() + ext); //제로초_152456486.png
//     },
//   }),
//   limits: { fileSize: 20 * 1024 * 1024 }, //20MB
// });


// Post /leaf
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
      
      const leaf = await Leaf.create({
        // content: req.body.content,
        UserId: req.user.id, //로그인 이후로 deserializeUser니까,
        lat: req.body.lat,
        lng: req.body.lng,
      });
      
      
      if (req.body.imagePaths) {
        // Array.isArray(req.body.imagePaths)
        if (req.body.imagePaths.length === 0) {
          return
        } else if (req.body.imagePaths.length > 1) {
          // 이미지를 여러개 올리면 image: [제로초.png, 부기초.png]
          
          const images = await Promise.all(
            req.body.imagePaths.map((v) => Image.create({ src: v.image[0]}))
          );
  
          await leaf.addImages(images);
        }  else {
          //이미지를 하나만 올리면 image: 제로초.png
          
          const image = await Image.create({ src: req.body.imagePaths[0].image[0]});
          await leaf.addImages(image);
        } 
      }
    
  
      const fullLeafs = await Leaf.findAll({
        // where: { id: leaf.id },
        include: [
          {
            // 게시글 작성자
            model: User,
            attributes: ["id", "nickname"],
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
      });
      
  
      res.status(201).json(fullLeafs); //model에 저장한 post를 프론트로 보내줌
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

// Get /leaf
router.get("/", async (req, res, next) => {
  
  try {
    const fullLeafs = await Leaf.findAll({
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
        
          ]
        })
    
    res.status(200).json(fullLeafs);
  } catch (error) {
    console.error(error);
    next(error);
  }
});





module.exports = router;

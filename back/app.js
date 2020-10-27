const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportConfig = require("./passport");
const dotenv = require("dotenv");

const db = require("./models");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");
const leafRouter = require('./routes/leaf')
const authRouter = require('./routes/auth')

const morgan = require("morgan");
const hpp = require('hpp')
const helmet = require('helmet')

const path = require("path");

dotenv.config();

// req.body를 쓰기 위해서 아래 두개를 상단에 적어줘야함 (미들웨어이기 때문에 순서가 중요함)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// morgan
if(process.env.NODE_ENV === 'production'){
app.set('trust proxy', 1)
app.use(morgan('combined'))
app.use(hpp())
app.use(helmet())
// cors피해가기 위해서 cors미들웨어 장착
app.use(
  cors({
    origin: ["https://ipapi.co/json","https://kurum2.com","13.209.153.169"], //나는 3065이긴한데 3060들어갈 수 있게해줘
    credentials: true, //도메인 달라도 쿠키 전달하게 해줌
    methods:
    "GET,HEAD,PUT,PATCH,POST,DELETE",   
    allowedHeaders:
        "Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Origin,Cache-Control,Content-Type,X-Token,X-Refresh-Token",
        // preflightContinue: false, 
  })
);
}else{

  app.use(morgan('dev'))
  // cors피해가기 위해서 cors미들웨어 장착
app.use(
  cors({
    origin: ["http://localhost:3060","https://ipapi.co/json"], 
    credentials: true, 
    methods:
    "GET,HEAD,PUT,PATCH,POST,DELETE",   
    allowedHeaders:
        "Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Origin,Cache-Control,Content-Type,X-Token,X-Refresh-Token",
        // preflightContinue: false, 
  })
);
}







passportConfig();
// passport + cookieParser + express-session
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie:{
      httpOnly: true,
      secure: true,
      domain: process.env.NODE_ENV === 'production' && '.kurum2.com'
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// mySQL연결
// {alter:true, force: true}
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공!!");
  })
  .catch(console.error);



// upload image 미리보기를 위해서 upload 폴더를 프론트에 제공함
app.use("/", express.static(path.join(__dirname, "uploads")));

// 라우팅
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/hashtag", hashtagRouter);
app.use('/leaf', leafRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.send('hello express');
});
// 에러처리 미들웨어
// app.use((err, req, res, next)=>{
// })

// 리슨
app.listen(3065, () => {
  console.log("server on");
});

const Sequelize = require("sequelize");
const comment = require('./comment')
const hashtag = require('./hashtag')
const image = require('./image')
const leaf = require('./leaf')
const post = require('./post')
const user = require('./user')
const report = require('./report')

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};

// =================sequelize로 node와 mySQL연결하기=======================
const sequelize = new Sequelize(
  config.database, //순서바뀌면 에러나네 ;;;
  config.username,
  config.password,
  config
);

db.Comment = comment
db.Hashtag = hashtag
db.Image = image
db.Post = post
db.User = user
db.Leaf = leaf
db.Report = report

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize)
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Post extends Model {
static init(sequelize){
  super.init({
    content: {
      //게시글
      type: DataTypes.TEXT,
      allowNUll: false,
    },
  },{
    modelName:'Post',
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci", //이모티콘도 저장할 수 있게함
    sequelize
  })
}

static associate(db){
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag"});
    db.Post.belongsToMany(db.User, { through: "PostLike", as: "PostLikers" });
    db.Post.belongsTo(db.Post, { as: "Retweet" });
}
}
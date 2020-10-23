const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize){ //sequelize.define
  return super.init({ // extends로 상속받은 것에서 부모를 호출할때는 super를 사용함
    content: {
      type: DataTypes.TEXT,
      allowNUll: false,
    },
  },{
    modelName: 'Comment',
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci", //이모티콘도 저장할 수 있게함
    sequelize
  })
  }

  static associate(db){
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsToMany(db.User, { through: "CommentLike", as: "CommentLikers" });
  }
}
const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize){
  return super.init({
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },{
    modelName: 'Hashtag',
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    sequelize //index에 있는 sequelize 연결객체를 클래스로 보내줘야함
  })
  }

  static associate(db){
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
}
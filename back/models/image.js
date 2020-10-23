const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Image extends Model {
  static init(sequelize){
    return super.init({
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },{
      modelName: 'Image',
      charset: "utf8",
      collate: "utf8_general_ci", //한글
      sequelize
    })
  }

  static associate(db){
    db.Image.belongsTo(db.Post);
    db.Image.belongsTo(db.Leaf)
    db.Image.belongsTo(db.User)
  }
}

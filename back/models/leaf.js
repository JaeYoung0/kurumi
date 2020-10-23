const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Leaf extends Model {
  static init(sequelize){
    super.init({
    // content: {
    //   //게시글
    //   type: DataTypes.TEXT,
    //   allowNUll: false,
    // },
    lat: {
      //게시글
      type: DataTypes.DECIMAL(8,6),
      allowNUll: false,
    },
    lng: {
      //게시글
      type: DataTypes.DECIMAL(9,6),
      allowNUll: false,
    },
    },{
      modelName: 'Leaf',
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //이모티콘도 저장할 수 있게함
      sequelize
    })
  }

  static associate(db){
    db.Leaf.belongsTo(db.User);
    db.Leaf.hasMany(db.Image)
    
  }
}

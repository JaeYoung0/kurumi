const DataTypes = require('sequelize')
const {Model} = DataTypes;

module.exports = class Report extends Model {
  static init(sequelize){
    super.init({
      reportId: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수로 적게함
        unique: true, //고유한값
      },
      UserId: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수로 적게함
        unique: true, //고유한값
      },
      postId: {
        type: DataTypes.STRING(30),
        // allowNull: false, //필수로 적게함
      },
      commentId: {
        type: DataTypes.STRING(30),
        
      },
      content: {
        //신고내용
        type: DataTypes.TEXT,
        allowNUll: false,
      },
    },{
      modelName: 'Report',
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize
    })
  }

  
}

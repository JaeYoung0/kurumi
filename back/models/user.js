const DataTypes = require('sequelize')
const {Model} = DataTypes;

module.exports = class User extends Model {
  static init(sequelize){
    super.init({
      email: {
        type: DataTypes.STRING(30),
        // allowNull: false, //필수로 적게함
        unique: true, //고유한값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수로 적게함
        unique: true, //고유한값
      },
      password: {
        type: DataTypes.STRING(100),
        // allowNull: false, //필수로 적게함
      },
      snsId: {
        type: DataTypes.STRING(30),
        
      },
      provider: {
        type: DataTypes.STRING(30),
        
      },
    },{
      modelName: 'User',
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize
    })
  }

  static associate(db){
    db.User.hasOne(db.Image)
    db.User.hasMany(db.Post); 
    db.User.hasMany(db.Leaf);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Comment, { through: "CommentLike", as: "CommentLiked" });
    db.User.belongsToMany(db.Post, { through: "PostLike", as: "PostLiked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  }
}

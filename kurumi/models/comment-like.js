// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const CommentLike = sequelize.define('commentLike', {
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    commentId: {
      type: DataTypes.INTEGER,
      field: 'CommentId',
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'UserId',
      primaryKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'CommentLike',
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  CommentLike.associate = (models) => {
    CommentLike.belongsTo(models.comments, {
      foreignKey: {
        name: 'commentIdKey',
        field: 'CommentId',
      },
      as: 'comment',
    });
    CommentLike.belongsTo(models.users, {
      foreignKey: {
        name: 'userIdKey',
        field: 'UserId',
      },
      as: 'user',
    });
  };

  return CommentLike;
};

// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const PostHashtag = sequelize.define('postHashtag', {
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    hashtagId: {
      type: DataTypes.INTEGER,
      field: 'HashtagId',
      primaryKey: true,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      field: 'PostId',
      primaryKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'PostHashtag',
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  PostHashtag.associate = (models) => {
    PostHashtag.belongsTo(models.hashtags, {
      foreignKey: {
        name: 'hashtagIdKey',
        field: 'HashtagId',
      },
      as: 'hashtag',
    });
    PostHashtag.belongsTo(models.posts, {
      foreignKey: {
        name: 'postIdKey',
        field: 'PostId',
      },
      as: 'post',
    });
  };

  return PostHashtag;
};

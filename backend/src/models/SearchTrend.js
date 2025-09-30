module.exports = (sequelize, DataTypes) => {
  const SearchTrend = sequelize.define('SearchTrend', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    query_text: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    query_language: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    search_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    last_searched: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    trend_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0
    }
  }, {
    tableName: 'search_trends',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['query_text', 'query_language']
      },
      {
        fields: ['search_count']
      },
      {
        fields: ['trend_score']
      }
    ]
  });

  return SearchTrend;
};

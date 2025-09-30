module.exports = (sequelize, DataTypes) => {
  const SearchAnalytics = sequelize.define('SearchAnalytics', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'user_sessions',
        key: 'id'
      }
    },
    search_query: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    search_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    results_returned: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    click_through_rate: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    time_spent_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'search_analytics',
    timestamps: true
  });

  return SearchAnalytics;
};

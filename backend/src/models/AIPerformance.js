module.exports = (sequelize, DataTypes) => {
  const AIPerformance = sequelize.define('AIPerformance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    model_version: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    query_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    accuracy_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    response_time_avg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_satisfaction_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    total_queries: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    date_recorded: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'ai_performance',
    timestamps: true
  });

  return AIPerformance;
};

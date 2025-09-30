module.exports = (sequelize, DataTypes) => {
  const FarmerQuery = sequelize.define('FarmerQuery', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_sessions',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    query_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    query_language: {
      type: DataTypes.STRING(5),
      defaultValue: 'en',
      allowNull: false
    },
    query_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    detected_crop: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    detected_disease: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    confidence_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 1
      }
    },
    ai_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response_language: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    response_time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_feedback: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isIn: [['helpful', 'not_helpful', 'partially_helpful']]
      }
    },
    feedback_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'farmer_queries',
    timestamps: true,
    indexes: [
      {
        fields: ['session_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['query_language']
      },
      {
        fields: ['detected_crop']
      },
      {
        fields: ['detected_disease']
      },
      {
        fields: ['user_feedback']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  // Instance methods
  FarmerQuery.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  FarmerQuery.findBySession = function(sessionId, limit = 50, offset = 0) {
    return this.findAll({
      where: { session_id: sessionId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  };

  FarmerQuery.findByUser = function(userId, limit = 50, offset = 0) {
    return this.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  };

  FarmerQuery.getFeedbackStats = function(period = '30d') {
    const whereClause = {
      user_feedback: { [sequelize.Op.ne]: null }
    };

    // Add date filter based on period
    if (period === '7d') {
      whereClause.created_at = {
        [sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      };
    } else if (period === '30d') {
      whereClause.created_at = {
        [sequelize.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };
    } else if (period === '90d') {
      whereClause.created_at = {
        [sequelize.Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      };
    }

    return this.findAll({
      where: whereClause,
      attributes: [
        'user_feedback',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['user_feedback']
    });
  };

  return FarmerQuery;
};

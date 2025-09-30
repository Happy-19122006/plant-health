module.exports = (sequelize, DataTypes) => {
  const Treatment = sequelize.define('Treatment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    disease_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diseases',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'treatment_categories',
        key: 'id'
      }
    },
    name_en: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    name_hi: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    active_ingredient: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    formulation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    concentration: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dosage_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dosage_hi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dosage_per_acre: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Dosage in grams/ml per acre'
    },
    dosage_per_hectare: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Dosage in grams/ml per hectare'
    },
    water_requirement_per_acre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Water requirement in liters per acre'
    },
    water_requirement_per_hectare: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Water requirement in liters per hectare'
    },
    spray_volume_per_acre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total spray volume in liters per acre'
    },
    spray_volume_per_hectare: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total spray volume in liters per hectare'
    },
    application_timing: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Best time for application'
    },
    weather_conditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Suitable weather conditions'
    },
    reapplication_interval: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Days between applications'
    },
    total_applications: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total number of applications needed'
    },
    application_method: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    frequency_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    frequency_hi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    safety_precautions_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    safety_precautions_hi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    waiting_period_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    effectiveness_score: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.5,
      validate: {
        min: 0,
        max: 1
      }
    },
    cost_per_unit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    product_links: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    is_organic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'treatments',
    timestamps: true,
    indexes: [
      {
        fields: ['disease_id']
      },
      {
        fields: ['category_id']
      },
      {
        fields: ['is_organic']
      },
      {
        fields: ['is_approved']
      },
      {
        fields: ['effectiveness_score']
      }
    ]
  });

  // Instance methods
  Treatment.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  Treatment.findByDisease = function(diseaseId, organicOnly = false) {
    const whereClause = {
      disease_id: diseaseId,
      is_approved: true
    };

    if (organicOnly) {
      whereClause.is_organic = true;
    }

    return this.findAll({
      where: whereClause,
      order: [['effectiveness_score', 'DESC']]
    });
  };

  Treatment.findByCategory = function(categoryId) {
    return this.findAll({
      where: {
        category_id: categoryId,
        is_approved: true
      },
      order: [['effectiveness_score', 'DESC']]
    });
  };

  return Treatment;
};

module.exports = (sequelize, DataTypes) => {
  const RegionalCropData = sequelize.define('RegionalCropData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    crop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crops',
        key: 'id'
      }
    },
    suitability_score: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 1
      }
    },
    best_season: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    yield_potential: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    common_challenges: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    local_varieties: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'regional_crop_data',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['region_id', 'crop_id']
      }
    ]
  });

  return RegionalCropData;
};

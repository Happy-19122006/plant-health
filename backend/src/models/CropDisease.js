module.exports = (sequelize, DataTypes) => {
  const CropDisease = sequelize.define('CropDisease', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    crop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crops',
        key: 'id'
      }
    },
    disease_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diseases',
        key: 'id'
      }
    },
    prevalence_score: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.5,
      validate: {
        min: 0,
        max: 1
      }
    },
    seasonal_pattern: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    regional_prevalence: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'crop_diseases',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['crop_id', 'disease_id']
      }
    ]
  });

  return CropDisease;
};

module.exports = (sequelize, DataTypes) => {
  const TreatmentCategory = sequelize.define('TreatmentCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name_en: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name_hi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_hi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    safety_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'treatment_categories',
    timestamps: true
  });

  return TreatmentCategory;
};

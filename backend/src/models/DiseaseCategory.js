module.exports = (sequelize, DataTypes) => {
  const DiseaseCategory = sequelize.define('DiseaseCategory', {
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'disease_categories',
    timestamps: true
  });

  return DiseaseCategory;
};

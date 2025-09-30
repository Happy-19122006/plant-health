module.exports = (sequelize, DataTypes) => {
  const CropCategory = sequelize.define('CropCategory', {
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
    icon_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'crop_categories',
    timestamps: true
  });

  return CropCategory;
};

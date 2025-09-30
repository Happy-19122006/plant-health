module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
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
    state_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    climate_zone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    soil_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'regions',
    timestamps: true
  });

  return Region;
};

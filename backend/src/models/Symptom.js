module.exports = (sequelize, DataTypes) => {
  const Symptom = sequelize.define('Symptom', {
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
    name_en: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    name_hi: {
      type: DataTypes.STRING(200),
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
    symptom_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    severity_indicator: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image_alt_text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'symptoms',
    timestamps: true,
    indexes: [
      {
        fields: ['disease_id']
      },
      {
        fields: ['is_primary']
      },
      {
        fields: ['display_order']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return Symptom;
};

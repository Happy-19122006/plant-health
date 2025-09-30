module.exports = (sequelize, DataTypes) => {
  const Crop = sequelize.define('Crop', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crop_categories',
        key: 'id'
      }
    },
    scientific_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    common_name_en: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    common_name_hi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    local_names: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_hi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    growing_season: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    climate_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    soil_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'crops',
    timestamps: true,
    indexes: [
      {
        fields: ['common_name_en']
      },
      {
        fields: ['common_name_hi']
      },
      {
        fields: ['scientific_name']
      },
      {
        fields: ['category_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  Crop.prototype.getLocalName = function(language) {
    if (this.local_names && this.local_names[language]) {
      return this.local_names[language];
    }
    return this.common_name_en;
  };

  Crop.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  Crop.findByName = function(name, language = 'en') {
    const whereClause = {
      is_active: true
    };

    if (language === 'hi') {
      whereClause[sequelize.Op.or] = [
        { common_name_hi: { [sequelize.Op.iLike]: `%${name}%` } },
        { common_name_en: { [sequelize.Op.iLike]: `%${name}%` } }
      ];
    } else {
      whereClause[sequelize.Op.or] = [
        { common_name_en: { [sequelize.Op.iLike]: `%${name}%` } },
        { common_name_hi: { [sequelize.Op.iLike]: `%${name}%` } }
      ];
    }

    return this.findOne({ where: whereClause });
  };

  Crop.searchByName = function(query, language = 'en', limit = 10) {
    const whereClause = {
      is_active: true
    };

    if (language === 'hi') {
      whereClause[sequelize.Op.or] = [
        { common_name_hi: { [sequelize.Op.iLike]: `%${query}%` } },
        { common_name_en: { [sequelize.Op.iLike]: `%${query}%` } },
        { scientific_name: { [sequelize.Op.iLike]: `%${query}%` } }
      ];
    } else {
      whereClause[sequelize.Op.or] = [
        { common_name_en: { [sequelize.Op.iLike]: `%${query}%` } },
        { common_name_hi: { [sequelize.Op.iLike]: `%${query}%` } },
        { scientific_name: { [sequelize.Op.iLike]: `%${query}%` } }
      ];
    }

    return this.findAll({
      where: whereClause,
      limit,
      order: [['common_name_en', 'ASC']]
    });
  };

  return Crop;
};

module.exports = (sequelize, DataTypes) => {
  const Disease = sequelize.define('Disease', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'disease_categories',
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
    causal_organism: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    severity_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    economic_impact: {
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
    },
    last_embedding_update: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'diseases',
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
        fields: ['severity_level']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  Disease.prototype.getLocalName = function(language) {
    if (this.local_names && this.local_names[language]) {
      return this.local_names[language];
    }
    return this.common_name_en;
  };

  Disease.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  Disease.findByName = function(name, language = 'en') {
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

  Disease.searchByName = function(query, language = 'en', limit = 10) {
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

  Disease.findByCrop = function(cropId, includeInactive = false) {
    const whereClause = includeInactive ? {} : { is_active: true };

    return this.findAll({
      where: whereClause,
      include: [{
        model: sequelize.models.Crop,
        where: { id: cropId },
        through: { attributes: ['prevalence_score', 'seasonal_pattern', 'regional_prevalence'] }
      }]
    });
  };

  return Disease;
};

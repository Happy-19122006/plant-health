const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const Language = require('./Language')(sequelize, DataTypes);
const CropCategory = require('./CropCategory')(sequelize, DataTypes);
const Crop = require('./Crop')(sequelize, DataTypes);
const DiseaseCategory = require('./DiseaseCategory')(sequelize, DataTypes);
const Disease = require('./Disease')(sequelize, DataTypes);
const CropDisease = require('./CropDisease')(sequelize, DataTypes);
const Symptom = require('./Symptom')(sequelize, DataTypes);
const TreatmentCategory = require('./TreatmentCategory')(sequelize, DataTypes);
const Treatment = require('./Treatment')(sequelize, DataTypes);
const Region = require('./Region')(sequelize, DataTypes);
const RegionalCropData = require('./RegionalCropData')(sequelize, DataTypes);
const UserSession = require('./UserSession')(sequelize, DataTypes);
const FarmerQuery = require('./FarmerQuery')(sequelize, DataTypes);
const AIPerformance = require('./AIPerformance')(sequelize, DataTypes);
const SearchAnalytics = require('./SearchAnalytics')(sequelize, DataTypes);
const SearchTrend = require('./SearchTrend')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);

// Define associations
const setupAssociations = () => {
  // Crop associations
  Crop.belongsTo(CropCategory, { foreignKey: 'category_id', as: 'category' });
  CropCategory.hasMany(Crop, { foreignKey: 'category_id', as: 'crops' });

  // Disease associations
  Disease.belongsTo(DiseaseCategory, { foreignKey: 'category_id', as: 'category' });
  DiseaseCategory.hasMany(Disease, { foreignKey: 'category_id', as: 'diseases' });

  // Crop-Disease many-to-many relationship
  Crop.belongsToMany(Disease, {
    through: CropDisease,
    foreignKey: 'crop_id',
    otherKey: 'disease_id',
    as: 'diseases'
  });
  Disease.belongsToMany(Crop, {
    through: CropDisease,
    foreignKey: 'disease_id',
    otherKey: 'crop_id',
    as: 'crops'
  });

  // Symptom associations
  Symptom.belongsTo(Disease, { foreignKey: 'disease_id', as: 'disease' });
  Disease.hasMany(Symptom, { foreignKey: 'disease_id', as: 'symptoms' });

  // Treatment associations
  Treatment.belongsTo(Disease, { foreignKey: 'disease_id', as: 'disease' });
  Treatment.belongsTo(TreatmentCategory, { foreignKey: 'category_id', as: 'category' });
  Disease.hasMany(Treatment, { foreignKey: 'disease_id', as: 'treatments' });
  TreatmentCategory.hasMany(Treatment, { foreignKey: 'category_id', as: 'treatments' });

  // Regional associations
  RegionalCropData.belongsTo(Region, { foreignKey: 'region_id', as: 'region' });
  RegionalCropData.belongsTo(Crop, { foreignKey: 'crop_id', as: 'crop' });
  Region.hasMany(RegionalCropData, { foreignKey: 'region_id', as: 'cropData' });
  Crop.hasMany(RegionalCropData, { foreignKey: 'crop_id', as: 'regionalData' });

  // User session associations
  FarmerQuery.belongsTo(UserSession, { foreignKey: 'session_id', as: 'session' });
  UserSession.hasMany(FarmerQuery, { foreignKey: 'session_id', as: 'queries' });

  // Search analytics associations
  SearchAnalytics.belongsTo(UserSession, { foreignKey: 'session_id', as: 'session' });
  UserSession.hasMany(SearchAnalytics, { foreignKey: 'session_id', as: 'searchAnalytics' });

  // User associations
  UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
};

// Setup associations
setupAssociations();

// Export all models
const models = {
  Language,
  CropCategory,
  Crop,
  DiseaseCategory,
  Disease,
  CropDisease,
  Symptom,
  TreatmentCategory,
  Treatment,
  Region,
  RegionalCropData,
  UserSession,
  FarmerQuery,
  AIPerformance,
  SearchAnalytics,
  SearchTrend,
  User,
  sequelize
};

module.exports = models;

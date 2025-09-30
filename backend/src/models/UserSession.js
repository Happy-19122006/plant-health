module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define('UserSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    session_data: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    language_preference: {
      type: DataTypes.STRING(5),
      defaultValue: 'en',
      allowNull: false
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    device_info: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    last_activity: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_sessions',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['last_activity']
      }
    ]
  });

  return UserSession;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmailValidation = sequelize.define('EmailValidation', {
    email: DataTypes.STRING,
    isValid: DataTypes.BOOLEAN,
    confidence: DataTypes.FLOAT,
    jobId: DataTypes.STRING,
    isProcessed: DataTypes.BOOLEAN
  }, {});
  EmailValidation.associate = function(models) {
    // associations can be defined here
  };
  return EmailValidation;
};

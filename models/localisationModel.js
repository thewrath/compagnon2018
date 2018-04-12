module.exports = (sequelize, DataTypes) => {
  var Localisation = sequelize.define('Localisation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, 
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    }, 
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    }, 
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    checked:{
      type: DataTypes.BOOLEAN, 
      allowNull: false,
    }
    
  });
  
  return Localisation;
};
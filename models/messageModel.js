//DEFINITION de message 
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, 
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    toUserId: {
      type : DataTypes.INTEGER,
      allowNull: false,

    }, 
    contentPath:{
      type: DataTypes.STRING, 
      allowNull: false,
    },
    object:{
      type: DataTypes.TEXT, 
      allowNull: false, 
    }, 
    content: {
      type : DataTypes.TEXT,
      allowNull: false,
    },
    
  });
  
  return Message;
};

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
    attachmentPath:{
      type: DataTypes.STRING, 
      allowNull: false,
    },
    asAttachment:{
      type: DataTypes.INTEGER,
      defautValue: 0,
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

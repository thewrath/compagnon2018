module.exports = (sequelize, DataTypes) => {
  Test = sequelize.define('Test', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    classMethods: {
      associate: function(models) {
        Test.belongsTo(models.User);
      }
    }
  });

  Test.prototype.sayTitle = function () {
    console.log(this.title);
  }

  return Test;

};

//const Test = sequelize.import("../models/testModel"); 

//Test.create({title: "this is a title"})
  //.then(function(test){
    //test.sayTitle();
  //})
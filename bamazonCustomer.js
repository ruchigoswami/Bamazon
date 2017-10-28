var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "roo", 
    database: "bamazon"
});

function runStart(){
//prints the items for sale and their details
connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;

  
    console.log('----------------------------------------------------------------------------------------------------')

    for(var i = 0; i<res.length;i++){
    console.log("Item id: " + res[i].item_id + " || " + "Product name: " + res[i].product_name + " || " + "Department Name: " + res[i].department_name + " || " + "Price: " + res[i].price + " || " + "Stock quantity: " + res[i].stock_quantity);
    
    console.log('--------------------------------------------------------------------------------------------------')
  }

  console.log(' ');
  inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the ID of the product you would like to buy?",
      validate: function(value){
        if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
          return true;
        } else{
          return false;
        }
      }
    },
    {
      type: "input",
      name: "quantity",
      message: " How many units of the product you would like to buy?",
      validate: function(value){
        if(isNaN(value)){
          return false;
        } else{
          return true;
        }
      }
    }
    ]).then(function(answer){
      var whatToBuy = (answer.id)-1;
      var howMuchToBuy = parseInt(answer.quantity);
      var total = parseFloat(((res[whatToBuy].price)*howMuchToBuy).toFixed(2));

      //check if quantity is sufficient
      if(res[whatToBuy].stock_quantity >= howMuchToBuy){
        //after purchase, updates quantity in Products
        connection.query("UPDATE Products SET ? WHERE ?", [
        {stock_quantity: (res[whatToBuy].stock_quantity - howMuchToBuy)},
        {item_id: answer.id}
        ], function(err, result){
            if(err) throw err;
            console.log("Success! Your total is $" + total.toFixed(2) + ". Your item(s) will be shipped to you in 3-5 business days.");
        });

        connection.query("SELECT * FROM Departments", function(err, deptRes){
          if(err) throw err;
          var index;
          for(var i = 0; i < deptRes.length; i++){
            if(deptRes[i].DepartmentName === res[whatToBuy].DepartmentName){
              index = i;
            }
          }
          
          //updates totalSales in departments table
          connection.query("UPDATE Departments SET ? WHERE ?", [
          {TotalSales: deptRes[index].TotalSales + total},
          {DepartmentName: res[whatToBuy].DepartmentName}
          ], function(err, deptRes){
              if(err) throw err;
              
          });
        });

      } else{
        console.log("Sorry, there's not enough in stock!");
      }

      reprompt();
    })
})
}

//asks if they would like to purchase another item
function reprompt(){
  inquirer.prompt([{
    type: "list",
    name: "reply",
    message: "Would you like to purchase another item?",
    choices: ["Yes", "No"]
  }]).then(function(answer){
    switch(answer.reply){
      case "Yes":
       runStart();
       break;
      case "No":
            console.log("\n----------------------------------------");
            console.log("Thank you for shopping!!!");
            console.log("----------------------------------------\n");
            connection.end();
            break;
    }
  });
}

runStart();
        
        
   

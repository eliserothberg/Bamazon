var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "Bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    start();
})
// Set up question categories- view products or inventory, 
// add inventory or a new product
var start = function() {
  inquirer.prompt({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function(answer) {
      if (answer.choice == "View Products for Sale") {
          viewProduct();
      } else if (answer.choice == "View Low Inventory"){
          lowInventory();
      }
      else if (answer.choice == "Add to Inventory") {
        addInventory();
      }
      else if (answer.choice == "Add New Product"){
          addNewProduct();
      }
      else {
        process.exit();
      }
    })

    //view table of products for sale
    var viewProduct = function() {
      connection.query('SELECT * FROM Products', function(err, res) {
      if (err) throw err;

      var table = new Table({
        head: ['Item\nID ', '\n                     Name', '\nDepartment', '\nPrice   ', ' In\nStock'],
        colAligns: ['center', 'left', 'left', 'null', 'left'],
        colWidths: [6, 55, 13, 15, 7]
      });
      for(var i = 0; i < res.length; i++) {

      table.push(

      [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, "$" + res[i].Price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), res[i].StockQuantity]
      );
    }
    console.log(table.toString());

    start();
  })
}
  //view table of inventory
var lowInventory = function() {
connection.query('SELECT * FROM Products WHERE StockQuantity < 100', function(err, res) {
  if (err) throw err;

    var table = new Table({
      head: ['Item\nID ', '\n                     Name', '\nDepartment', '\nPrice   ', ' In\nStock'],
      colAligns: ['center', 'left', 'left', 'null', 'left'],
      colWidths: [6, 55, 13, 15, 7]
    });
  for(var i = 0; i < res.length; i++) {

    table.push(

      [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, "$" + res[i].Price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), res[i].StockQuantity]
      );
    }
    console.log(table.toString());

    start();
  })
}
//add inventory
var addInventory = function() {   
  inquirer.prompt([{
    
  name: "pick",
  type: "input",
  message: "To add inventory, choose the item's ID#",
    validate: function(input) {
      if (isNaN(input) == false) {
        return true;
      } else {
        console.log("\n\nSorry, that was not a number.\n");
        return false;
      }
    }
  },
  {
  name: "add",
  type: "input",
  message: "How many items are you adding?",   
  validate: function(input) {
      if (isNaN(input) == false) {
        return true;
      } else {
        console.log("\n\nSorry, that was not a number.\n");
        return false;
      }
    
  }
}]).then(function(answer) {
  connection.query('SELECT * FROM Products', function(err, res) {
    if (err) throw err;
    var stockAmt = (res[answer.pick -1].StockQuantity);
    var plusStock = answer.add;
    var newStockAmt = (parseInt(stockAmt) + parseInt(plusStock));
    console.log("\nYou have added " + answer.add + " items to the " + res[answer.pick-1].ProductName + " inventory.\nThe updated stock amount of " + res[answer.pick-1].ProductName + " is now " + newStockAmt + ".\n");

    if (answer.add <= 0){
      console.log("\nSorry, you have not entered anything to add.\n")
    }
    else {
      connection.query("UPDATE Products SET ? WHERE ?", [{
        StockQuantity: newStockAmt
        }, 
        {
        ItemID: answer.pick
        }], function(err, res) {});        
      };
    start();
    })
  })
};

//add new product
var addNewProduct = function() {
  inquirer.prompt([{
    name: "item",
    type: "input",
    message: "What is the product you would like to add?",
    validate: function(input) {
        if (isNaN(input) !== false) {
          return true;
        } else {
          console.log("\nSorry, you cannot only numbers.\n");
          return false;
        }
      }
    }, 
    {
    name: "department",
    type: "input",
    message: "In which category would you like to place the product?",
    validate: function(input) {
        if (isNaN(input) !== false) {
          return true;
        } else {
          console.log("\nSorry, you cannot enter only numbers.\n");
          return false;
        }
      }
    }, 
    {
    name: "inventory",
    type: "input",
    message: "How many items are available?",
      validate: function(input) {
        if (isNaN(input) == false) {
          return true;
        } else {
          console.log("\nSorry, that was not a number.\n");
          return false;
        }
      }
    }, 
    {
    name: "price",
    type: "input",
    message: "What is the cost of the item? (Enter with decimal point only, no commas.)",
      validate: function(input) {
      if (isNaN(input) == false) {
        return true;
      } else {
        console.log("\nSorry, that was not a number.\n");
        return false;
      }
    }
  }]).then(function(answer) {
      connection.query('SELECT LENGTH(ItemID) FROM Products', function(err, res) {
        var newID = res.length + 1;

          connection.query("INSERT INTO Products SET ?", {
            ProductName: answer.item,
            DepartmentName: answer.department,
            StockQuantity: answer.inventory,
            Price: answer.price.toLocaleString(),
            ItemID: newID
        }, 

          function(err, res) {
            var pPrice = parseFloat(answer.price).toFixed(2);

            console.log("\n" + answer.inventory + " of " + answer.item + " at the cost of $" + pPrice.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " added to the " + answer.department + " category.\n");
            start();
        });
      })
    })
  }
}
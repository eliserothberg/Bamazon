var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "17candles",
    database: "Bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
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
      for(var i = 0; i < res.length; i++) {

      var table = new Table({
        head: ['ID', 'Name', 'Department', 'Price', 'Stock Quantity'],
        colWidths: [5, 55, 13, 15, 16]
      });

      table.push(

      [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, "$" + res[i].Price.toLocaleString(), res[i].StockQuantity]
      );
      console.log(table.toString());
    }
    start();
  })
}
  //view table of inventory
var lowInventory = function() {
connection.query('SELECT * FROM Products WHERE StockQuantity < 100', function(err, res) {
  if (err) throw err;
  for(var i = 0; i < res.length; i++) {

    var table = new Table({
      head: ['ID', 'Name', 'Department', 'Price', 'Stock Quantity'],
      colWidths: [5, 55, 12, 13, 16]
    });

    table.push(

      [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, "$" + res[i].Price.toLocaleString(), res[i].StockQuantity]
      );
      console.log(table.toString());
    }
  start();
  })
}
//add inventory
var addInventory = function() {   
  inquirer.prompt([{
    
  name: "pick",
  type: "input",
  message: "To add inventory, choose the item's ID#",
    validate: function(value) {
      if (isNaN(value) == false) {
          return true;
      } else {
          return false;
      }
    }
  },
  {
  name: "add",
  type: "input",
  message: "How many items are you adding?",   
  validate: function(value) {
    if (isNaN(value) == false) {
        return true;
    } else {
        return false;
    }
  }
}]).then(function(answer) {
  connection.query('SELECT * FROM Products', function(err, res) {
    if (err) throw err;
    var stockAmt = (res[answer.pick -1].StockQuantity);
    var plusStock = answer.add;
    var newStockAmt = (parseInt(stockAmt) + parseInt(plusStock));
    console.log("stockAmt = " + stockAmt);
    console.log("newStockAmt  = " + newStockAmt);

    console.log("\nYou have added " + answer.add + " items to the " + res[answer.pick-1].ProductName + " inventory.");
    if (answer.add <= 0){
      console.log("Sorry, you have entered nothing to add.")
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
    message: "What is the product you would like to add?"
    }, 
    {
    name: "department",
    type: "input",
    message: "What category would you like to place the product in?"
    }, 
    {
    name: "inventory",
    type: "input",
    message: "How many items are available?"
    }, 
    {
    name: "price",
    type: "input",
    message: "What is the cost of the item? (Enter using decimal point only, no commas.)",
    validate: function(value) {
      if (isNaN(value) == false) {
          return true;
      } 
      else {
          return false;
      }
    }
  }]).then(function(answer) {
      connection.query("INSERT INTO Products SET ?", {
          ProductName: answer.item,
          DepartmentName: answer.department,
          StockQuantity: answer.inventory,
          Price: answer.price.toLocaleString()
      }, 
      function(err, res) {
          console.log("Your product was added successfully!");
          start();
      });
    })
  }
}
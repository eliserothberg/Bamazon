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
    // console.log("connected as id " + connection.threadId);
})
//lists table of items for sale
connection.query('SELECT * FROM Products', function(err, result) {
  if (err) throw err;
  
  var table = new Table({
    head: ['Item\n ID', '\n               Name', '\nDepartment', '\n    Price', ' In\nStock'],
    colWidths: [6, 55, 13, 15, 7]
  });
  
  for(var i = 0; i < result.length; i++) {
  table.push(
    [result[i].ItemID, result[i].ProductName, result[i].DepartmentName, "$" + result[i].Price.toLocaleString(), result[i].StockQuantity]
    );
  }
      console.log(table.toString());

  options();
})

var deptName;
var prevSales;
var sumSales;
var amount;

//enables customer to choose to pick an item for sale or exit
var options = function() {
  inquirer.prompt({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: ["Pick an item for purchase","Exit"]
    }).then(function(answer) {
      if (answer.choice == "Pick an item for purchase") {
          pickItem();
      }       
      else {
        process.exit();
      }
    })
  }

//enables customer to select products and quantity
var pickItem = function() {   
  inquirer.prompt([{
    
    name: "pickID",
    type: "input",
    message: "Enter the Item ID number of the product you would like to purchase.",
      validate: function(value) {
        if (isNaN(value) == false) {
            return true;
        } else {
            return false;
        }
      }
    },
    {
    name: "amount",
    type: "input",
    message: "Enter the number of this item you wish to purchase.",   
    validate: function(value) {
      if (isNaN(value) == false) {
          return true;
      } else {
          return false;
      }
    }
  // checks stock
  }]).then(function(answer) {
    connection.query('SELECT * FROM Products', function(err, res) {
      if (err) throw err;

      if (res[answer.pickID-1].StockQuantity < answer.amount ) {
        lessStock();
      }
      else {
          amount = answer.amount;
        otherQuantity();
      }
      //if items(s) not in stock, offers customer the amount that is in stock
      function lessStock() {
      
      console.log("\nI'm sorry, we only have " + res[answer.pickID-1].StockQuantity + " in stock.");
         amount = res[answer.pickID-1].StockQuantity;

      inquirer.prompt({
        type: "list",
        name: "choice",
        message: "Would you like to purchase " + res[answer.pickID-1].StockQuantity + "?",
        choices: ["Yes","No", "Exit"]
        }).then(function(answer) {
          if (answer.choice == "Yes") {
            console.log(amount);

              otherQuantity();
          }       
          else if (answer.choice == "No") {
            options();
          }
          else {
            process.exit();
          }
        })
      }
  // offers available items for sale and tells customer the total
    function otherQuantity() {

      var stockAmt = (res[answer.pickID-1].StockQuantity - amount);
      var purchasePrice = (res[answer.pickID-1].Price * amount);
      var salesTax = parseFloat(res[answer.pickID-1].Price * .090).toFixed(2);
      var total = (parseFloat(purchasePrice) + parseFloat(salesTax));
      var deptName = (res[answer.pickID-1].DepartmentName);
      var finalTotal = total.toLocaleString();

      console.log("\nExcellent choice and we have that quantity in stock!\n")
      console.log(amount + " " + res[answer.pickID-1].ProductName + " at " + "$" + res[answer.pickID-1].Price.toLocaleString() + " each totals $" + finalTotal + " with tax.");

      //adjusts the in-stock amount 
      connection.query("UPDATE Products SET ? WHERE ?", [{
        StockQuantity: stockAmt
        }, {
        ItemID: answer.pickID
      }], function(err, res) {});

      //adds to the total department sales
      connection.query("SELECT TotalSales, DepartmentTitle FROM Departments", function(err, results) {
        for(var i = 0; i < results.length; i++) {
          if (results[i].DepartmentTitle == deptName) {
            prevSales = results[i].TotalSales;
            sumSales = parseFloat(total) + parseFloat(prevSales);
        
            connection.query("UPDATE Departments SET ? WHERE ?", [{
              TotalSales: sumSales
              }, {
              DepartmentTitle: deptName
              }], function(err, res) {});           
            }
          }
        });
        options();
      }
    })
  })
}



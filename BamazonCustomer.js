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
//tableof items for sale
connection.query('SELECT * FROM Products', function(err, result) {
  if (err) throw err;
  for(var i = 0; i < result.length; i++) {
  var table = new Table({
    head: ['Item ID', 'Name', 'Department', 'Price', 'In Stock'],
    colWidths: [9, 55, 12, 13, 10]
  });

  table.push(
    [result[i].ItemID, result[i].ProductName, result[i].DepartmentName, "$" + result[i].Price.toLocaleString(), result[i].StockQuantity]
    );
    console.log(table.toString());
  }
pickItem();
})
//enables user to purchase products, tells them if it's in stock in 
//their deisred quantity, if so, it tells them their total cost, 
//then adjusts the in stock amount and total sales
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
  }]).then(function(answer) {
    connection.query('SELECT * FROM Products', function(err, res) {
      if (err) throw err;
      var stockAmt = (res[answer.pickID-1].StockQuantity - answer.amount);

      console.log("\nYou chose to purchase " + answer.amount + " of the " + res[answer.pickID-1].ProductName + " from the " + res[answer.pickID-1].DepartmentName + " department.");
      if (stockAmt <= 0){
        console.log("I'm sorry, we do not have that quantity in stock.")
        pickItem();
      }
      else {
        var purchasePrice = (res[answer.pickID-1].Price * answer.amount);
        var salesTax = (res[answer.pickID-1].Price * .090);
        var total = (parseFloat(purchasePrice) + parseFloat(salesTax));
        console.log("purchase = " + parseFloat(purchasePrice) + "sales tax = " + parseFloat(salesTax));
        var deptName = (res[answer.pickID-1].DepartmentName);
        var addToTotal = total.toLocaleString();
        // var finalTotal = addToTotal.toFixed(2);

        console.log("addtototal = " + addToTotal);

        console.log("Excellent choice and we have that quantity in stock!\n")
        console.log(answer.amount + " " + res[answer.pickID-1].ProductName + " at " + "$" + res[answer.pickID-1].Price.toLocaleString() + " each totals $" + total.toLocaleString() + " with tax.");

        connection.query("UPDATE Products SET ? WHERE ?", [{
          StockQuantity: stockAmt
          }, {
          ItemID: answer.pickID
        }], function(err, res) {});
          connection.query("UPDATE Departments SET ? WHERE ?", [{
            TotalSales: addToTotal
            }, {
            DepartmentTitle: deptName
          }], function(err, res) {});           
          // console.log("$" + total + " has been added to the sales of the " + deptName + " department.");
        };
      pickItem();
    })
  })
};

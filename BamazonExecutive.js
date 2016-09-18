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
})

// Set up question categories- view sales or add new department
var options = function() {
    inquirer.prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["View Total Sales By Department", "Add A New Department"]
      }).then(function(answer) {
        if (answer.choice == "View Total Sales By Department") {
            viewSales();
        } else if (answer.choice == "Add A New Department"){
            addNewDepartment();
        }        
    })
// View Product Sales by Department
var viewSales = function() {
connection.query('SELECT * FROM Departments', function(err, result) {
  if (err) throw err;
  for(var i = 0; i < result.length; i++) {
  var tProfit = (result[i].TotalSales - result[i].OverHeadCosts);
  var table = new Table({
    head: ['ID', 'Department', 'Total Sales', 'Total Profit'],
    colWidths: [6, 14, 14, 15]
  });

  table.push(

    [result[i].DepartmentID, result[i].DepartmentTitle, "$" + result[i].TotalSales.toLocaleString() + ".00", "$" + tProfit.toLocaleString() + ".00"]
    );
    console.log(table.toString());
  }
options();
})
}

// Creates New Department
var addNewDepartment = function() {
    inquirer.prompt([{
        name: "dept",
        type: "input",
        message: "What is the name of the department you would like to add?"
    }, {
        name: "costs",
        type: "input",
        message: "What are the overhead costs?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "sales",
        type: "input",
        message: "What are the total sales?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO Departments SET ?", {
            DepartmentTitle: answer.dept,
            OverHeadCosts: answer.costs,
            TotalSales: answer.sales,
        }, function(err, res) {
            console.log("Your department was added successfully!");
            options();
        });
      })
    }
  }

options();

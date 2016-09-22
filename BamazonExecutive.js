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
  options();
})

// Set up question categories- view sales or add new department
var options = function() {
  inquirer.prompt({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: ["View Total Sales By Department", "Add A New Department", "Exit"]
    }).then(function(answer) {
      if (answer.choice == "View Total Sales By Department") {
          viewSales();
      } else if (answer.choice == "Add A New Department"){
          addNewDepartment();
      }        
      else {
        process.exit();
      }
    })
    // View Product Sales by Department
    var viewSales = function() {
    connection.query('SELECT * FROM Departments', function(err, result) {
      if (err) throw err;

      var table = new Table({
        head: ['ID', 'Department ', 'Total Sales ', 'Total Profit '],
        colAligns: ['null', 'null', 'null', 'null'],
        colWidths: [4, 14, 16, 16]
      });

      for(var i = 0; i < result.length; i++) {
        var tProfit = (result[i].TotalSales - result[i].OverHeadCosts);

        table.push(

        [result[i].DepartmentID, result[i].DepartmentTitle, "$" + result[i].TotalSales.toLocaleString(), "$" + tProfit.toLocaleString()]
        );
      }
      console.log(table.toString());

      options();
    })
  }

  // Creates New Department
  var addNewDepartment = function() {
    inquirer.prompt([{
      name: "dept",
      type: "input",
      message: "What is the name of the department you would like to add?",
        validate: function(input) {
          if (isNaN(input) !== false) {
            return true;
          } else {
            console.log("\n\nSorry, you cannot enter only numbers.\n");
            return false;
          }
        }
      }, 
      {
      name: "costs",
      type: "input",
      message: "What are the overhead costs?",
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
      name: "sales",
      type: "input",
      message: "What are the total sales?",
      validate: function(input) {
      if (isNaN(input) == false) {
        return true;
      } else {
        console.log("\n\nSorry, that was not a number.\n");
        return false;
      }
    }
      }]).then(function(answer) {
        connection.query("INSERT INTO Departments SET ?", {
          DepartmentTitle: answer.dept,
          OverHeadCosts: answer.costs,
          TotalSales: answer.sales,
          }, 
          function(err, res) {
            console.log("\nYour department " + answer.dept + " with overhead costs of $" + parseFloat(answer.costs).toLocaleString() + " and total sales of $" + parseFloat(answer.sales).toLocaleString() + " was successfully added.\n");
            options();
          });
        })
      }
    }


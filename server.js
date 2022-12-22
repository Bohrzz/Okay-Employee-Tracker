const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection(
  {
    host: "localhost",
    // MySQL Username
    user: "root",
    // TODO: Add MySQL Password
    password: "root",
    database: "employee_DB",
  },
  console.log(`Connected to the employee_DB database.`)
);

connection.connect(function (err) {
  if (err) throw err;

  console.log("connected via id" + connection.threadId);

  firstPrompt();
});

connection
  .promise()
  .query("SELECT 1")
  .then(([rows, fields]) => {
    console.log(rows);
  })
  .catch(console.log)
  .then(() => connection.end());

function firstPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "View Department",
        "Add Employee",
        "View Employees",
        "Remove Employees",
        "Update Employee Role",
        "Add Role",
        "End",
      ],
    })

    .then(function ({ menu }) {
      switch (menu) {
        case "Add Department":
          addDepartment();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "View Employees":
          viewEmployee();
          break;

        case "View Department":
          viewDepartment();
          break;

        case "Remove Employees":
          removeEmployees();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "End":
          connection.end();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "What is the name of the department?",
      name: "deptName",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.deptName],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employees first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employees last name",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employees role",
        name: "roles",
        choices:["Accountant","Creative Lead","Software Engineer","Lead Engineer", "Sales Lead",]
      },
      
    ])

    .then(function (answer) {
      connection.query(
        "INSERT INTO employee (name) VALUES (?)",
        [answer.addEmployee],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "roleName",
      },
      {
        type: "input",
        message: "What'll be the salary for the given role",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "What department is the role in?",
        name: "department",
        choices:["Sales","Engineering","Finance","Creative",]
      },
      
    ])

    .then(function (answer) {
      connection.query(
        "INSERT INTO role (name) VALUES (?)",
        [answer.roleName],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

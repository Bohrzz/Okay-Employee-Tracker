const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
const inquirer = require("inquirer");
const utils = require("util");
// const db = require("./db")

// const PORT = process.env.PORT || 3001;
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

  startScreen();
});

// connection
//   .promise()
//   .query("SELECT 1")
//   .then(([rows, fields]) => {
//     console.log(rows);
//   })
//   .catch(console.log)
//   .then(() => connection.end());
connection.query = utils.promisify(connection.query);
function startScreen() {
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
        "View Role",
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

        case "View Role":
          viewRoles();
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
      console.log(answer);
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

async function addEmployee() {
  const roles = await connection.query("SELECT * FROM role");
  const employees = await connection.query("SELECT * FROM employee");

  const roleChoices = roles.map((role) => ({
    value: role.id,
    name: role.title,
  }));
  const employeeChoices = employees.map((employee) => ({
    value: employee.id,
    name: `${employee.first_name} ${employee.last_name}`,
  }));
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
        choices: roleChoices,

        // choices: [
        //   "Accountant",
        //   "Creative Lead",
        //   "Software Engineer",
        //   "Lead Engineer",
        //   "Sales Lead",
        // ],
      },

      {
        type: "list",
        message: "Who is the employees manager?",
        name: "manager",
        choices: employeeChoices,
      },
    ])

    .then(function (answer) {
      connection.query(
        "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)",
        [answer.firstName, answer.lastName, answer.roles, answer.manager],
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
        choices: ["Sales", "Engineering", "Finance", "Creative"],
      },
    ])

    .then(function (answer) {
      connection.query(
        "INSERT INTO role (title) VALUES (?)",
        [answer.roleName],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

async function viewDepartment() {
  try {
    const result = await connection.query("SELECT * FROM department");
    console.table(result);
  } catch (error) {
    console.log(error);
  }

  startScreen();
}

async function viewRoles() {
  try {
    const result = await connection.query(
      "SELECT role.title, role.id, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id"
    );
    console.table(result);
    startScreen();
  } catch (error) {
    console.log(error);
  }
}

function viewEmployee() {
  connection.query(
    `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", role.title, department.name AS department, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN role
                    ON role.id  = employee.role_id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id`,

    function (err, res) {
      if (err) console.log(err);
      console.table(res);
      startScreen();
    }
  );
}

// async function removeEmployees() {
//   console.log("Removing an employee");

//   var query = `SELECT role_id, first_name, last_name
//       FROM employee `;

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     const removeEmployeeChoices = res.map(({ role_id, first_name, last_name }) => ({

//       name: `${role_id} ${first_name} ${last_name}`,
//     }));

//     console.table(res);
//     console.log("ArrayToRemove!\n");

//     promptDelete(removeEmployeeChoices);
//   });
// }

async function updateEmployeeRole() {
  const roles = await connection.query("SELECT * FROM role");
  const employees = await connection.query("SELECT * FROM employee");

  const roleChoices = roles.map((role) => ({
    value: role.id,
    name: role.title,
  }));
  const employeeChoices = employees.map((employee) => ({
    value: employee.id,
    name: `${employee.first_name} ${employee.last_name}`,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        name: "employeeChoices",
        choices: employeeChoices,
      },

      {
        type: "list",
        message: "What do you want to update to?",
        name: "updateRole",
        choices: roleChoices,
      },
    ])
    .then(function (answer) {
      connection.query(
        "UPDATE employee SET role_id=? WHERE id= ?",
        [answer.updateRole, answer.employeeChoices],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

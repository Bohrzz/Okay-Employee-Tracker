INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Creative");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 180000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 200000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 140000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 135000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Creative Lead", 175000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Ronson", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("T", "Pain", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Jackson", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Earl", "Earlington", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Clifton", "Brown", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Swae", "Lee", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bruce", "Springstein", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Angel", 1, 2);

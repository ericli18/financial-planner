const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 9000;
console.log(port);

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

async function getUserFromEmail(email) {
    var user = null;
    try {
        await pool
            .query('SELECT * FROM users WHERE email = '+email + ";")
            .then((query_res) => {
                user = query_res.rows[0];
            });
    }
    catch (error) {
        console.log(error);
    }
    return user;
}

async function getUserPermissionsForGroup(userId, groupId) {
    var permission = null;
    try {
        await pool
            .query('SELECT permission FROM user_permissions WHERE user_id = '+userId+'AND group_id = '+groupId + ";")
            .then((query_res) => {
                permission = query_res.rows[0];
            })
    }
    catch (error) {
        console.log(error);
    }
    return permission == null ? 0 : permission;
}

async function addUser(username, email) {
    try {
        await pool
            .query(
                "INSERT INTO users (username, email) VALUES " +
                "(\'" + username + "\', \'" + email + "\');"
            );
        return true;
    }
    catch (error) {
        return false;
    }
}

async function addGroup(name, password) {
    try {
        await pool
            .query(
                "INSERT INTO groups (name, password) VAlUES" +
                "(\'" + name + "\', \'" + password + "\');"
            );
        return true;
    }
    catch (error) {
        return false;
    }
}

async function getGroupTemplate(group_id) {
    var templateId = null;
    try {
        await pool
            .query(
                "SELECT template_id FROM groups WHERE id = " + group_id + ";"
            ).then((query_res) => {
                templateId = query_res.rows[0];
            });
    }
    catch (error) {
        console.log(error);
    }
    return templateId;
}

async function addTaskToTemplate(template_id, name, dueDateTime) {
    try {
        let date = new Date(dueDateTime);
        let newDateTime = date.toISOString().slice(0,19).replace('T', ' ');
        await pool
            .query(
                "INSERT INTO tasks (template_id, name, due_date_time) VALUES "+
                "(" + template_id + ", \'" + name + "\', \'" + newDateTime + "\');"
            );
        return true;
    }
    catch (error) {
        return false;
    }
}
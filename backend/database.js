const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 9000;
console.log(port);

app.get('/', (req, res) => {
    var hi = "hi";
    res.json({hi});
});

app.post('/getUserFromEmail', async (req, res) => {
    let request = req.body;
    const user = await getUserFromEmail(request['email']);
    res.json({user});
})

app.post('/getUserPermissionsForGroup', async (req, res) => {
    let request = req.body;
    const permission = await getUserPermissionsForGroup(request['userId'], request['groupId']);
    res.json({permission});
})

app.post('/addUser', async (req, res) => {
    // to send data
    // JSON.stringify({username: username, email: email});
    let request = req.body;
    const updateSuccess = await addUser(request['username'], request['email']);
    res.json({updateSuccess});
})

app.post('/addTaskToTemplate', async (req, res) => {
    let request = req.body;
    const updateSuccess = await addTaskToTemplate(request['groupId'], request['name'], request['dueDateTime']);
    res.json({updateSuccess});
})

app.post('/getAllGroupsForUser', async (req, res) => {
    let request = req.body;
    const groups = await getAllGroupsForUser(request['userId']);
    res.json({groups});
})

app.post('/addGroup', async (req, res) => {
    let request = req.body;
    const updateSuccess = await addGroup(request['name'], request['password']);
    res.json({updateSuccess});
})

app.post('/addTemplateToUser', async (req, res) => {
    let request = req.body;
    const updateSuccess = await copyGroupTemplateToUser(request['groupId'], request['userId']);
    res.json({updateSuccess});
})

app.post('/getTasksForTemplate', async (req, res) => {
    let request = req.body;
    const tasks = await getAllTasksForTemplate(request['groupId']);
    res.json({tasks});
})

app.post('/getTasksForPersonalTemplate', async (req, res) => {
    let request = req.body;
    const tasks = await getAllTasksForPersonalTemplate(request['groupId']);
    res.json({tasks});
})

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

async function getAllGroupsForUser(userId) {
    var groups = [];
    try {
        await pool
            .query('SELECT * FROM groups WHERE user_id = ' + userId + ';')
            .then((query_res) => {
                    for (let i = 0; i < query_res.rowCount; ++i) {
                        groups.push(query_res.rows[i]);
                    }
                }
            )
    }
    catch (error) {
        console.log(error);
    }
    return groups;
}

async function getAllPersonalTemplatesForUser(userId) {
    var templates = [];
    try {
        await pool
            .query('SELECT * FROM personal_templates WHERE user_id = ' + userId + ";")
            .then((query_res) => {
                for (let i = 0; i < query_res.rowCount; ++i) {
                    templates.push(query_res.rows[i]);
                }
            })
    }
    catch (error) {
        console.log(error);
    }
    return templates;
}

async function getAllTasksForPersonalTemplate(personalGroupId) {
    var tasks = [];
    try {
        await pool
            .query(
                'SELECT * FROM personal_tasks WHERE personal_template_id = ' + personalGroupId + ';'
            ).then((query_res) => {
                for (let i = 0; i < query_res.rowCount; ++i) {
                    tasks.push(express.query.rows[i]);
                }
            })
    }
    catch (error) {
        console.log(error);
    }
    return tasks;
}

async function copyGroupTemplateToUser(groupId, userId) {
    try {
        var tasks = await getAllTasksForTemplate(groupId);
        var group = [];
        await pool
            .query('SELECT * FROM groups WHERE id = ' + groupId + ";")
            .then((query_res) => {
                group = query_res.rows[0];
            })
        await pool
            .query(
                'INSERT INTO personal_templates (id, user_id, name, last_edited) VALUES ' + 
                "("+ groupId + ", " + userId + ", \'" + group['name'] + "\', LOCALTIMESTAMP);"
            )
        if (tasks.length > 0) {
            var queryString = "(INSERT INTO personal_tasks (personal_template_id, name, due_date_time) VALUES (";
            for (const task of tasks) {
                queryString += groupId + ', \'' + task['name'] + "\', " + task['due_date_time'] + ",";
            }
            queryString[-1] = ")";
            queryString += ";";
            await pool
                .query(
                    queryString
                )
        }
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
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
                "INSERT INTO groups (name, password, last_edited) VALUES" +
                "(\'" + name + "\', \'" + password + "\', LOCALTIMESTAMP);"
            );
        return true;
    }
    catch (error) {
        return false;
    }
}


async function getAllTasksForTemplate(groupId) {
    var tasks = [];
    try {
        await pool
            .query(
                "SELECT * FROM tasks WHERE template_id = " + groupId + ";"
            ).then((query_res) => {
                for (let i = 0; i < query_res.rowCount; ++i) {
                    tasks.push(query_res.rows[i]);
                }
            })
    }
    catch (error) {
        console.log(error);
    }
    return tasks;
}

async function addTaskToTemplate(groupId, name, dueDateTime) {
    try {
        let date = new Date(dueDateTime);
        let newDateTime = date.toISOString().slice(0,19).replace('T', ' ');
        await pool
            .query(
                "INSERT INTO tasks (groupId, name, due_date_time) VALUES "+
                "(" + groupId + ", \'" + name + "\', \'" + newDateTime + "\');"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown.');
    process.exit(0);
});

app.listen(port, 'localhost',() => {
    console.log(`listening at localhost:${port}`);
});
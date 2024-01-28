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

app.post('/addGroupToUser', async (req, res) => {
    let request = req.body;
    const updateSuccess = await addGroupToUser(request['groupId'], request['userId']);
    res.json({updateSuccess});
})

app.post('/getAllPersonalTemplatesForUser', async (req, res) => {
    let request = req.body;
    const templates = await getAllPersonalTemplatesForUser(request['userId']);
    res.json({templates});
})

app.post('/updateGroupName', async (req, res) => {
    let request = req.body;
    const updateSuccess = await updateGroupName(request['groupId'], request['name']);
    res.json({updateSuccess});
})

app.post('/updateTaskName', async (req, res) => {
    let request = req.body;
    const updateSuccess = await updateTaskName(request['taskId'], request['name'])
    res.json({updateSuccess});
})

app.post('/updateTaskDueDateTime', async (req, res) => {
    let request = req.body;
    const updateSuccess = await updateTaskDueDateTime(request['taskId'], request['dueDateTime']);
    res.json({updateSuccess});
})

app.post('/updatePersonalTemplateName', async (req, res) => {
    let request = req.body;
    const updateSuccess = await updatePersonalTemplateName(request['personalTemplateId'], request['name']);
    res.json({updateSuccess});
})

app.post('/updatePersonalTaskName', async (req, res) => {
    let request = req.body;
    const updateSuccess = await updatePersonalTaskName(request['personalTaskId'], request['name']);
    res.json({updateSuccess});
})

app.post('/updatePersonalTaskDueDateTime', async (req, res) => {
    let request = req.body;
    const updateSuccess = await updatePersonalTaskDueDateTime(request['personalTaskId'], request['name']);
    res.json({updateSuccess});
})

app.post('/kickUser', async (req, res) => {
    let request = req.body;
    const kickSuccess = await kickUser(request['userId'], request['groupId']);
    res.json({kickSuccess});
})

app.post('/addPersonalTask', async (req, res) => {
    let request = req.body;
    const updateSuccess = await addPersonalTask(request['personalTemplateId'], request['name'], request['dueDateTime']);
    res.json({updateSuccess});
})

app.post('/deletePersonalTask', async (req, res) => {
    let request = req.body;
    const updateSuccess = await deletePersonalTask(request['personalTaskId']);
    res.json({updateSuccess});
})

app.post('/deleteTask', async (req, res) => {
    let request = req.body;
    const updateSuccess = await deleteTask(request['taskId']);
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

async function kickUser(userId, groupId) {
    try {
        await pool
            .query(
                'DELETE FROM user_permissions WHERE user_id = ' + userId + 'AND group_id = ' + groupId + ";"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
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
            // remove extra ","
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

async function addPersonalTask(personalTemplateId, name, dueDateTime) {
    try {
        await pool
            .query(
                'INSERT INTO personal_tasks (personal_template_id, name, due_date_time) VALUES ' +
                "(" + personalTemplateId + ", \'" + name + "\', " + dueDateTime + ");"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function deletePersonalTask(personalTaskId) {
    try {
        await pool
            .query(
                'DELETE FROM personal_tasks WHERE id = ' + personalTaskId + ';'
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function deleteTask(taskId) {
    try {
        await pool
            .query(
                'DELETE FROM tasks WHERE id = ' + taskId + ';'
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function updateGroupName(groupId, newName) {
    try {
        await pool
            .query(
                "UPDATE groups SET name = \'" + newName + "\' WHERE id = " + groupId + ";"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function updateTaskName(taskId, newName) {
    try {
        await pool
            .query(
                "UPDATE tasks SET name = \'" + newName + "\' WHERE id = " + taskId + ";"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function updateTaskDueDateTime(taskId, newDateTime) {
    try {
        await pool
            .query(
                "UPDATE tasks SET due_date_time = " + newDateTime + " WHERE id = " + taskId + ";"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function updatePersonalTemplateName(personalTemplateId, newName) {
    try {
        await pool
            .query(
                "UPDATE personal_templates SET name = \'" + newName + "\' WHERE id = " + personalTemplateId + ";"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function updatePersonalTaskName(personalTaskId, newName) {
    try {
        await pool
            .query(
                "UPDATE personal_tasks SET name = \'" + newName + "\' WHERE id = " + personalTaskId + ";"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

async function updatePersonalTaskDueDateTime(personalTaskId, newDateTime) {
    try {
        await pool
            .query(
                "UPDATE personal_tasks SET due_date_time = " + newDateTime + " WHERE id = " + personalTaskId + ";"
            )
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

async function addGroupToUser(groupId, userId) {
    try {
        await pool
            .query(
                "INSERT INTO user_permissions (user_id, group_id, permission) VALUES " +
                "(" + userId + ", " + groupId, + ", true);"
            )
        return true;
    }
    catch (error) {
        console.log(error);
    }
    return false;
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
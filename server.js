const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

let pool=null;
try {
     pool = mysql.createPool({
        host: process.env.HOST,
        port: process.env.DB_PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }).promise();
}
catch (err) {
    console.log(err);
}


const app = express();
app.listen(process.env.PORT, () => {
    console.log('listening at 8000');
})

app.use(express.json());
app.use(cors());

app.get('/create', (req, res) => {
    try {
        const result = pool.query('create table employee (emp_id INT Primary Key, emp_name varchar(50), department varchar(20), salary INT)');
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send(err.code);
    }
});

app.get('/get', async (req, res) => {
    try {
        const [data] = await pool.query('select * from employee');
        res.send(data);
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/upload', async(req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const dept = req.body.dept;
        const salary = req.body.salary;
        const result = await pool.query(`insert into employee values(?,?,?,?)`, [id, name, dept, salary]);
        res.send('ok');
    }
    catch (err) {
        console.log(err.sqlMessage);
        res.json({ error: err.sqlMessage });
    }
});

app.delete('/delete', async (req, res) => {
    try {
        const id = req.body.id;
        const result = await pool.query(`delete from employee where emp_id=?`, [id]);
        console.log(result);
        res.send('ok');
    }
    catch (err) {
        res.json({ error: err.sqlMessage });
    }
});







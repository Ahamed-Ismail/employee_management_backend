const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

let pool=null;
try {
     pool = mysql.createPool({
        // host: process.env.HOST,
        port: process.env.DB_PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
     }).promise();
    console.log("database connected");
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

app.get('/', (req, res) => {
    res.send('welcome ems backend');
});

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


app.post('/upload', async (req, res) => {
    try {
        const { id, name, gender, dob, dept, designation, salary } = req.body;

        
       
        if (name.length > 30) {
            return res.json({res:"Name must be max 30 characters!"});
        }
        const parsedSalary = parseInt(salary);
        if (parsedSalary > 99999999) {
            return res.json({res:"Salary must be max 8 digits"});
        }
        const parsedId = parseInt(id);
        
        const result = await pool.query(
            'INSERT INTO employee (emp_id, emp_name, gender, dob, department, desigantion, salary) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [parsedId, name, gender, dob, dept, designation, parsedSalary]
        );

        console.log(result);
        res.json({res:'ok'});
    } catch (err) {
        console.log(err.sqlMessage);
        res.status(500).json({ res: err.sqlMessage });
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
        res.json({ res: err.sqlMessage });
    }
});







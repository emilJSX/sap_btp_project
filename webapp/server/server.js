const express = require('express');
const db = require('./database');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(bodyParser.json());
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:8080', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const sequelize = new Sequelize('user_database', 'root', '0775808024Em', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0775808024Em', 
  database: 'user_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING
  },
  education: {
    type: DataTypes.STRING
  },
  contactInfo: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  tableName: 'users'
});

app.get('/api/users', cors(corsOptions), async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  try {
      const users = await User.findAll();
      res.json(users);
  } catch (error) {
      res.status(500).send(error.message || 'Server error');
  }
});


app.post('/api/login', cors(corsOptions), async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', cors(corsOptions), (req, res) => {
  const { username, password, email, role, position, education, contactInfo } = req.body;

  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO users (username, password, email, role, position, education, contactInfo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(query, [username, password, email, role, position, education, contactInfo], (error, results) => {
    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Server error' });
    }

    res.status(201).json({ id: results.insertId, username, email, role, position, education, contactInfo });
  });
});

app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, role, position, education, contactInfo } = req.body;

  const updateQuery = `
      UPDATE users
      SET username = ?, email = ?, password = ?, role = ?, position = ?, education = ?, contactInfo = ?
      WHERE id = ?
  `;

  const selectQuery = `
      SELECT * FROM users WHERE id = ?
  `;

  try {
      const [updateResult] = await db.execute(updateQuery, [username, email, password, role, position, education, contactInfo, userId]);
      if (updateResult.affectedRows === 0) {
          return res.status(404).send({ message: 'User not found' });
      }

      const [updatedRows] = await db.execute(selectQuery, [userId]);
      if (updatedRows.length > 0) {
          res.send({ message: 'User updated successfully', userData: updatedRows[0] });
      } else {
          res.status(404).send({ message: 'User not found after update' });
      }
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({ message: 'Error updating user' });
  }
});

app.get('/api/users/:id', cors(corsOptions), async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).send({ message: 'Error retrieving user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  const deleteQuery = `
      DELETE FROM users WHERE id = ?
  `;

  try {
      const [result] = await db.execute(deleteQuery, [userId]);
      
      if (result.affectedRows === 0) {
          return res.status(404).send({ message: 'User not found' });
      }

      res.send({ message: 'User deleted successfully', userId: userId });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({ message: 'Error deleting user' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
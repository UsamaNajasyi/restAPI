const express = require('express');
const { Client } = require('pg');
const inquirer = require('inquirer');
const axios = require('axios'); // Untuk melakukan HTTP request dari terminal

// Setup Express
const app = express();
const port = 3000;

// setup client
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: '', // nama database
  password: '', // password database
  port: 5432,
});

client.connect();

app.use(express.json());

// ambil user
app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
});

// tambah user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// hapus user berdasarkan ID
app.delete('/delete-item', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully', deletedItem: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// nyalain server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Prompt untuk terminal (perbarui dengan opsi DELETE)
const runTerminalOptions = async () => {
  const prompt = inquirer.createPromptModule(); // Buat prompt terlebih dahulu
  const answers = await prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Pilih aksi yang ingin dijalankan:',
      choices: ['GET Users', 'POST User', 'DELETE User', 'Exit'],
    },
  ]);

  if (answers.action === 'GET Users') {
    try {
      const response = await axios.get('http://localhost:3000/users');
      console.log('Users:', response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  } else if (answers.action === 'POST User') {
    const userAnswers = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Masukkan nama user:',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Masukkan email user:',
      },
    ]);

    try {
      const response = await axios.post('http://localhost:3000/users', {
        name: userAnswers.name,
        email: userAnswers.email,
      });
      console.log('User added:', response.data);
    } catch (error) {
      console.error('Error posting user:', error);
    }
  } else if (answers.action === 'DELETE User') {
    const deleteAnswers = await prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Masukkan ID user yang ingin dihapus:',
        validate: (input) => {
          if (!input) {
            return 'ID harus diisi';
          }
          return true;
        },
      },
    ]);

    try {
      const response = await axios.delete('http://localhost:3000/delete-item', {
        data: { id: deleteAnswers.id },
      });
      console.log('User deleted:', response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  } else {
    console.log('Exiting...');
    process.exit();
  }

  runTerminalOptions(); // Setelah pilihan selesai, tanyakan lagi
};

// Mulai terminal options setelah server dimulai
runTerminalOptions();

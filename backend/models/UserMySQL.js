const pool = require('../db-mysql');
const bcrypt = require('bcryptjs');

class User {
  static async findOne(query) {
    const [[rows]] = await pool.execute(
      'SELECT * FROM userdetails WHERE username = ? OR email = ?',
      [query.username || query.email, query.email || query.username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [[rows]] = await pool.execute('SELECT * FROM userdetails WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const [result] = await pool.execute(
      'INSERT INTO userdetails (username, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [userData.username, userData.email, hashedPassword, userData.name, userData.role || 'admin']
    );
    return result.insertId;
  }

  static async updateLastLogin(id) {
    await pool.execute('UPDATE userdetails SET last_login = NOW() WHERE id = ?', [id]);
  }

  static async countByRole(role) {
    const [[rows]] = await pool.execute('SELECT COUNT(*) as count FROM userdetails WHERE role = ?', [role]);
    return rows[0].count;
  }
}

module.exports = User;

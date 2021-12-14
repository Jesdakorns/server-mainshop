  import mysql from 'mysql2/promise'

  const pool = mysql.createPool({
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    database: process.env.NEXT_PUBLIC_DB_DATABASE,

  });


  async function query(sql: any, params: any) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  }


  module.exports = {
    query
  }
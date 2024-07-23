import mariadb from 'mariadb'
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'collabdb',
})

export default pool;

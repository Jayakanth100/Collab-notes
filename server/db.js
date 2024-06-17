import mariadb from 'mariadb'
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'tardigrade',
    password: 'password',
    database: 'userdata',
})
pool.getConnection()
    .then((con)=>{
        console.log("Connected");
        return con.query("SELECT name FROM user");
    })
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    })

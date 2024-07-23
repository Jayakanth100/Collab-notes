import {v4 as uuidv4 }from 'uuid';
import bcrypt from "bcrypt";
import pool from "../db/db.js";

async function insertUser(con , username, email, password){
    const id = uuidv4();
    const query = "INSERT INTO users(clientId, username, email, password) VALUES (?, ?, ?, ?);"
    let queryStatus = await con.query(query,[id, username, email, password]);
}
const idController = {
    register: async(req, res)=>{
        const username = req.body.username;
        const email = req.body.email;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let con;
        try{
            con = await pool.getConnection();
            //seraching for existing account
            const query = "SELECT * FROM users WHERE email LIKE (?);"
            const row = await con.query(query,[email]);
            if(row.length > 0){
                console.log("already exist");
                res.status(200).json({exists:'true'});
            }
            else{
                res.status(201).json({exists:'false'});
                await insertUser(con, username, email, hashedPassword);
            }
         }
        catch(err){
            console.log(err);
            res.redirect("/api/register");
            // res.writeHead(400, {'Content-Type': 'text/plain'});
        }

    }
}
export default idController;

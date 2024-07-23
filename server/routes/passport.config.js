import bcrypt from "bcrypt"
import pool from "../db/db.js";
import { Strategy as LocalStrategy} from "passport-local"

async function getUserById(clientId){
   let con = await pool.getConnection() 
    const query = "SELECT * FROM users WHERE clientId LIKE (?);";
    const row = await con.query(query,[clientId]);
    console.log(row);
    return row;
}
function initialize(passport){
    const authenticateUser = async(email, password, done)=>{
        let con;
        try{
            con = await pool.getConnection();
            const query = "SELECT * FROM users WHERE email LIKE (?);";
            let row = await con.query(query,[email]);
            if(!row.length){return done(null, false, {message: "Incorrect usernamer and password"})}
            if(await bcrypt.compareSync(password, row[0].password)){
                return done(null,row[0]);
            }
            else{
                return done(null, false, {message: "Incorrect password"});
            }
        }
        catch(err){
            return done(err);
        }
    }
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        authenticateUser
    ));
    passport.serializeUser((user, done)=>{
    done(null, user);
    })
    passport.deserializeUser((id, done)=>{
    done(null, getUserById(id));
    })

}
export default initialize;

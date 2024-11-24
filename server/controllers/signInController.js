import axios from 'axios';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

const signIn = async (req,res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({error:"Invalid credentials given in request"});
        }
        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        //Invalid email
        if (!result.rows[0].email) {
            return res.status(400).json({ error:"No user associated with that email" });
        }
        //Wrong username
        if (username.localeCompare(result.rows[0].username)!=0) {
            return res.status(400).json( { error:"Wrong username given with email"});
        }
        //Wrong password
        if (!await bcrypt.compare(password, result.rows[0].password)) {
            return res.status(400).json({ error:"Wrong password given with email"});
        }
        res.status(200).json({
            message:"Successfully signed in",
            user_id:result.rows[0].user_id
        });
    } catch (err) {
        console.error("Something when wrong when signing in:", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
}

export { signIn };
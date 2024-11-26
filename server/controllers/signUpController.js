import axios from 'axios';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

const signUp = async (req,res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({error:"Invalid credentials in request"});
        }
        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        //If already in users
        if (result.rows.length>0) {
            return res.status(400).json({error:"A user with that email already exists!"});
        }
        //Create user
        await axios.post(`http://localhost:5000/api/users`, {username:username, email:email, password:password});
        //Create portfolio
        const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        let user_id = userRes.rows[0].user_id;
        await axios.post(`http://localhost:5000/api/portfolios`, {user_id:user_id});

        //Send user_id
        res.status(200).json({
            message:"Successfully signed in",
            username:username,
            user_id:user_id
        });
    } catch (err) {
        console.error("Something when wrong when signing in:", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
}

export { signUp };
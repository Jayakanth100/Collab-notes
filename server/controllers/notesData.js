import {v4 as uuidv4 } from "uuid"
import pool from "../db/db.js";

export const createNote = async(req, res)=>{
    let con = null;
    try{
        con = await pool.getConnection();
        console.log("Request from client to get noteId: ",req.body);
        const noteId = uuidv4();
        const query = "INSERT INTO notes (noteId,title,description,clientId) VALUES (?,?,?,?);"
        const queryStatus = await con.query(query,[noteId, req.body.title, req.body.description, req.body.clientId]);
        console.log("The query stat: ", queryStatus);
        res.status(200).json(noteId) 
        // con.end();
    }
    catch(err){
        res.status(500).send({message: "Somthing went wrong while creating note"});
    }
} 
export const saveImage = async(req, res)=>{
    let con = null;
    try{
        con = await pool.getConnection();
        const noteId = req.headers['note-id'];
        const blob = req.body;
        console.log("The image data: ", blob);
        console.log("The noteId is: ", noteId);
        const query = "UPDATE notes SET image=(?) WHERE noteId=(?);"
        const queryStatus = await con.query(query, [blob,noteId]);
        con.end();
        // console.log("Image updated successfully")
        res.status(200).send({message: "Image updated successfully"});
    }
    catch(err){
        console.log("Error while updating image: ", err);
        res.status(200).send({message: "Something went wrong while saving image"});
    }
}
export const getBlop = async(req,res)=>{
    let con = null;
    try{
        const {noteId} = req.query;
        console.log("The note id in query parameters: ", noteId);
        con = await pool.getConnection();
        const query = "SELECT image FROM notes WHERE noteId = (?);"
        const queryStat = await con.query(query,[noteId]);
        console.log("The response blop query: ", queryStat[0].image);
        console.log("The length of the response: ", queryStat[0].image.length);
        con.end();
        res.writeHead(200,{
            'Content-Type': 'application/octet-stream',
            'Content-Length': queryStat[0].image.length
        })
        res.end(queryStat[0].image);
    }
    catch(err){
        console.log("Error while fetching blop: ", err);
        res.status(500).send({message: "something went wrong while getting blob"});
    }
}

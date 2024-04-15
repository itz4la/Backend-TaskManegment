const Joi = require('joi')
const asyncHandler = require('express-async-handler')
const User = require('../models/user');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET



exports.login = asyncHandler (async (req , res ) =>{
    let userLogedIn;
    const validationSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    })
    await validationSchema.validateAsync(req.body);
    const {email,password} = req.body;

    User.findOne({email:email}).then(user => {
        if(!user) {
            const err = new Error("A user with this email could be not found");
            err.StatusCode = 401;
            throw err
        }
        userLogedIn = user
        return bcrypt.compare(password , user.password);
    }).then(loged => {
        if(!loged) {
            const err = new Error("Invalid Password");
            err.StatusCode = 401;
            throw err
        }
        
    }).then(finalUser => {
                let token = jwt.sign({
                    email:userLogedIn.email,
                    userId : userLogedIn._id.toString()
                },JWT_SECRET , {expiresIn:"1h"})
                res.status(200).json({
                    userId: userLogedIn._id.toString(),
                    token:token
                }) 
    }) .catch(err => {
        res.status(err.StatusCode).json({error :err.message} )
        if(!err.statusCode) {
            err.statusCode = 500
        }
       
    })
})

exports.register = asyncHandler (async(req , res)=> {
    const validationSchema = Joi.object({
        name: Joi.string().required(),
        role: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required().email(),
    })
    await validationSchema.validateAsync(req.body);

    const {name, role, email,password} = req.body;
    User.findOne({email:email}).then(user => {
        if(user) {
            const err = new Error("A user with this email already exist");
            err.StatusCode = 400;
            throw err
            
        }else {
            return user;
        }
    }).then(result => {
        if(!result) {
            bcrypt.hash(password , 12).then(hashResult => {
                let newUser = new User({
                    name,
                    email,
                    role,
                    password:hashResult,
                })
                newUser.save().then(success => {res.status(201).json({success})})
            })
        }
    }).catch(err => {
        res.status(400).json({error :err.message} )
    })
})


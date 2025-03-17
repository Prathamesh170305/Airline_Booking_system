const {response}=require('express');
const UserService=require('../services/user-service');

const userService=new UserService();

const create =async(req , res)=>{
    try {
        const response =await userService.create({
            email:req.body.email,
            password:req.body.password
        });
        return res.status(201).json({
            success:true,
            message:'successfully created a new user',
            data:response,
            err:{}
        }); 
    } catch (error) {
        console.log('something went wrong in the controller layer');
        console.log(error);
        return res.status(500).json({
            message:'Something went wrong in controller',
            data:{},
            success:false,
            err:error
        })
    }
}

module.exports={
    create
}
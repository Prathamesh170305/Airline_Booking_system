const  ValidationError = require('../utils/validation-error');
const { User,Role } = require('../models/index');
const ClientErrors = require('../utils/client-error');
const { StatusCodes } = require('http-status-codes');

class UserRepository {
    async create(data) {
        try {
            const user = await User.create(data);
            return user;
            
        }
        catch (error) {
            if(error.name=='SequelizeValidationError'){
                throw new ValidationError(error);
            }
            
            console.log('Something went wrong in the repo layer');
            throw error;
        }
    }

    async destroy(userId) {
        try {
            await User.destroy({
                where: {
                    id: userId
                }
            });
            return true;
        }
        catch (error) {
            console.log('Something went wrong in the repo layer');
            throw error;
        }
    }

    async getById(userId){
        try{
            const user = await User.findByPk(userId,{
                attributes:['email','id']
            });
            return user;
        }
        catch (error) {
            console.log('Something went wrong in the repo layer');
            throw error;
        }
    }

    async getByEmail(userEmail){
        try {
            const user=await User.findOne({
                where:{
                    email:userEmail
                }
            });
            if(!user){
                throw new ClientErrors(
                    'AttributeNotFound',
                    'Inavalid email sent in the req',
                    'Please check the email as there is no record of the email',
                    StatusCodes.NOT_FOUND
                )
            }
            return user;
        } catch (error) {
            console.log('something went wrong in the user repo getbyemail');
            throw error;
        }
    }

    async isAdmin(userId){
        try {
            const user =await User.findByPk(userId);
            const adminRole=await Role.findOne({
                where:{
                    name:'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } catch (error) {
            console.log('Something went wrong in repo layer isAdmin');
            throw error;
        }
    }
}

module.exports =UserRepository;

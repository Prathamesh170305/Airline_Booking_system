const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

const UserRepository = require('../repository/user-repository');
const { JWT_KEY } = require('../config/serverConfig');
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log('something went wrong in the service layer');
            throw error;
        }
    }

    async signIn(email,plainPassword){
        try {
            //step 1->fetch the user using email
            const user = await this.userRepository.getByEmail(email);
            //step 2->compare incoming plain pass with stores encrypted pass
            const passwordMatch=this.checkPassword(plainPassword,user.password);

            if(!passwordMatch){
                console.log("Password doesnt match");
                throw {error:'Incorrect password'};
            }
            //step 3->if pass match then create a token and send it to user
            const newJWT=this.createToken({email:user.email,id:user.id});
            return newJWT;
        } catch (error) {
            console.log('something went wrong in the service layer in signIn');
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);  // Assuming verifyToken() returns the decoded token or user data
            if (!response || !response.id) {  // Check if verifyToken returns a valid response with an ID
                throw { error: 'Invalid Token' };
            }
    
            const user = await this.userRepository.getById(response.id);
            if (!user) {
                throw { error: 'No User for the corresponding token' };
            }
    
            return user.id;
        } catch (error) {
            console.log('something went wrong in the service layer in isAuthenticated');
            throw error;
        }
    }
    

    createToken(user) {
        try {
            const result = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
            return result;
        } catch (error) {
            console.log('something went wrong in the service layer (token creation)');
            throw error;
        }
    }

    verifyToken(token){
        try {
            const response =jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            console.log('something went wrong in the service layer (token verification)');
            throw error;
        }
    }

    checkPassword(userInputPlainPassword,encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
        } catch (error) {
            console.log('something went wrong in the password verification');
            throw error;
        }
    }

    isAdmin(userId){
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log('something went wrong in the service layer isAdmin');
            throw error;
        }
    }

}
module.exports = UserService;

const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const {hash} = require("bcrypt");

class AuthService{
    constructor() {
        this.userRepository = new UserRepository();
        this.saltRounds = 10;
    }
    
    async login(credentials){
        const {id, password} = credentials;
        
        this.validateLoginInput(id, password);
        
        const user = await this.userRepository.findById(id);
        if(!user){
            throw new Error('INVALID_CREDENTIALS');
        }
        
        const isPasswordVaild = await bcrypt.compare(password, user.password);
        if(!isPasswordVaild){
            throw new Error('INVALID_CREDENTIALS');
        }
        
        return {
            id: user.id,
            name: user.name
        };
    }
    
    async register(userData){
        const {id, name, age, password} = userData;
        
        this.validateRegisterInput(userData);
        
        const userExists = await this.userRepository.existsById(id);
        if(userExists){
            throw new Error('USER_ALREADY_EXISTS');
        }
        
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        const result = await this.userRepository.create({
            id,
            name,
            age,
            password: hashedPassword
        });
        
        return{
            id,
            name,
            userId: result.insertId
        }
    }

    validateLoginInput(id, password){
        if(!id || !password){
            throw new Error('MISSING_CREDENTIALS');
        }

        if (typeof id !== 'string' || typeof password !== 'string') {
            throw new Error('INVALID_INPUT_TYPE');
        }
    }

    validateRegisterInput({ id, name, age, password }) {
        if (!id || !name || !age || !password) {
            throw new Error('MISSING_REQUIRED_FIELDS');
        }

        if (id.length < 3) {
            throw new Error('INVALID_ID_LENGTH');
        }

        if (password.length < 6) {
            throw new Error('INVALID_PASSWORD_LENGTH');
        }

        if (age < 1 || age > 120) {
            throw new Error('INVALID_AGE');
        }
    }
}

module.exports = AuthService;
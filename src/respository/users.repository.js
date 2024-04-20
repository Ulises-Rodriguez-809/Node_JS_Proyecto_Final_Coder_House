import { GetUserDto} from '../dao/dto/user.dto.js';

export class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(){
        const result = await this.dao.getAllUsers();

        return result;
    }

    async create(user){
        const result = await this.dao.saveUser(user);

        return result;
    }

    async get(user){
        const {email} = user;

        const userInfo = await this.dao.getUser({email});

        const getUserDtoFront = new GetUserDto(userInfo);

        return getUserDtoFront;
    }

    async getWhitoutFilter(user){
        const {email} = user;

        const userInfo = await this.dao.getUser({email});

        return userInfo;
    }

    async update(id, user){
        const result = await this.dao.updateUser(id,user);

        return result;
    }
}
import bcrypt from 'bcrypt';
import db from '../models/index';

interface IUserInput {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
    gender?: string; // '1' hoặc '0'
    roleId?: string;
}

const hashUserPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const createNewUser = async (data: IUserInput): Promise<string> => {
    try {
        const hashedPassword = await hashUserPassword(data.password);

        await db.User.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender === '1',
            roleId: data.roleId,
        });

        return 'User created successfully!';
    } catch (error) {
        throw error;
    }
};

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userId: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            if (user) {
                resolve(user);
            } else {
                resolve([]);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUser = (data: IUserInput & { id: number }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                resolve('User updated successfully');

                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve("User not found");
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (userId: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
                resolve('User deleted successfully');
            }
            resolve("User not found");
        } catch (e) {
            reject(e);
        }
    })
}

export default {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUserById: deleteUserById
}
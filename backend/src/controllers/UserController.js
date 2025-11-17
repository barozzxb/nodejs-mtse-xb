import uServ from '../services/UserService.js';

const UserController = {
    createUser: async (req, res) => {
        const { name, email, password } = req.body;
        const data = await uServ.createUser(name, email, password);
        if (data.success) {
            return res.status(200).json(data.data);
        }
        return res.status(401).json(data.data);
    },

    getUser: async (req, res) =>{
        const data = await uServ.getUser();
        if (data.success) {
            return res.status(200).json(data.data);
        }
        return res.status(401).json(data.data);
    },
    
    getAccount: async (req, res) => {
        return res.status(200).json(req.user);
    },

    handleLogin: async (req, res) => {
        const {email, password} = req.body;
        const data = await uServ.login(email, password);
        if (data.success) {
            return res.status(200).json(data.data);
        }
        return res.status(401).json(data.data);
    }
}

export default UserController;
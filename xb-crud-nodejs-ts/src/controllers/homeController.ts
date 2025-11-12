import { get } from "http";
import db from "../models/index";

import CRUDService from "../services/CRUDService";

let getHomePage = async (req: any, res: any) => {
    try {
        let data = await db.User.findAll();
        console.log(">>> Check data: ", data);
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req: any, res: any) => {
    return res.render("test/about.ejs");
}

let getCRUD = (req: any, res: any) => {
    return res.render("crud.ejs");
}

let postCRUD = async (req: any, res: any) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("Post crud from server");
}

let getFindAllCRUD = async (req: any, res: any) => {
    let data = await CRUDService.getAllUser();
    console.log(data);
    return res.render("users/findAllUser.ejs", {
        datalist: data,
    });
}

let getEditCRUD = async (req: any, res: any) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        console.log(userData);
        return res.render("users/updateUser.ejs", {
            data: userData,
        });
    } else {
        return res.send("User not found!");
    }
}

let putCRUD = async (req: any, res: any) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUser(data);
    return res.render("users/findAllUser.ejs", {
        datalist: allUsers,
    });
}

let deleteCRUD = async (req: any, res: any) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send("Delete user successfully!");
    } else {
        return res.send("User not found!");
    }
}

export default {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    getFindAllCRUD: getFindAllCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};
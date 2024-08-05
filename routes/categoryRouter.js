var express = require('express');
var router = express.Router();
var categoryModel = require('../models/category');

router.post('/add', async function(req,res,next){
    try{
        //Lấy dữ liệu từ người dùng nhập vào
    const {name} = req.body;
    //dữ liệu người dùng truyền vào để lưu vào DB
    const newName = {name};
    //Thực hiện lưu object vừa tạo vào collections
    await categoryModel.create(newName);
    //Render dữ liệu vừa thêm mới
    res.status(200).json(newName);
    }
    catch(error){
        res.status(400).json({"status": false, "message":"Thêm thất bại"});
    };
})

router.get('/danhsach', async function (req,res,next) {
    try {
        const danhsach = await categoryModel.find();
        res.status(200).json(danhsach)
    } catch (error) {
        res.status(400).json({"status": false, "message":"Thêm thất bại"});
    }
})



module.exports = router;
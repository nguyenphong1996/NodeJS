var express = require('express');
var router = express.Router();
var categoryModel = require('../models/category');

router.post('/add', async function(req,res,next){
    //Lấy dữ liệu từ người dùng nhập vào
    const {name} = req.body;
    //dữ liệu người dùng truyền vào để lưu vào DB
    const newName = {name};
    //Thực hiện lưu object vừa tạo vào collections
    await categoryModel.create(newName);
    //Render dữ liệu vừa thêm mới
    res.status(200).json(newName);
})

module.exports = router;
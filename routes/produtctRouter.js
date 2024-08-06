var express = require('express');
var router = express.Router();
var modelProduct = require('../models/product');
var upload = require('../others/upload')
var email = require('../others/config')

//Lấy danh sách sản phẩm 
router.get('/list', async function (req, res, next) {
    try {
        const list = await modelProduct.find();
        res.status(200).json(list)
    } catch (error) {
        res.status(400).json({ "status": true, "message": "Get dữ liệu thất bại" })
    }
})

//Thêm dữ liệu sản phẩm vào mongodb
router.post('/add', async function (req, res, next) {
    try {
        const { name, price, quantity, image, category } = req.body;
        const addProduct = { name, price, quantity, image, category };
        await modelProduct.create(addProduct);
        res.status(200).json({ "status": true, "message": "Thêm dữ liệu thành công" });
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thêm dữ liệu thất bại" });
    }
})

//Lấy dữ liệu sản phẩm theo ID
router.get('/getid/:_id', async function (req, res, next) {
    try {
        const id = await modelProduct.findById(req.params._id);
        res.status(200).json(id)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thêm dữ liệu thất bại" });
    }
})

//Lấy tên và giá của tất cả các sản phẩm 
router.get('/name-price', async function (req, res, next) {
    try {
        const products = await modelProduct.find({}, 'name price');
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

//Lấy thông tin các sản phẩm có giá trên 1000
router.get('/price1000', async function (req, res, next) {
    try {
        const price1000 = await modelProduct.find({ price: { $gt: 1000 } })
        res.status(200).json(price1000)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

//Lấy thông tin các sản phẩm thuộc loại 'Bánh'
router.get('/cake/:category', async function (req, res, next) {
    try {
        const { category } = req.params;
        const cake = await modelProduct.find({ category: category });
        res.status(200).json(cake)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

//Đếm số lượng sản phẩm trong mỗi loại (countDocuments)
router.get('/count', async function(req,res,next){
    const count = await modelProduct.countDocuments();
    res.status(200).json(count);
})

router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
               return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });

    router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
               return res.json({ status: 0, link : [] }); 
            } else {
              const url = [];
              for (const singleFile of files) {
                url.push(`http://localhost:3000/images/${singleFile.filename}`);
              }
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : [] });
        }
    });

    router.post("/send-mail", async function(req, res, next){
        try{
          const {to, subject, content} = req.body;
      
          const mailOptions = {
            from: "phongnguyen <phongps35129@fpt.edu.vn>",
            to: to,
            subject: subject,
            html: content
          };
          await sendMail.transporter.sendMail(mailOptions);
          res.json({ status: 1, message: "Gửi mail thành công"});
        }catch(err){
          res.json({ status: 0, message: "Gửi mail thất bại"});
        }
      });
      
      
module.exports = router;
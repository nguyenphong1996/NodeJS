var express = require('express');
var router = express.Router();
var modelProduct = require('../models/product');
var upload = require('../others/upload')
var email = require('../others/config')

/**
 * @swagger
 * /products/list:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     responses:
 *       200:
 *         description: Trả về danh sách tất cả sản phẩm
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/list', async function (req, res, next) {
    try {
        const list = await modelProduct.find();
        res.status(200).json(list)
    } catch (error) {
        res.status(400).json({ "status": true, "message": "Get dữ liệu thất bại" })
    }
})

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Thêm một sản phẩm mới
 *     parameters:
 *       - in: body
 *         name: product
 *         description: Sản phẩm cần tạo
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - price
 *             - quantity
 *             - image
 *             - category
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 *             quantity:
 *               type: number
 *             image:
 *               type: string
 *             category:
 *               type: string
 *     responses:
 *       200:
 *         description: Thêm sản phẩm thành công
 *       400:
 *         description: Thêm sản phẩm thất bại
 */
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

/**
 * @swagger
 * /products/getid/{_id}:
 *   get:
 *     summary: Lấy sản phẩm theo ID
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID của sản phẩm cần lấy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy sản phẩm thất bại
 */
router.get('/getid/:_id', async function (req, res, next) {
    try {
        const id = await modelProduct.findById(req.params._id);
        res.status(200).json(id)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

/**
 * @swagger
 * /products/name-price:
 *   get:
 *     summary: Lấy tên và giá của tất cả sản phẩm
 *     responses:
 *       200:
 *         description: Lấy tên và giá của tất cả sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/name-price', async function (req, res, next) {
    try {
        const products = await modelProduct.find({}, 'name price');
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

/**
 * @swagger
 * /products/price1000:
 *   get:
 *     summary: Lấy các sản phẩm có giá lớn hơn 1000
 *     responses:
 *       200:
 *         description: Lấy sản phẩm có giá lớn hơn 1000 thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/price1000', async function (req, res, next) {
    try {
        const price1000 = await modelProduct.find({ price: { $gt: 1000 } })
        res.status(200).json(price1000)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

/**
 * @swagger
 * /products/cake/{category}:
 *   get:
 *     summary: Lấy các sản phẩm thuộc loại bánh
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: Loại sản phẩm cần lấy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/cake/:category', async function (req, res, next) {
    try {
        const { category } = req.params;
        const cake = await modelProduct.find({ category: category });
        res.status(200).json(cake)
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
})

/**
 * @swagger
 * /products/count:
 *   get:
 *     summary: Đếm số lượng sản phẩm
 *     responses:
 *       200:
 *         description: Đếm số lượng sản phẩm thành công
 */
router.get('/count', async function(req,res,next){
    const count = await modelProduct.countDocuments();
    res.status(200).json(count);
})

/**
 * @swagger
 * /products/quantity-10:
 *   get:
 *     summary: Lấy các sản phẩm có số lượng ít hơn 10
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/quantity-10', async function(req, res, next) {
    try {
        const products = await modelProduct.find({ quantity: { $lt: 10 } });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
});

/**
 * @swagger
 * /products/update-price/{id}:
 *   put:
 *     summary: Cập nhật giá của sản phẩm theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm cần cập nhật
 *         schema:
 *           type: string
 *       - in: body
 *         name: price
 *         required: true
 *         description: Giá mới của sản phẩm
 *         schema:
 *           type: object
 *           properties:
 *             price:
 *               type: number
 *     responses:
 *       200:
 *         description: Cập nhật giá sản phẩm thành công
 *       400:
 *         description: Cập nhật giá sản phẩm thất bại
 */
router.put('/update-price/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const product = await modelProduct.findByIdAndUpdate(id, { price: price }, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Cập nhật giá thất bại" });
    }
});

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       400:
 *         description: Xóa sản phẩm thất bại
 */
router.delete('/delete/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        await modelProduct.findByIdAndDelete(id);
        res.status(200).json({ "status": true, "message": "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Xóa sản phẩm thất bại" });
    }
});

/**
 * @swagger
 * /products/price-range:
 *   get:
 *     summary: Lấy các sản phẩm có giá từ 500 đến 1500
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/price-range', async function(req, res, next) {
    try {
        const products = await modelProduct.find({ price: { $gte: 500, $lte: 1500 } });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
});

/**
 * @swagger
 * /products/name-quantity-more-than-20:
 *   get:
 *     summary: Lấy tên và số lượng các sản phẩm có số lượng lớn hơn 20
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/name-quantity-more-than-20', async function(req, res, next) {
    try {
        const products = await modelProduct.find({ quantity: { $gt: 20 } }, 'name quantity');
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
});

/**
 * @swagger
 * /products/most-expensive:
 *   get:
 *     summary: Lấy sản phẩm đắt nhất
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/most-expensive', async function(req, res, next) {
    try {
        const product = await modelProduct.findOne().sort({ price: -1 });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
});

/**
 * @swagger
 * /products/cheapest:
 *   get:
 *     summary: Lấy sản phẩm rẻ nhất
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/cheapest', async function(req, res, next) {
    try {
        const product = await modelProduct.findOne().sort({ price: 1 });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
});

/**
 * @swagger
 * /products/average-price:
 *   get:
 *     summary: Lấy giá trung bình của các sản phẩm
 *     responses:
 *       200:
 *         description: Lấy giá trung bình thành công
 *       400:
 *         description: Lấy dữ liệu thất bại
 */
router.get('/average-price', async function(req, res, next) {
    try {
        const avgPrice = await modelProduct.aggregate([
            { $group: { _id: null, avgPrice: { $avg: '$price' } } }
        ]);
        res.status(200).json(avgPrice);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Lấy dữ liệu thất bại" });
    }
});

/**
 * @swagger
 * /products/total-value:
 *   get:
 *     summary: Tính tổng giá trị của tất cả sản phẩm (số lượng * giá)
 *     responses:
 *       200:
 *         description: Tính tổng giá trị thành công
 *       400:
 *         description: Tính tổng giá trị thất bại
 */
router.get('/total-value', async function(req, res, next) {
    try {
        const totalValue = await modelProduct.aggregate([
            { $project: { totalValue: { $multiply: ['$price', '$quantity'] } } },
            { $group: { _id: null, totalValue: { $sum: '$totalValue' } } }
        ]);
        res.status(200).json(totalValue);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Tính tổng giá trị thất bại" });
    }
});

/**
 * @swagger
 * /products/upload:
 *   post:
 *     summary: Upload hình ảnh sản phẩm
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Hình ảnh sản phẩm cần upload
 *     responses:
 *       200:
 *         description: Upload hình ảnh thành công
 *       400:
 *         description: Upload hình ảnh thất bại
 */
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


/**
 * @swagger
 * /products/uploads:
 *   post:
 *     summary: Upload nhiều hình ảnh sản phẩm
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Hình ảnh sản phẩm cần upload
 *         multiple: true
 *     responses:
 *       200:
 *         description: Upload hình ảnh thành công
 *       400:
 *         description: Upload hình ảnh thất bại
 */
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

/**
 * @swagger
 * /products/send-mail:
 *   post:
 *     summary: Gửi email
 *     parameters:
 *       - in: body
 *         name: email
 *         description: Thông tin email cần gửi
 *         schema:
 *           type: object
 *           required:
 *             - to
 *             - subject
 *             - content
 *           properties:
 *             to:
 *               type: string
 *             subject:
 *               type: string
 *             content:
 *               type: string
 *     responses:
 *       200:
 *         description: Gửi email thành công
 *       400:
 *         description: Gửi email thất bại
 */
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

var express = require('express');
var router = express.Router();

const students = [
    {"MSSV": "ps1", "Hoten": "Nguyen Van A", "Lop": "CNTT1", "DTB": 5.7},
    {"MSSV": "ps2", "Hoten": "Tran Thi B", "Lop": "CNTT1", "DTB": 9.2},
    {"MSSV": "ps3", "Hoten": "Le Van C", "Lop": "CNTT2", "DTB": 6.3},
    {"MSSV": "ps4", "Hoten": "Pham Thi D", "Lop": "CNTT2", "DTB": 7.8},
    {"MSSV": "ps5", "Hoten": "Vu Van E", "Lop": "CNTT3", "DTB": 8.1},
    {"MSSV": "ps6", "Hoten": "Do Thi F", "Lop": "CNTT3", "DTB": 4.5},
    {"MSSV": "ps7", "Hoten": "Bui Van G", "Lop": "CNTT4", "DTB": 7.2},
    {"MSSV": "ps8", "Hoten": "Hoang Thi H", "Lop": "CNTT4", "DTB": 6.9},
    {"MSSV": "ps9", "Hoten": "Phan Van I", "Lop": "CNTT5", "DTB": 9.5},
    {"MSSV": "ps10", "Hoten": "Nguyen Thi J", "Lop": "CNTT5", "DTB": 5.3}
]

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json(students);
});

router.post('/add', function(req, res, next) {
    const {MSSV,Hoten,Lop,DTB} = req.body;
    var add = {MSSV:MSSV, Hoten:Hoten, Lop:Lop, DTB:DTB};
    students.push(add);
    res.status(201).json(students);
});

router.put('/update', function(req,res,next){
    const {MSSV,Hoten,Lop,DTB} = req.body;

    var updateSV = students.find(p => p.MSSV === MSSV)

    updateSV.Hoten = Hoten;
    updateSV.Lop = Lop;
    updateSV.DTB = DTB;

    res.status(401).json(students);
});

router.delete('/delete/:MSSV', function (req,res,next){
    const {MSSV} = req.params;

    var index = students.findIndex(x => x.MSSV === MSSV)
    students.splice(index,1);
    res.status(200).json(students)
});

router.get('/get/:MSSV', function(req,res,next){
    const {MSSV} = req.params;
    var search = students.find(s => s.MSSV === MSSV);
    if(search){
        res.status(200).json(search);
    }
    else{
        res.status(404).json({message: "Mã số sinh viên không tồn tại"})
    }

});

router.get('/sort', function(req,res,next){
    const {DTB} = req.body;
    const dtb = students.filter(p => p.DTB >= 6.5 && p.DTB <= 8.0)
    res.status(200).json(dtb)
})
router.get('/sort9', function(req,res,next){
    const {DTB} = req.body;
    const dtb9 = students.filter(p => p.DTB >= 9.0)
    res.status(200).json(dtb9)
})

router.get('/sortTB', function(req,res,next){
    const studentsArray = [...students];
    studentsArray.sort((a,b) => a.DTB - b.DTB)
    res.json(studentsArray)
})
module.exports = router;

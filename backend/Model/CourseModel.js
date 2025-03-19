const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"../frontend/public/uploads");
    },
    filename: function(req,file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 20000000},
    fileFilter: function(req,file,cb){
        checkFileType(file, cb);
    }     
});

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb(new Error("Error: Only images, PDF, and Word documents are allowed!"))
    }

}

//mongoose schema and model

const CourseSchema = new Schema({
    year: {
        type: String,
        required: true
    },
    moduleName: {
        type: String,
        required: true 
    },
    description: {
        type: Number,
       
    },
    lectures: [{ 
        type: String, 
        maxlength: 6 
    }],
    documents: [{ 
        type: String, 
        maxlength: 5 
    }],
     timestamps: true 

});

const course = mongoose.model("course", CourseSchema);

module.exports = {
    course,
    upload
};
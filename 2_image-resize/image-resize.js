const sharp = require('sharp');

const resize = async (height, width, filename) => {
    console.log("Resizing..................");
    try{
    let buffer = await sharp(`/tmp/1${filename}`).resize(height, width).toBuffer();
    
    let resizedFile = await sharp(buffer).toFile(`/tmp/${filename}`);
    console.log({resizedFile});
    }
    catch(err){
        console.log(err);
    }
};

module.exports = resize;
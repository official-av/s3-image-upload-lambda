const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    
     let res=await temp();
     
     function temp() {
        let promArr=[];
        let images =JSON.parse(event.body).img_array;
        images.forEach((img) => {
             let decodedImage = Buffer.from(img.data, 'base64');
             const filePath = "images/" + img.name + ".jpg";
             const params = {
               "Body": decodedImage,
               "Bucket": "av-s3-upload",
               "Key": filePath
             };
             let prom=new Promise((resolve)=>{
                s3.upload(params, function(err, data){
                   if(err) {
                       callback(err, null);
                   } else {
                       resolve(data.Location);
                   }
                });
             });
             promArr.push(prom);
        });
        return Promise.all(promArr);
     }
     
    let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify({imgurls:res}),
        "isBase64Encoded": false
    }
    callback(null,response);
};
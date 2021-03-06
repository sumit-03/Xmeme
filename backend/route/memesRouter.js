require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const memeSchema = require('../memeSchema');
const fs = require('fs');
const path = require('path');

// making connection to mongoDb Database
console.log(process.env.MONGODB_NAME)

if(process.env.NODE_ENV === "development") {
    mongoose.connect(`mongodb://localhost:27017/${process.env.MONGODB_NAME}`, 
                {   
                    useNewUrlParser: true, 
                    useUnifiedTopology: true,
                    useCreateIndex: true
                })
                .then((msg) => {
                    console.log("Successfully connected to DB!" + msg);
                })
                .catch((err) => {
                    console.log("Failed to connect to DB !ohho" + err);
                });
} else if(process.env.NODE_ENV === "production") {
    mongoose.connect(process.env.MONGODB_URI, 
                {   
                    useNewUrlParser: true, 
                    useUnifiedTopology: true,
                    useCreateIndex: true
                })
                .then((msg) => {
                    console.log("Successfully connected to DB!" + msg);
                })
                .catch((err) => {
                    console.log("Failed to connect to DB !ohho" + err);
                });
}



// pointing to memes collection
const Memes = mongoose.model('Meme', memeSchema);

/**
 *  POST /memes
 */
router.post('/', (req, res) =>{
    const name = req.body.name,
        caption = req.body.caption,
        url = req.body.url;
    
    // TODO: save the new meme or raise an error if it already exist
    // allocate a unique id for the meme and return it as a json response.
    
    // getting id
    let _id_file_uri = path.resolve(__dirname, "../_id.txt"), 
        _id_content = fs.readFileSync(_id_file_uri),
        id = _id_content.toString(),
        next_id = parseInt(id) + 1;
    
    // saving the meme into Db if it is a fresh new meme
    checkIfAlreadyExist(name, url, caption)
    .then(() => {
        new Memes({
            id: id,
            name: name,
            url: url, 
            caption: caption,
            time_stamp: new Date().getTime()
        }).save((err) => {
            if(err) {
                console.log(err._message);
                res.status(404).json(monogo_error_response);
            }
            else {
                console.log("meme saved successfully");
                // writing next_id
                fs.writeFileSync(_id_file_uri, next_id.toString());

                // sending json response
                res.json({
                    "id": id
                });
            }
        });
    })
    .catch((msg) => {
        if(msg === "exist") {
            res.status(409).json({
                msg: "target meme is already present"
            })
        } else {
            console.log(err);
            res.status(404).json(monogo_error_response);
        }
        
    })
    

    
});


/**
 *  GET /memes
 */
router.get('/', (req, res) => {

    // TODO: return all memes created till now
    // If there are no memes available, an empty array shall be returned.
    Memes.find({}, {'_id':0, 'id':1, 'name':1, 'url':1, 'caption':1, 'time_stamp': 1}, {sort: {'time_stamp': -1}, limit: 101})
    .then((docs) => {
        // return an array of documents
        res.send(docs);
    })
    .catch((err) => {
        console.log(err._message);
        res.status(404).json(monogo_eroro_response);
    })

    
});

/**
 *  GET /memes/id
 */
router.get('/:id', (req, res) => {
    // TODO: return a particular meme
    // If a meme with that Id doesn’t exist, a 404 HTTP response code should be returned

    Memes.findOne({'id': req.params.id}, {'_id':0, 'id':1, 'name':1, 'url':1, 'caption':1, 'time_stamp': 1})
    .then((docs) => {
        if(!docs) {
            console.log("meme not found");
            res.json({
                status : 404,
                msg: "meme not found"
            });
        } else {
            // returns the particular document
            res.send(docs);
        }
        
    })
    .catch((err) => {
        console.log(err._message);
        res.status(404).json(monogo_eroro_response);
    })
});


/**
 * PATCH /memes/id
 */
router.patch('/:id', (req, res) => {
    let url = req.body.url,
        caption = req.body.caption;
    
    if(url.length && caption.length) {
        Memes.updateOne({'id': req.params.id}, {'url': url, 'caption': caption}, (err, res) => {
            if(err) {
                res.status(404).json(monogo_eroro_response);
            }
        })
    } 
    else {
        if(url.length) {
            Memes.updateOne({'id': req.params.id}, {'url': url}, (err, res) => {
                if(err) {
                    res.status(404).json(monogo_eroro_response);
                }
            })
        }
        if(caption.length) {
            Memes.updateOne({'id': req.params.id}, {'caption': caption}, (err, res) => {
                if(err) {
                    res.status(404).json(monogo_eroro_response);
                }
            })
        }
    }

    res.status(200).send('Updated Successfully');
})

/**
 *  DELETE /memes/id (for admin use)
 */
router.delete('/:id', (req, res) => {

    checkIfAlreadyExistWithID(req.params.id)
    .then(() => {
        Memes.deleteOne({'id': req.params.id})
        .then((result) => {
            console.log("Successfully deleted the requested meme! Hurrey");
            res.json({
                msg: "Successfully deleted!"
            })
        })
        .catch((err) => {
            console.log(err._message);
        })
        
    })
    .catch((err)=>{
        if(err === "not-exist") {
            console.log("requested meme for deleting is not present");
            res.json({
                status: 404,
                msg: "meme not found"
            })
        } else {
            console.log(err);
        }
        
    })
    

});


function checkIfAlreadyExist(name, url, caption) {
    return new Promise((resolve, reject) => {
        Memes.findOne({'name': name, 'url': url, 'caption': caption}, (err, docs)=>{
            if(!docs) resolve();
            else if(err) reject("mongo_error_in_checkIfAlreadyExist");
            else reject("exist");
        })
    })
}

function checkIfAlreadyExistWithID(id) {
    return new Promise((resolve, reject) => {
        Memes.findOne({'id': id}, (err, docs)=>{
            if(docs) resolve();
            else if(err) reject("mongo_error_in_checkIfAlreadyExistWithID");
            else reject("not-exist");
        })
    })
}

monogo_error_response = {
    error: 'mongo_error_occurred'
}

module.exports = router;






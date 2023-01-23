const MongoDB = require('mongoose');

exports.connect = () => {
    MongoDB.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: !false,
            useUnifiedTopology: !false
        }).then(() => {
            console.log("Mongoose Connected".toUpperCase());
        }).catch((err) => {
            console.log("Mongoose Error".toUpperCase());
            console.error(err);
            process.exit(1);
        })
}
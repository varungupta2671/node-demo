if (process.env.NODE_ENV == 'dev') {
    exports.config = {
        PORT : 8003,
        dbURI : "mongodb://altasknodeuser:adUkxsdevaprabhuFGF6jda@127.0.0.1/altaskdb"
    }
}

else if (process.env.NODE_ENV == 'test') {
    exports.config = {
        PORT : 8003,
        dbURI : "mongodb://altasknodeuser:adUkxsdevaprabhuFGF6jda@127.0.0.1/altaskdb"
    }
}

else {
    exports.config = {
        PORT : 8003,
        dbURI : "mongodb://altasknodeuser:adUkxsdevaprabhuFGF6jda@127.0.0.1/altaskdb"
    };
}

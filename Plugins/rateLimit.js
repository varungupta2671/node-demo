

exports.plugin = {
    name: 'limit-rate-plugin',

    register: async (server) => {
        let limitRate = {
            plugin: require('hapi-rate-limit'),
            options: {
                enabled : true,
                userLimit : 100,
                pathLimit : 100,
                userCache:{
                  segment:"hapi-rate-limit-user",
                  expiresIn: (60000 * 15)
                },
                pathCache :{
                  segment:"hapi-rate-limit-path",
                  expiresIn: (60000 * 15),
                }
              }
        };
        await server.register(
            limitRate
        );
        winston.info('limit Rate Loaded');
    }
};

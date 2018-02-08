export default {
    jsonRendererService: {
        path: `${__dirname}/json-renderer-service`,
        dependencies: [
            `responseDtoToJsonTransformer`
        ]
    },
    responseDtoToJsonTransformer: {
        path: `${__dirname}/response-dto-to-json-transformer`,
        dependencies: []
    },
};
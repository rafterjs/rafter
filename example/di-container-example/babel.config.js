const presets = [
    [
        '@babel/env',
        {
            targets: {
                node: '8'
            }
        }
    ]
];

const plugins = [
    [
        '@babel/plugin-proposal-decorators',
        {'legacy': true}
    ]
];

module.exports = {presets, plugins};

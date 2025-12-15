const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: env.mode || 'development',
    },
    argv
  );

  if (config.stats) {
    config.stats.warningsFilter = [
      /shadow.*style props are deprecated/,
      /props\.pointerEvents is deprecated/,
    ];
  } else {
    config.stats = {
      warningsFilter: [
        /shadow.*style props are deprecated/,
        /props\.pointerEvents is deprecated/,
      ],
    };
  }

  return config;
};
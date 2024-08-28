const config = require('./dist/config').default;

module.exports = {
  mongodb: {
    url: config.databaseUrl,
    databaseName: 'ideaexchange',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};
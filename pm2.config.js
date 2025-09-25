export default {
  apps: [
    {
      name: 'My Application',
      max_memory_restart: '800M',
      script: 'index.js',
      node_args: '-r dotenv/config',
    },
  ],
};

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  require("./bin/www");
  console.log(`Worker ${process.pid} started`);
}
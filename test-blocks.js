const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const GRPC_HOST = 'localhost:10009'
const MACAROON_PATH = 'dev/lnd/regtest/lnd1.admin.macaroon'
const TLS_PATH = 'dev/lnd/tls.cert'

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(['dev/lnd/protos/lightning.proto', 'dev/lnd/protos/chainnotifier.proto'], loaderOptions);
const chainrpc = grpc.loadPackageDefinition(packageDefinition).chainrpc;
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
const tlsCert = fs.readFileSync(TLS_PATH);
const sslCreds = grpc.credentials.createSsl(tlsCert);
const macaroon = fs.readFileSync(MACAROON_PATH).toString('hex');
const macaroonCreds = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
  let metadata = new grpc.Metadata();
  metadata.add('macaroon', macaroon);
  callback(null, metadata);
});
let creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
let client = new chainrpc.ChainNotifier(GRPC_HOST, creds);
let request = {
  // hash: <bytes>,
  // height: <uint32>,
};
let call = client.registerBlockEpochNtfn(request);
call.on('data', function({ height, hash } ) {
  console.log(`Height: ${height} - ${hash.reverse().toString('hex')}`);
});
call.on('status', function(status) {
  // The current status of the stream.
});
call.on('end', function() {
  // The server has closed the stream.
});

container_id=$(docker ps -q -f status=running -f name="bitcoind")
walletname="testwallet"
docker exec $container_id bitcoin-cli createwallet $walletname true
docker exec $container_id bitcoin-cli listwallets
docker exec $container_id bitcoin-cli -rpcwallet=$walletname generatetoaddress 101 bcrt1ql37e928305ll8zam0pze4wuwyq8nxka7ff3zpj

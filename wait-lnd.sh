container_name="lnd1"
network="regtest"
expected_state="SERVER_ACTIVE"

# Wait until the LND container is running
while [ -z "$(docker ps -q -f status=running -f name="$container_name")" ]; do
    echo "Waiting for LND container to start..."
    sleep 1
done

# Get the container ID
container_id=$(docker ps -q -f status=running -f name="$container_name")

# Wait until the LND state is SERVER_ACTIVE
while true; do
    state=$(docker exec "$container_id" lncli -n "$network" state | jq -r '.state')
    if [ "$state" = "$expected_state" ]; then
        echo "LND state is $expected_state"
        break
    else
        echo "Waiting for LND state ($state) to be $expected_state..."
        sleep 2
    fi
done

echo "LND container started..."

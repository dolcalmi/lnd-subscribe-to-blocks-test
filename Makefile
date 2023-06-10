start-deps:
	docker compose up -d

clean-deps:
	docker compose down --volumes --remove-orphans -t 3

reset-deps: clean-deps start-deps

start: reset-deps
	./bitcoind-init.sh > /dev/null
	./wait-lnd.sh > /dev/null
	node test-blocks.js & ./bitcoind.sh > /dev/null

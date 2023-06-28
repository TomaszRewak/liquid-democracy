psql -U postgres -h 127.0.0.1 -d liquid_democracy -f ./drop.sql
psql -U postgres -h 127.0.0.1 -d liquid_democracy -f ./init.sql
psql -U postgres -h 127.0.0.1 -d liquid_democracy -f ./populate.sql
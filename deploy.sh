if (( $EUID != 0 )); then
    echo "Root permissions required"
    exit
fi

DBUSER="${1:-urlshort}"
PASSWORD="${2:-$(($RANDOM*$RANDOM))}"

mysql < setupDB.sql

mysql --execute="CREATE USER '${DBUSER}'@'localhost' identified by '$PASS'"
mysql --execute="GRANT ALL PRIVILEGES on urlshort.* to '${DBUSER}'@'localhost'"

cat << EOF >> .env
DB_HOST="localhost"
DB_USER="$DBUSER"
DB_PASSWORD="$PASS"
DB_ENGINE="mysql"
EOF

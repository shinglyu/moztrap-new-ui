testclasspath=$1

echo "Remember to edit js/config.js to fit your testing env"
cd ../..
python -m SimpleHTTPServer 8888 > /dev/null 2>&1 &
serverpid=$!
cd -
python test.py $testclasspath

DEADLINE=1   #seconds to wait
kill $serverpid
#sleep $DEADLINE 
#if kill -KILL $serverpid
#then 
#echo "Warning: at least one process had not finished in $DEADLINE seconds" >&2
#  sleep 1   ## Wait for these just-killed processes to actually die and free their ports
#fi 

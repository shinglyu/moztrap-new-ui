cd ../..
python -m SimpleHTTPServer &
serverpid=$!
cd -
python test.py

DEADLINE=1   #seconds to wait
kill $serverpid
#sleep $DEADLINE 
#if kill -KILL $serverpid
#then 
#echo "Warning: at least one process had not finished in $DEADLINE seconds" >&2
#  sleep 1   ## Wait for these just-killed processes to actually die and free their ports
#fi 

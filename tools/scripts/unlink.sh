#! /bin/sh

ORIGINAL_PATH=`pwd`
find $1 -type d -maxdepth 1 -mindepth 1 | while read d; do
  PACKAGE_NAME=$(basename $d)
  VOLTA_PATH=$VOLTA_HOME/tools/image/packages/${PACKAGE_NAME}
  echo "Running npm unlink inside $d for $PACKAGE_NAME"
  unlink $VOLTA_HOME/tools/shared/${PACKAGE_NAME}
  rm -fr $VOLTA_PATH
  unlink /Users/sergey/.volta/bin/$PACKAGE_NAME
  rm -f $VOLTA_HOME/tools/user/packages/$PACKAGE_NAME.json
  # cd $d && npm unlink
done
cd $ORIGINAL_PATH

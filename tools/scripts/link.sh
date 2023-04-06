#! /bin/sh

ORIGINAL_PATH=`pwd`
find $1 -type d -maxdepth 1 -mindepth 1 | while read d; do
  PACKAGE_NAME=$(basename $d)
  VOLTA_PATH=$VOLTA_HOME/tools/image/packages/${PACKAGE_NAME}
  echo "Running npm link inside $d for $PACKAGE_NAME"
  ln -s $d $VOLTA_HOME/tools/shared/${PACKAGE_NAME}
  mkdir -p $VOLTA_PATH/bin
  ln -s $d/bin/index.js $VOLTA_PATH/bin/$PACKAGE_NAME
  mkdir -p $VOLTA_PATH/lib/node_modules
  ln -s $d $VOLTA_PATH/lib/node_modules/$PACKAGE_NAME
  ln -s /Users/sergey/.volta/bin/volta-shim /Users/sergey/.volta/bin/$PACKAGE_NAME

  NODE_VERSION=`node -v | sed 's/v//g'`
  echo
(cat <<- _EOF_
{
  "name": "$PACKAGE_NAME",
  "version": "0.1.18",
  "platform": {
    "node": "$NODE_VERSION",
    "npm": null,
    "pnpm": null,
    "yarn": null
  },
  "bins": [
    "$PACKAGE_NAME"
  ],
  "manager": "Npm"
}
_EOF_
) > $VOLTA_HOME/tools/user/packages/$PACKAGE_NAME.json
done
cd $ORIGINAL_PATH

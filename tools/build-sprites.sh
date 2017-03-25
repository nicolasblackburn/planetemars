#!/bin/bash
# usage: ./build-sprites.sh
#
# Description:
#   Agrandit et construit une feuille de sprites et génère un fichier css
#
# Dépendences:
#   - ImageMagicK
#   - Glue

pushd `dirname $0` > /dev/null
SCRIPTDIR=`pwd -P`
popd > /dev/null

# Répertoires
BASENAME="sprites-scaled"
OUTPUTDIR="$SCRIPTDIR/../css/sprites"
SCALEDDIR="$SCRIPTDIR/../images/sprites-scaled"
SOURCEDIR="$SCRIPTDIR/../images/sprites"

SCALEFACTOR=300%

rm -r "$OUTPUTDIR"

rm -r "$SCALEDDIR"
mkdir "$SCALEDDIR"

# copy files in directory
for f in `ls -1 "$SOURCEDIR"`; do
	cp "$SOURCEDIR/$f" "$SCALEDDIR"
done

# resize files
for f in `ls -1 "$SCALEDDIR"`; do
	echo $f
	convert "$SCALEDDIR/$f" -filter Point -resize $SCALEFACTOR +antialias "$SCALEDDIR/$f"
done

glue "$SCALEDDIR" "$OUTPUTDIR"

sed "s/$BASENAME\.png/sprites\.png/g" "$OUTPUTDIR/$BASENAME.css" > "$OUTPUTDIR/$BASENAME.tmp"
mv "$OUTPUTDIR/$BASENAME.tmp" "$OUTPUTDIR/$BASENAME.css"
sed "s/$BASENAME-//g" "$OUTPUTDIR/$BASENAME.css" > "$OUTPUTDIR/$BASENAME.tmp"
mv "$OUTPUTDIR/$BASENAME.tmp" "$OUTPUTDIR/sprites.css"
mv "$OUTPUTDIR/$BASENAME.png" "$OUTPUTDIR/sprites.png"
rm "$OUTPUTDIR/$BASENAME.css"

# Palette:
# #566b7f
# #a599fc
# #99cafc
# #64c7b3
# #64c766
# #c7bd64
# #c78264
# #4e4754
# #18151a
# #ffffff
#convert tileset-1.png -filter Point -resize 768x768 +antialias tileset-1.png
#convert tileset-2.png -filter Point -resize 768x768 +antialias tileset-2.png
#convert tileset-2.png -fuzz 0% -fill '#a599fc' -opaque '#566b7f' tileset-3.png
#convert tileset-2.png -fuzz 0% -fill '#99cafc' -opaque '#566b7f' tileset-4.png
#convert tileset-2.png -fuzz 0% -fill '#64c7b3' -opaque '#566b7f' tileset-5.png
#convert tileset-2.png -fuzz 0% -fill '#64c766' -opaque '#566b7f' tileset-6.png
#convert tileset-2.png -fuzz 0% -fill '#c7bd64' -opaque '#566b7f' tileset-7.png
#convert tileset-2.png -fuzz 0% -fill '#c78264' -opaque '#566b7f' tileset-8.png
#convert tileset-2.png -fuzz 0% -fill '#4e4754' -opaque '#566b7f' tileset-9.png
#convert tileset-2.png -fuzz 0% -fill '#18151a' -opaque '#566b7f' tileset-10.png
#convert tileset-2.png -fuzz 0% -fill '#ffffff' -opaque '#566b7f' tileset-11.png

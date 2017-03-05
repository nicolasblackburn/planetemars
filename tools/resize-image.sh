#!/bin/bash
# usage: ./resize-image file scale

#DIR=sprites-scaled

#rm -r $DIR
#mkdir $DIR

# copy files in directory
for f in $1; do
	convert "$f" -filter Point -resize $2 +antialias "$f"
done

# resize files
#for f in `ls -1 $DIR`; do
#	echo $f
#	convert "$DIR/$f" -filter Point -resize $2 +antialias "$DIR/$f"
#done

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

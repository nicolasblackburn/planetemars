# planetemars
An unfinished Zelda-ish sci-fi game that I made in javascript.

Check it out live at <a href="http://nblackburn.ca/planetemars/">nblackburn.ca/planetemars/</a>

The whole engine, collisions and animations were programmed from scratch in javascript. Graphics meticulously drawn pixel by pixel using <a href="https://www.gimp.org/">Gimp</a>. I used <a href="http://www.mapeditor.org/">Tiled</a> editor to create the map and export the data to json format. Lots of stuff still to be done. Might continue it some day when I have more time.

Use 'w', 'a', 's', 'd' to move, 'space' to fire bullets.

## Development

I recommend Ubuntu as development environment because that's what I use. Otherwise some tweaking in the process might need a bit of tweaking.

I use Sass and Compass to build the basic Css stylesheet. Now for sprites stylesheet, you might use the shell script `./tools/build-sprites.sh`. It has dependencies on ImageMagick `convert` binary and a little Python script called `glue` that it uses for generating the sprites stylesheet.

It might be a nice idea to package all resources in a single file to optimize page loading time. This is in the to-dos.

In order to start development you need to first clone the repository, then compile the Sass source to Css and then run `./build-sprites.sh` from the `.tools/` directory to generate sprites Css and Png's.

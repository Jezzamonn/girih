#!/bin/bash
# Generates a video using ffmpeg
#
# Always overwrites any existing gif.

<<<<<<< HEAD
temp_dir="/tmp/vid/"
=======
temp_dir="/tmp/gif/"
>>>>>>> 13ed7a3de3349ee225caa1569d294fd2707711a6
out_dir="promo/"
frame_pattern="${temp_dir}frame%004d.png"
palette="/tmp/gif/palette.png"

# Use the hash of the current commit as the name
current_commit=`git rev-parse --short HEAD`
out_filename="${out_dir}${current_commit}.mp4"

# First clear the temp files. Don't care if they don't exist.
rm -r "$temp_dir" 2> /dev/null

# output the frames
node build/save-frames.bundle.js --width=1080 --height=1080 --out="$temp_dir"

<<<<<<< HEAD
ffmpeg -f image2 -i "$frame_pattern" -pix_fmt yuv420p -y "${out_filename}"
=======
ffmpeg -f image2 -i "$frame_pattern" -pix_fmt yuv420p -y "${out_dir}out.mp4"
>>>>>>> 13ed7a3de3349ee225caa1569d294fd2707711a6
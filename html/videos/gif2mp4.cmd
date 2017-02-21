@echo off
REM Encode an animated GIF into HTML5-compatible mp4
setlocal

for %%I in (%*) do (
  title Encoding %%~nI
  color 2f
  ffmpeg -i "%%~dpnI%%~xI" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -r 25 "%%~dpnI.mp4"
)
title Command prompt
color

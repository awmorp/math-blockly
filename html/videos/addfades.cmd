@echo off
REM Add a fadein/fadeout at start/end of video
setlocal enabledelayedexpansion

rem Length of fade (# of frames)
set FADELENGTH=15

for %%I in (%*) do (
  setlocal enabledelayedexpansion
  title Adding fadein/fadeout %%~nI
  for /f %%J in ('getframecount %%I') do set ABC=%%J
  echo Frames: !ABC!
  set /a STARTFADE=!ABC!-15
rem  echo Start fadeout: !STARTFADE!
  
  color 2f
  echo ffmpeg -i %%I -filter:v "fade=in:0:!FADELENGTH!:color=white,fade=out:!STARTFADE!:!FADELENGTH!:color=white" "%%~nI-fades%%~xI"
  ffmpeg -i %%I -filter:v "fade=in:0:!FADELENGTH!:color=white,fade=out:!STARTFADE!:!FADELENGTH!:color=white" "%%~nI-fades-temp%%~xI"
  ffmpeg -i "%%~nI-fades-temp%%~xI" -movflags faststart -pix_fmt yuv420p "%%~nI-fades%%~xI"
  del "%%~nI-fades-temp%%~xI"
)
title Command prompt
color

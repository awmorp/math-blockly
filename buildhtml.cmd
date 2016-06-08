@echo off
setlocal

echo Building index.html
python buildhtml.py index.html

cd html
for /d %%i in ( builder.html logic-exercise.html limit-exercise.html translation-exercise.html vectors.html ) do echo Building %%i & python ..\buildhtml.py %%i


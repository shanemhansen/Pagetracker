#Pagetracker

Page tracker downloads a url and measures the time each packet takes to download. It then prints a summary to the screen
of time to first byte, minimum latency, maximum latency and color coded "hot spots" of which sections of the file
took a long time to  download. It's primarily meant to be used with application servers which stream their content 
such as node.js or tomcat.

## Installation
checkout from git (which you presumably have done).
Install the dependencies from npm (cli-color)

## Usage
Download the file
./app.js http://www.example.com/

Copyright &copy; 2011 Shane Hansen (shanemhansen@gmail.com)

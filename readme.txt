# Installation
1. Download [python] from https://www.python.org/downloads/
2. Open [terminal], navigate to the dashboard folder
3. Start a simple http server using command:
	python -m SimpleHTTPServer 8888
4. Open [Chrome], navigate to localhost:8888/index.html

# Dependencies
1. D3 - chart lib
	http://d3js.org/d3.v3.min.js
2. bower_components
	all the js plugins
 	- bootstrap 
 	- bootstrap-select
 		sidebar dropdown box
 		http://silviomoreto.github.io/bootstrap-select/
 	- bootstrap-datetime
 		sider time picker
 		http://eonasdan.github.io/bootstrap-datetimepicker/Installing/
 	- jquery
 	- jquery-ui
 		rearrange the list of panels
 	- metisMenu
 		a menu lib for layout
 	- moment
 		a time lib
3. Layout is based on:
	http://startbootstrap.com/template-overviews/sb-admin-2/
	relavant layout lib:
	- dist
	- less
4. See color brewer for more color scheme selection
	http://colorbrewer2.org/

# Data
Get lasted MAT Data from
http://matreporting.tutelatechnologies.com/indexMat.php?json=1
then override ./data/MATData.json

# For developers
This project is hosted on a local server
please read the code in the following folders:
./css
./js
./pages/dashboard.html

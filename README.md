STATUS
======

> A network status tool in three acts.

| ![Light graph](https://raw.githubusercontent.com/dominikwilkowski/status/master/assets/graph-light.png) | ![Dark graph](https://raw.githubusercontent.com/dominikwilkowski/status/master/assets/graph-dark.png) |
|---|---|

**Act I**
The **_poller_** that takes a `queue.json` with services and polls them via a `cron` script and saves the request time into a mongo database.

**Act II**
The **_server_** that serves a RESTful API around the data takes `ID` and `period`.

**Act III**
The **_page_** that queries the REST server and visualizes the data in a Google graph.

## Examples

* http://dominikwilkowski.github.io/status/
* https://gel.westpacgroup.com.au/status/
* https://dominik-wilkowski.com/status/


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Content

* [Act I, the poller](#act-i-the-poller)
* [Act II, the server](#act-ii-the-server)
* [Act III, the page](#act-iii-the-page)
* [Install](#install)
* [Build](#build)
* [Tests](#tests)
* [Release History](#release-history-remote)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Act I, the poller

> The poller is to quickly and efficiently request an HTTP service via `POST` or `GET` and record the time it takes into the database.

The poller is called each nth minute to poll your services. I found 10min is enough to provide reasonable accuracy while not spamming your own service.


### The cron script

```shell
*/10 * * * * /usr/bin/node /var/www/html/path/to/poller.js >> /var/path/to/status-poller.log 2>&1
```


### The queue.json

The poller takes a `queue.json` to configure the services you want to poll. It is not limited how many services you want to poll but do consider how long your
poller takes to finish before you set the interval in cron.

```shell
[{
  "ID": "Identifier1",                  #this identifier will be added to the database and this is how you select your dataset later
  "options": {                          #these options are passed into the request call. read more about them: https://github.com/request/request
    "uri": "http://domain.tld/path/",   #URL to poll
    "method": "GET"                     #method
  }
},
{
  "ID": "Identifier2",
  "options": {
    "uri": "https://service.tld:8080/", #you can assign ports and use SSL
    "method": "POST",                   #method can be either POST or GET
    "form": {},                         #add data to submit to your post request
    "encoding": "binary"                #encoding of the data you send
  }
}]
```


### The database

The request time is saved into a [mongo database](https://docs.mongodb.com/) into database `status` collection `data`. The connection is established locally
via `mongodb://127.0.0.1:27017`. You can configure all this in the
[constructor module](https://github.com/dominikwilkowski/status/blob/master/poller/010-constructor.js#L38).
Each pages in the collection will be deleted via its `expireAt` attribute. The index for this is: `expireAfterSeconds: 0` and explained in the
[mongo docs](https://docs.mongodb.com/manual/tutorial/expire-data/#expire-documents-at-a-specific-clock-time). I have set this to 30 days as the server only
queries less than 31 days.


### The alert

When the poller finds a service not responsive via timeout or because an error is returned, it will post a message to a slack channel, alerting you. You have
to allow the integration into your slack via your custom integration settings page in your slack account.
(https://your-channel.slack.com/apps/manage/custom-integrations)
The resulting API URL needs to be set in `Poller.SLACKURL` in the
[constructor module](https://github.com/dominikwilkowski/status/blob/master/poller/010-constructor.js#L39).

**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Act II, the server

> The server is to serve the data from the database restfully.


### The server

The server listens restfully on port `1338` and can be configured in the
[constructor module](https://github.com/dominikwilkowski/status/blob/master/server/010-constructor.js#L36).
The request URL has the format: `/status/:period/:ID`.

```shell
https://your-server-domain.tld:1338/status/[period]/[ID]
```

* The `ID` is the ID of the service you assigned in the `queue.json` of your poller.
* The `period` is a keyword for the time-frame of your data. Supported keywords are: `day`, `week` and `month`.

E.g. calling `https://your-server-domain.tld:1338/status/week/website` will get you the dataset for `website` within a period of 7 days.


### The database

The connection is established locally via `mongodb://127.0.0.1:27017`. You can configure all this in the
[constructor module](https://github.com/dominikwilkowski/status/blob/master/server/010-constructor.js#L42).


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Act III, the page

> The page is to visualize the data it gets from the server.

The page is just an example of how you could visualize the data on a page. I use [Google charts](https://developers.google.com/chart/) to draw an SVG graph
with a data table fallback for screen readers.

### The install

_The page_ requires [jQuery](http://jquery.com/), [Moment.js](http://momentjs.com/) and [Google Charts](https://developers.google.com/chart/interactive/docs/).
Include the `page.js` script at the bottom of your page after all dependencies as seen below.
The page code also requires some CSS code that I have attached below as well.

```HTML
<body>
	<p>Your HTML page and content</p>

	<div class="js-status graph" data-id="ID" data-period="day"></div>

	<script src="_prod/jquery-3.1.0.min.js"></script>
	<script src="_prod/moment.min.js"></script>
	<script src="_prod/google-charts.js"></script>
	<script src="_prod/page.js"></script>
	<script type="text/javascript">
		Page.ENDPOINTS = 'http://yourdomain.com/status/';
		Page.init();
	</script>
</body>
```

Required CSS

```css
body {
	background: #263238; /* Adjust to your liking */
	color: #fff;
}

.graph {
	position: relative;
	max-width: 1000px;
	height: 270px;
}

.graph.is-loading::after { /* The loading animation */
	content: 'LOADING';
	position: absolute;
	font-family: sans-serif;
	font-weight: 900;
	color: #ef4723;
	left: 50%;
	top: 50%;
	margin: -9px 0 0 -37px;
	animation: hue 0.7s infinite linear;
}

.graph.has-error::after {
	display: none;
}

.graph.has-error {
	width: auto;
	height: auto;
	color: gray;
}

.no-js .graph { /* Hide when js is turned off */
	display:  none;
}

div.google-visualization-tooltip {
	border: none;
	box-shadow: none;
}

@-webkit-keyframes hue {
	from {
		-webkit-filter:hue-rotate(0)
	}
	to {
		-webkit-filter:hue-rotate(-360deg)
	}
}
@keyframes hue {
	from {
		-webkit-filter:hue-rotate(0)
	}
	to {
		-webkit-filter:hue-rotate(-360deg)
	}
}
```

### The graph HTML

The actual graph can be added to the page by adding below HTML. The script should be included at the bottom of the page and will render each element it finds
on the page.

```html
<div class="js-status graph" data-id="[ID]" data-period="[period]"></div>
```

* The `data-id` attribute takes the identifier you set for your dataset in the `queue.json` of your poller.
* The `data-period` attribute takes the keyword for the time frame of your data. Supported keywords are: `day`, `week` and `month`.


### The addition HTML

Additions can be added in extra HTML elements that give more insight into your data. Supported additions so far are:

* `mean` to show the mean of your data in ms
* `availability` to show the availability of your service in %.

```html
<span class="js-status-availability stats" data-id="[ID]" data-period="[period]"></span>
<span class="js-status-mean stats" data-id="[ID]" data-period="[period]"></span>
```

Each have the same attributes:
* The `data-id` attribute takes the identifier you set for your dataset in the `queue.json` of your poller.
* The `data-period` attribute takes the keyword for the time frame of your data. Supported keywords are: `day`, `week` and `month`.

_Additions can only work in conjunction with graphs of the same ID and period._


### The Javascript

#### Settings

To make the script work for you, adjust the below settings to your liking.

```js
Page.ENDPOINTS = '';  //the URL of the RESTful server to get the data from the db
Page.GRAPH = {};      //you can set the style of the graph here. For more infos have a look at the references over at Google Chart
                      //https://developers.google.com/chart/interactive/docs/gallery/linechart
```

An example for a light graph would be  
![Light graph](https://raw.githubusercontent.com/dominikwilkowski/status/master/assets/graph-light.png)

```js
Page.GRAPH = {
	title: 'The network response time',
	titlePosition: 'none',
	colors: ['#000'],
	backgroundColor: '#f6f7eb',
	lineWidth: 1,
	hAxis: {
		slantedText: false,
		maxAlternation: 1,
		gridlines: {
			color: '#556e79',
		},
	},
	vAxis: {
		title: 'Response time',
		gridlines: {
			color: '#556e79',
		},
	},
	legend: {
		position: 'none'
	},
	chartArea: {
		height: '200'
	},
	annotations: {
		textStyle: {
			color: '#e94f37',
		},
		stem: {
			color: '#e94f37',
			length: 202,
		},
	},
	height: 270,
};
```

And an example for a dark graph  
![Dark graph](https://raw.githubusercontent.com/dominikwilkowski/status/master/assets/graph-dark.png)

```js
Page.GRAPH = {
	title: 'The network response time',
	titlePosition: 'none',
	colors: ['#42a5f5'],
	backgroundColor: '#263238',
	lineWidth: 1,
	hAxis: {
		slantedText: false,
		maxAlternation: 1,
		textStyle: {
			color: '#fff',
		},
		gridlines: {
			color: '#556e79',
		},
	},
	vAxis: {
		title: 'Response time',
		titleTextStyle: {
			color: '#42a5f5',
		},
		textStyle: {
			color: '#fff',
		},
		gridlines: {
			color: '#556e79',
		},
	},
	legend: {
		position: 'none'
	},
	chartArea: {
		height: '200'
	},
	annotations: {
		textStyle: {
			color: '#c80038',
		},
		stem: {
			color: '#c80038',
			length: 202,
		},
	},
	tooltip: {
		isHtml: true,
	},
	height: 270,
};
```

#### `Page.init`
Type: `<public method>`

To start requesting, converting and rendering your data you need to run `Page.init()`. The fact that this is not run automatically gives you the ability
to adjust settings without having to change the js file.

```js
Page.init();
```

#### `Page.data.get`
Type: `<public method>`
* Param 1: `$element` {jQuery object} The DOM element to be replaced with the graph
* Param 2: `ID` {string} The ID of the dataset
* Param 3: `period` {keyword} The period keyword for the time-frame of the data

This public method will get the data for the given options. It will call `Page.render.graph()` once it got the data (which is why it needs `$element`).

```js
Page.data.get( $element, ID, period );
```

#### `Page.data.graph`
Type: `<public method>`
* Param 1: `$element` {jQuery object} The DOM element to be replaced with the graph
* Param 2: `ID` {string} The ID of the dataset
* Param 3: `period` {keyword} The period keyword for the time-frame of the data

This public method will render a graph from the data internally stored by `Page.data.get`.

```js
Page.data.graph( $element, ID, period );
```

#### `Page.data.addition`
Type: `<public method>`
* Param 1: `$element` {jQuery object} The DOM element to be replaced with the graph
* Param 2: `addition` {keyword} What kind of addition is it. Supported keywords are: `day`, `week` and `month`.
* Param 3: `ID` {string} The ID of the dataset
* Param 4: `period` {keyword} The period keyword for the time-frame of the data

This public method will render an addition from the data internally stored by `Page.data.get`.

```js
Page.data.addition( $element, addition, ID, period );
```

Each DOM element gets the class `js-rendered` after it has been rendered. This means running any of the public methods twice won’t actually do anything twice.



**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Install

### Poller

To install the poller upload the `poller.js` from the `_prod/` folder to your server and add a line to your `crontab`.
_Make sure you install all dependencies via `npm i` and use the `package.json`._

```shell
crontab -e
```

and add:

```shell
*/10 * * * * /usr/bin/node /var/www/html/path/to/poller.js >> /var/path/to/status-poller.log 2>&1
```

This will run the poller every 10 min every day and night. Poller adds a line to the log file each time it runs. The log looks like this:

```
Info  Wed Aug 31 2016 22:08:10 GMT+1000 (AEST):  Poll(5) finished in 1844ms
```

### Server

To install the server you must have the dependencies installed via `npm i`. You also must make sure that the script is run again in case you have to reboot
your system. For that case I have included a [shell script](https://github.com/dominikwilkowski/status/blob/master/starterServer.sh) that can re run after
reboot. _Make sure you adjust the path in the script_.

To add the script to your `crontab` run:

```shell
chmod 700 /var/www/html/path/to/starterServer.sh #the starterServer.sh of this repo with the right privileges
crontab -e
```

and add:

```shell
@reboot /var/www/html/path/to/starterServer.sh #run after reboot
```

Now we still have to make sure the node app is restarted if it crashes for some uncaught reason. Install [forever](https://github.com/foreverjs/forever) and
register the task:

```shell
npm i forever -g
forever start -l status.log --append -o statusOut.log -e statusError.log server.js
```


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Build

To build this repo install all dependencies via `npm i` and run `grunt` in the root folder.

```shell
npm install
grunt
```

The grunt task will automatically concatenate all node and javascript into the `_prod` and `_dev` folder.


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Tests

So far I only have one test-server that I use to spoof response times. Once run with `node test/test-server.js` the server will listen on port `8080` and
`8081`.

* Requests to `8080` will have a randomized lag that can exceeds the timeout of the poller. _(That way I can test a none responsive service)_.
* Requests to `8081` will answer right away.


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History remote

* v1.0.1 - Updated dependencies
* v1.0.0 - Improved no-js fallback, split dependencies out into extra files
* v0.1.1 - Added config and removed self calling `init()`
* v0.1.0 - First round

**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## License

Copyright (c) Dominik Wilkowski. Licensed under the [GNU GPLv3](https://raw.githubusercontent.com/dominikwilkowski/status/master/LICENSE).

**[⬆ back to top](#content)**

# };
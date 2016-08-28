STATUS
======

> TODO intro


## Content

* [Install](#install)
* [Build](#build)
* [Tests](#tests)
* [Release History](#release-history-remote)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Install

### Poller

TODO instructions

#### CRON task

TODO instructions

```shell
crontab -e
```

and add:

```shell
*/10 * * * * /usr/bin/node /var/www/html/path/to/poller.js >> /var/log/status-poller.log
```

### Server

TODO instructions

#### CRON task

```shell
chmod 700 /var/www/html/path/to/starterServer.sh #the starterServer.sh of this repo
crontab -e
```

and add:

```shell
@reboot /var/www/html/path/to/starterServer.sh #run after reboot
```

#### FOREVER node deamon

Now we still have to make sure the node app is restarted if it crashes for some uncaught reason. Install [forever](https://github.com/foreverjs/forever) and
register the task:

```shell
npm i forever -g
forever start -l status.log --append -o statusOut.log -e statusError.log server.js
```


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Build

TODO instructions


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Tests

TODO instructions


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History remote

* v0.1.0 - What I started with

**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## License

Copyright (c) Dominik Wilkowski. Licensed under the [GNU GPLv3](https://raw.githubusercontent.com/dominikwilkowski/status/master/LICENSE).

**[⬆ back to top](#content)**

# };
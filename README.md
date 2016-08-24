STATUS
======

> TODO intro


### Content

* [Install](#install)
* [Build](#build)
* [Tests](#tests)
* [Release History](#release-history-remote)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


### Install

#### Poller

TODO instructions

##### CRON task

To make sure the poller is started when the system has to reboot, make sure you add a cron task after reboot:

```shell
chmod 700 /www/status/starter.sh #the starter.sh of this repo
crontab -e
```

and add:

```shell
@reboot /www/status/starter.sh
```

##### FOREVER node deamon

Now we still have to make sure the node app is restarted if it crashes for some uncaught reason. Install [forever](https://github.com/foreverjs/forever) and
register the task:

```shell
npm i forever -g
forever start -l status.log --append -o statusOut.log -e statusError.log poller.js
```

#### Server

TODO instructions

##### CRON task

TODO instructions

##### FOREVER node deamon

TODO instructions


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


### Build

TODO instructions


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


### Tests

TODO instructions


**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


### Release History remote

* v0.1.0 - What I started with

**[⬆ back to top](#content)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


### License

Copyright (c) Dominik Wilkowski. Licensed under the [GNU GPLv3](https://raw.githubusercontent.com/dominikwilkowski/status/master/LICENSE).

**[⬆ back to top](#content)**

# };
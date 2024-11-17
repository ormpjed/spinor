# Run
```shell
bundle install
```

```shell
bundle exec jekyll serve --baseurl=""
```

In the _develop_ environment mode, a mock sensor is used when no physical
sensors are available. Switch environments to disable this feature:
```shell
JEKYLL_ENV=production bundle exec jekyll serve --baseurl=""
```

Sensor access requires a secure context. Use the following proxy to visit the
locally hosted site on a mobile device.
```shell
npx local-ssl-proxy --target 4000
```
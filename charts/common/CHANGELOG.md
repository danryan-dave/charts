# Changelog

## [0.13.0](https://github.com/danryan-dave/charts/compare/common-0.12.0...common-0.13.0) (2026-08-14)


### Features

* **common:** add a configurable preStop drain, defaulting to 20s ([f95d4d2](https://github.com/danryan-dave/charts/commit/f95d4d2a9fc3d981504a08e151090823f716dc65))
* **common:** default minReadySeconds and terminationGracePeriodSeconds to 60 ([fc0b2da](https://github.com/danryan-dave/charts/commit/fc0b2dae65651ce074ec19bfb6221403c0b17f50))
* **common:** default minReplicas to 2 for canary-enabled services ([50e29b8](https://github.com/danryan-dave/charts/commit/50e29b869e1304017f7570a1b802bd18c0965937))
* **common:** floor the reverse proxy at 2 replicas ([3229434](https://github.com/danryan-dave/charts/commit/3229434c73725d88d7f69a73ebca77d55822087e))
* **common:** render the app preStop drain as a native sleep action ([7647554](https://github.com/danryan-dave/charts/commit/764755426145eef11f327bf90a3abf4cd5a1c5d2))
* **common:** support minReadySeconds with a reverse-proxy override ([cc65134](https://github.com/danryan-dave/charts/commit/cc65134d8280106e24d5333563c8a714755bbdf4))


### Bug Fixes

* **common:** correct rproxy grace period 0 semantics and its guard ([7ca2f8a](https://github.com/danryan-dave/charts/commit/7ca2f8ad1bd6487b60ae4fa0ed7507c204fb19f8))
* **common:** correct rproxy topology spread selector and scope skew per revision ([3504efe](https://github.com/danryan-dave/charts/commit/3504efe51df0cf7b90613b73473370de1f948bf3))
* **common:** give scaledobject's minReplicas one type ([c4531a6](https://github.com/danryan-dave/charts/commit/c4531a6bd07e5f3ec8e752bcef405b6ed7804092))
* **common:** keep the cloudsql proxy alive as long as the app it serves ([78a833b](https://github.com/danryan-dave/charts/commit/78a833bbb1ca5c1cb39a46e97b0bbf986038735a))
* **common:** respect kedaScaling.minReplicas/maxReplicas: 0 ([2703a1b](https://github.com/danryan-dave/charts/commit/2703a1b4ec7a7ad98bc20d7151ed8a94dc372f3f))
* **common:** respect kedaScaling.minReplicas/maxReplicas: 0 ([5b1031e](https://github.com/danryan-dave/charts/commit/5b1031ebc8cbe1d1a96d0861803939f298a5443d))

## [0.12.0](https://github.com/danryan-dave/charts/compare/common-0.11.0...common-0.12.0) (2026-08-14)


### Features

* **common:** add a configurable preStop drain, defaulting to 20s ([f95d4d2](https://github.com/danryan-dave/charts/commit/f95d4d2a9fc3d981504a08e151090823f716dc65))
* **common:** default minReadySeconds and terminationGracePeriodSeconds to 60 ([fc0b2da](https://github.com/danryan-dave/charts/commit/fc0b2dae65651ce074ec19bfb6221403c0b17f50))
* **common:** default minReplicas to 2 for canary-enabled services ([50e29b8](https://github.com/danryan-dave/charts/commit/50e29b869e1304017f7570a1b802bd18c0965937))
* **common:** floor the reverse proxy at 2 replicas ([3229434](https://github.com/danryan-dave/charts/commit/3229434c73725d88d7f69a73ebca77d55822087e))
* **common:** render the app preStop drain as a native sleep action ([7647554](https://github.com/danryan-dave/charts/commit/764755426145eef11f327bf90a3abf4cd5a1c5d2))
* **common:** support minReadySeconds with a reverse-proxy override ([cc65134](https://github.com/danryan-dave/charts/commit/cc65134d8280106e24d5333563c8a714755bbdf4))


### Bug Fixes

* **common:** correct rproxy grace period 0 semantics and its guard ([7ca2f8a](https://github.com/danryan-dave/charts/commit/7ca2f8ad1bd6487b60ae4fa0ed7507c204fb19f8))
* **common:** correct rproxy topology spread selector and scope skew per revision ([3504efe](https://github.com/danryan-dave/charts/commit/3504efe51df0cf7b90613b73473370de1f948bf3))
* **common:** give scaledobject's minReplicas one type ([c4531a6](https://github.com/danryan-dave/charts/commit/c4531a6bd07e5f3ec8e752bcef405b6ed7804092))
* **common:** keep the cloudsql proxy alive as long as the app it serves ([78a833b](https://github.com/danryan-dave/charts/commit/78a833bbb1ca5c1cb39a46e97b0bbf986038735a))
* **common:** respect kedaScaling.minReplicas/maxReplicas: 0 ([2703a1b](https://github.com/danryan-dave/charts/commit/2703a1b4ec7a7ad98bc20d7151ed8a94dc372f3f))
* **common:** respect kedaScaling.minReplicas/maxReplicas: 0 ([5b1031e](https://github.com/danryan-dave/charts/commit/5b1031ebc8cbe1d1a96d0861803939f298a5443d))

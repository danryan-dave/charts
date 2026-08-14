# Dave Helm Charts
Collection of common sub charts to bootstrap common applications

## Prereq
1. Helm 4.2 (CI pins the version in `.github/workflows/release.yml`)
2. Node 24, via `nvm use` (`.nvmrc`), then `npm ci` to install the git hooks

## To develop locally

> [!IMPORTANT]
> Do not edit the `version` in `Chart.yaml`. Versions are derived from commit
> messages and written by the release workflow. See [CONTRIBUTING.md](CONTRIBUTING.md).

1. Choose chart you wish to update. For example `common`. Note its current `charts/common/Chart.yaml` version.
2. In the sre repo cd into the directory of the chart you wish to test. For example `notification-service`
3. With your current directory of charts/notification-service/production update the Chart.yaml file to point to the local file system path and the updated version you chose in step 1. Below shows an example `sre/charts/notification-service/production/Chart.yaml`

```
apiVersion: v2
name: notification-service
version: 1.0.0
dependencies:
  - name: common
    version: 1.0.0-bei-719 #<-- Note!
    repository: "file://../charts/charts/common" #<--Note!
    alias: notification-service
...
  ```
4. Run `helm dependency update`. This will copy over the chart into this repo. Make you you don't commit it.
5. Run `helm template .`. This will render out the Kubernetes manifest objects with the variables replaced to the `stdout`. The output should be a valid yaml file that could be directly applied in a GKE cluster. If there are errors the templating engine will write it to the `stderr`

## Validations through JSON schema

> [!NOTE]
> `values.schema.json` is generated from `schemas/`. The release pipeline
> regenerates and commits it, so you do not need to update it by hand or ask SRE.
> Editing it directly will be overwritten on the next release of that chart.

We use JSON schema to validate our custom charts. To enable that feature a `values.schema.json` file at the root directory for a given chart must be present. e.g. `charts/common/values.schema.json`.

Both `helm template`, `helm lint` are JSON schema aware. `helm template` in specific is what ArgoCD uses to render the kubernetes manifests.

For our use case, we have decided to have a means to bundle together the schema files that can be found under the root directory for any given chart (e.g. `charts/common/schemas`) into a resulting `values.schema.json` file. This file gets created by [json-schema-bundler](https://www.npmjs.com/package/@skriptfabrik/json-schema-bundler) through the  [json_schema_bundler.yml](https://github.com/dave-inc/charts/blob/master/.github/workflows/json_schema_bundler.yml) workflow. The main entrypoint for the schemas is `charts/$chart_name/schemas/schema.yaml`. That file should include references to other subschemas so we can leverage modularization.

The reason  we don't use plain `$refs` pointing to a file path is because resolving those references becomes difficult since we have to account for absolute paths, relative paths, and `helm` being able to resolve them under all circumstances. The bundler takes care of that for us.

`json-schema-bundler` also has the benefit of allowing us to use yaml files as schemas improving readability. The bundler will convert them to json before rendering the final `values.schema.json` file.

### Local validations

If you want to introduce a new schema or update an existing one, you can do so by creating a new yaml file under `charts/common/schemas` and then referencing it in `charts/common/schemas/schema.yaml`. The bundler will take care of the rest.

Install [json-schema-bundler](https://www.npmjs.com/package/@skriptfabrik/json-schema-bundler) locally and test things out this way:

```sh
npm install -g @skriptfabrik/json-schema-bundler
cd ${charts_repo}/charts/common
json-schema-bundler -d schemas/schema.yaml > values.schema.json
helm lint .
```

That should be enough to get you started with JSON schema validations.

Remember that `values.schema.json` is a generated file and should not be committed to the repo. The bundler will take care of that for you when the workflow runs.

## To beta test your changes from a feature branch

Publishing a beta from a branch is no longer supported. `master` produces stable
versions only. Test against a local path as described above, or ask SRE in
#sre-support if you need a published prerelease.

## To create release

Merge to `master` with a Conventional Commit PR title. The release workflow works
out each chart's next version from the commits touching it, then tags, packages,
publishes and updates the Helm repo index.

There is no version to bump and no approval step in the chart repo itself.

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit format, branch naming, and how
to add a new chart.

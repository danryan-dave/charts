#!/usr/bin/env bash
#
# semantic-release `prepare` for one chart. Run from the chart directory.
#
#   ../../tools/prepare-chart.sh <version>
#
set -euo pipefail

version="${1:?usage: prepare-chart.sh <version>}"

# Subcharts must be vendored before lint and package. helm lint only warns about
# missing dependencies, but helm package fails outright.
helm dependency update .

# values.schema.json is generated from schemas/. Regenerating it here means a
# release always ships a schema matching the chart's schema sources, rather than
# whatever was last committed by hand.
if [ -f schemas/schema.yaml ]; then
  npx --no -- json-schema-bundler -d schemas/schema.yaml | jq . > values.schema.json
fi

yq -i ".version = \"${version}\"" Chart.yaml

# Lints the chart exactly as it will ship: bumped version, fresh schema,
# dependencies resolved.
helm lint .

helm package . -d ./.cr-release-packages

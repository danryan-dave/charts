import { execFileSync } from "node:child_process";
import { relative, sep } from "node:path";

import { analyzeCommits as defaultAnalyzeCommits } from "@semantic-release/commit-analyzer";
import { generateNotes as defaultGenerateNotes } from "@semantic-release/release-notes-generator";

const commitCache = new Map();
const chartPathCache = new Map();

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

/**
 * Files touched by a commit, as repo-root-relative paths.
 *
 * Returns null for merge commits. Their contents are already represented by the
 * individual commits being merged, so counting them again would duplicate a
 * chart's entries in its changelog.
 */
function readCommitFiles(hash, cwd) {
  const key = `${cwd}\u0000${hash}`;
  if (commitCache.has(key)) return commitCache.get(key);

  let stdout;
  try {
    stdout = git(
      [
        "log",
        "-1",
        "--format=%P",
        "--name-only",
        "--no-renames",
        // Keep paths repo-root-relative even though cwd is the chart directory,
        // and even if diff.relative is set in git config.
        "--no-relative",
        "--first-parent",
        hash,
      ],
      cwd
    );
  } catch (error) {
    throw new Error(
      `semantic-release-path-filter: could not read commit ${hash}: ${error.message}`
    );
  }

  const [parentLine, ...rest] = stdout.split("\n");
  const parentCount = parentLine.trim().split(/\s+/).filter(Boolean).length;
  const files =
    parentCount > 1 ? null : rest.map((line) => line.trim()).filter(Boolean);

  commitCache.set(key, files);
  return files;
}

/**
 * The chart directory, relative to the repo root, that semantic-release is
 * currently running in. Derived from cwd so each chart's config does not have to
 * repeat its own path.
 */
function resolveChartPath(pluginConfig, context) {
  if (pluginConfig && typeof pluginConfig.chartPath === "string" && pluginConfig.chartPath) {
    return pluginConfig.chartPath;
  }

  const { cwd } = context;
  if (chartPathCache.has(cwd)) return chartPathCache.get(cwd);

  const root = git(["rev-parse", "--show-toplevel"], cwd).trim();
  const chartPath = relative(root, cwd).split(sep).join("/");

  if (!chartPath) {
    throw new Error(
      "semantic-release-path-filter: running from the repository root. Run semantic-release " +
        "from inside a chart directory, or set `chartPath` explicitly."
    );
  }

  chartPathCache.set(cwd, chartPath);
  return chartPath;
}

function filterCommits(commits, chartPath, cwd) {
  const prefix = chartPath.endsWith("/") ? chartPath : `${chartPath}/`;
  return (commits || []).filter((commit) => {
    const files = readCommitFiles(commit.hash, cwd);
    return files !== null && files.some((file) => file.startsWith(prefix));
  });
}

function split(pluginConfig, context) {
  const { chartPath: _ignored, ...rest } = pluginConfig || {};
  const chartPath = resolveChartPath(pluginConfig, context);
  return { chartPath, config: rest };
}

export async function analyzeCommits(pluginConfig, context) {
  const { chartPath, config } = split(pluginConfig, context);
  const commits = filterCommits(context.commits, chartPath, context.cwd);
  context.logger.log(
    "%d of %d commits touch %s",
    commits.length,
    (context.commits || []).length,
    chartPath
  );
  return defaultAnalyzeCommits(config, { ...context, commits });
}

export async function generateNotes(pluginConfig, context) {
  const { chartPath, config } = split(pluginConfig, context);
  const commits = filterCommits(context.commits, chartPath, context.cwd);
  return defaultGenerateNotes(config, { ...context, commits });
}

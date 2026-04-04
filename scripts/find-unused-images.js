const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".ico",
  ".bmp",
  ".tif",
  ".tiff",
]);

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".txt",
  ".yml",
  ".yaml",
  ".xml",
]);

const DEFAULT_EXCLUDED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".vercel",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode",
]);

function parseArgs(argv) {
  const args = {
    root: ROOT,
    excludedDirs: new Set(DEFAULT_EXCLUDED_DIRS),
    outputJson: null,
    outputText: null,
    verbose: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const value = argv[i];
    if (value === "--help" || value === "-h") return { ...args, help: true };
    if (value === "--verbose" || value === "-v") {
      args.verbose = true;
      continue;
    }
    if (value === "--root") {
      const next = argv[++i];
      if (!next) throw new Error("--root requires a path");
      args.root = path.resolve(next);
      continue;
    }
    if (value === "--exclude-dir") {
      const next = argv[++i];
      if (!next) throw new Error("--exclude-dir requires a directory name");
      args.excludedDirs.add(next);
      continue;
    }
    if (value === "--output-json") {
      const next = argv[++i];
      if (!next) throw new Error("--output-json requires a file path");
      args.outputJson = path.resolve(next);
      continue;
    }
    if (value === "--output-text") {
      const next = argv[++i];
      if (!next) throw new Error("--output-text requires a file path");
      args.outputText = path.resolve(next);
      continue;
    }

    throw new Error(`Unknown arg: ${value}`);
  }

  return args;
}

function toPosixPath(p) {
  return p.split(path.sep).join("/");
}

function walkFiles(dir, excludedDirs) {
  /** @type {string[]} */
  const results = [];
  /** @type {string[]} */
  const stack = [dir];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;

    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (excludedDirs.has(entry.name)) continue;
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile()) results.push(fullPath);
    }
  }

  return results;
}

function buildReferenceSet(textFiles, root, verbose) {
  const extensionsPattern =
    "(?:png|jpe?g|gif|svg|webp|avif|ico|bmp|tiff?|TIF|TIFF)";
  const tokenRegex = new RegExp(
    `[A-Za-z0-9_@%./\\\\-]+\\.${extensionsPattern}`,
    "g"
  );

  /** @type {Set<string>} */
  const refs = new Set();

  const addRef = (token) => {
    if (!token) return;
    let t = token.trim();
    t = t.replace(/\\/g, "/");
    t = t.replace(/^\.\/+/, "");

    // Strip protocol.
    t = t.replace(/^https?:\/\//, "");
    if (t.startsWith("//")) t = t.slice(2);

    // Strip domain if present (e.g. example.com/path/file.jpg).
    if (/^[^/]+\.[^/]+\//.test(t)) t = t.slice(t.indexOf("/") + 1);

    // Trim leading slash variants too.
    refs.add(t);
    if (t.startsWith("/")) refs.add(t.slice(1));
    else refs.add(`/${t}`);

    // Also add basename for static imports or relative refs.
    refs.add(path.posix.basename(t));
  };

  for (const file of textFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const matches = content.match(tokenRegex);
    if (!matches) continue;

    for (const match of matches) addRef(match);
  }

  if (verbose) {
    const relCount = textFiles.length;
    const sample = [...refs].slice(0, 10);
    console.log(
      `Scanned ${relCount} text files, extracted ${refs.size} unique image reference tokens.`
    );
    console.log(`Sample refs: ${sample.join(", ")}`);
  }

  return refs;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Find unused images by scanning for filename/path references.

Usage:
  node scripts/find-unused-images.js [options]

Options:
  --root <path>            Root folder to scan (default: cwd)
  --exclude-dir <name>     Exclude a directory name (repeatable)
  --output-json <path>     Write JSON report
  --output-text <path>     Write text report
  --verbose, -v            Print extra info
`);
    process.exit(0);
  }

  const allFiles = walkFiles(args.root, args.excludedDirs);

  const imageFiles = allFiles.filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) return false;
    return true;
  });

  const textFiles = allFiles.filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext)) return false;
    if (TEXT_EXTENSIONS.has(ext)) return true;

    // Also scan extensionless files that are usually text (e.g. vercel.json is covered, but keep general).
    if (!ext) return true;
    return false;
  });

  const refs = buildReferenceSet(textFiles, args.root, args.verbose);

  /** @type {{file: string, rel: string, size: number, used: boolean, matchedBy?: string}[]} */
  const results = [];

  for (const file of imageFiles) {
    const stat = fs.statSync(file);
    const rel = toPosixPath(path.relative(args.root, file));
    const basename = path.posix.basename(rel);

    const candidates = [
      rel,
      `/${rel}`,
      basename,
      rel.startsWith("images/") ? `/${rel}` : null,
      rel.startsWith("images/") ? rel : null,
    ].filter(Boolean);

    let used = false;
    let matchedBy;
    for (const candidate of candidates) {
      if (refs.has(candidate)) {
        used = true;
        matchedBy = candidate;
        break;
      }
    }

    results.push({ file, rel, size: stat.size, used, matchedBy });
  }

  const unused = results
    .filter((r) => !r.used)
    .sort((a, b) => a.rel.localeCompare(b.rel));
  const usedCount = results.length - unused.length;

  const report = {
    root: args.root,
    scannedAt: new Date().toISOString(),
    totals: { images: results.length, used: usedCount, unused: unused.length },
    unused: unused.map((u) => ({ rel: u.rel, size: u.size })),
  };

  const lines = [
    `Root: ${args.root}`,
    `Images found: ${results.length}`,
    `Used: ${usedCount}`,
    `Unused: ${unused.length}`,
    "",
    ...unused.map((u) => `${u.rel} (${u.size} bytes)`),
    "",
  ];

  if (args.outputJson) fs.writeFileSync(args.outputJson, JSON.stringify(report, null, 2));
  if (args.outputText) fs.writeFileSync(args.outputText, lines.join("\n"));

  // Always print to stdout too (so it's usable without output files).
  process.stdout.write(lines.join("\n"));

  // Exit code 1 if unused images were found (useful in CI).
  process.exit(unused.length ? 1 : 0);
}

main();


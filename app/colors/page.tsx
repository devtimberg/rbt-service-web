import { readFile } from "node:fs/promises";
import path from "node:path";

type ColorToken = {
  name: string;
  lightValue: string;
  darkValue: string;
};

type TokenGroup = {
  key: string;
  label: string;
  tokens: ColorToken[];
};

const CSS_VARIABLE_RE = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
const COLOR_VALUE_RE = /(oklch|#|rgb|hsl|lab|lch|color\(|var\(--)/i;

function parseColorVariables(content: string): Map<string, string> {
  const result = new Map<string, string>();

  for (const match of content.matchAll(CSS_VARIABLE_RE)) {
    const name = match[1].trim();
    const value = match[2].trim();

    if (!COLOR_VALUE_RE.test(value)) {
      continue;
    }

    result.set(name, value);
  }

  return result;
}

function buildColorTokens(lightMap: Map<string, string>, darkMap: Map<string, string>) {
  const names = new Set<string>([...lightMap.keys(), ...darkMap.keys()]);

  return [...names]
    .sort((a, b) => a.localeCompare(b))
    .map<ColorToken>((name) => ({
      name,
      lightValue: lightMap.get(name) ?? "not set",
      darkValue: darkMap.get(name) ?? lightMap.get(name) ?? "not set",
    }));
}

const GROUP_ORDER = [
  "background",
  "foreground",
  "brand",
  "neutral",
  "success",
  "warning",
  "danger",
  "info",
  "surface",
  "text",
  "border",
  "input",
  "focus",
  "action",
  "state",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "chart",
  "sidebar",
  "ring",
  "radius",
] as const;

function toGroupKey(tokenName: string): string {
  const normalized = tokenName.replace(/^--/, "");
  const [prefix] = normalized.split("-");
  return prefix || "other";
}

function toGroupLabel(groupKey: string): string {
  if (groupKey === "other") {
    return "Other";
  }

  return groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
}

function sortGroupKeys(a: string, b: string): number {
  const aIndex = GROUP_ORDER.indexOf(a as (typeof GROUP_ORDER)[number]);
  const bIndex = GROUP_ORDER.indexOf(b as (typeof GROUP_ORDER)[number]);

  if (aIndex === -1 && bIndex === -1) {
    return a.localeCompare(b);
  }
  if (aIndex === -1) {
    return 1;
  }
  if (bIndex === -1) {
    return -1;
  }
  return aIndex - bIndex;
}

function buildTokenGroups(tokens: ColorToken[]): TokenGroup[] {
  const groupMap = new Map<string, ColorToken[]>();

  for (const token of tokens) {
    const groupKey = toGroupKey(token.name);
    const existing = groupMap.get(groupKey);
    if (existing) {
      existing.push(token);
    } else {
      groupMap.set(groupKey, [token]);
    }
  }

  return [...groupMap.entries()]
    .sort(([a], [b]) => sortGroupKeys(a, b))
    .map(([key, groupTokens]) => ({
      key,
      label: toGroupLabel(key),
      tokens: groupTokens.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function ColorSwatch({
  tokenName,
  value,
  dark = false,
}: {
  tokenName: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "dark rounded-xl border border-border p-4" : "rounded-xl border border-border p-4"}>
      <div
        className="h-14 w-full rounded-md border border-border"
        style={{ backgroundColor: `var(${tokenName})` }}
      />
      <p className="mt-3 text-xs font-medium text-foreground">{dark ? "Dark" : "Light"}</p>
      <p className="mt-1 break-all text-xs text-muted-foreground">{value}</p>
    </div>
  );
}

export default async function ColorsPage() {
  const projectRoot = process.cwd();
  const tokensPath = path.join(projectRoot, "src/shared/styles/tokens.css");
  const darkThemePath = path.join(projectRoot, "src/shared/styles/theme-dark.css");

  const [tokensCss, darkThemeCss] = await Promise.all([
    readFile(tokensPath, "utf-8"),
    readFile(darkThemePath, "utf-8"),
  ]);

  const lightMap = parseColorVariables(tokensCss);
  const darkMap = parseColorVariables(darkThemeCss);
  const tokens = buildColorTokens(lightMap, darkMap);
  const groups = buildTokenGroups(tokens);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-3xl font-semibold tracking-tight">Color Tokens</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tokens are loaded from <code>src/shared/styles/tokens.css</code> and{" "}
          <code>src/shared/styles/theme-dark.css</code>. Renaming a token in CSS updates this page automatically.
        </p>

        <div className="mt-8 space-y-8">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
                <span className="text-xs text-muted-foreground">{group.tokens.length} tokens</span>
              </div>
              <div className="space-y-4">
                {group.tokens.map((token) => (
                  <section key={token.name} className="rounded-2xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold text-card-foreground">{token.name}</h3>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <ColorSwatch tokenName={token.name} value={token.lightValue} />
                      <ColorSwatch tokenName={token.name} value={token.darkValue} dark />
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

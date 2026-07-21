type GithubConfig = { owner: string; repo: string; branch: string; token: string };

export function getGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO; // format "owner/repo"
  if (!token || !repoFull) return null;
  const [owner, repo] = repoFull.split("/");
  if (!owner || !repo) return null;
  const branch = process.env.GITHUB_BRANCH || "main";
  return { owner, repo, branch, token };
}

async function githubRequest(config: GithubConfig, path: string, init?: RequestInit) {
  return fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
}

export async function getFileContent(
  config: GithubConfig,
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  const res = await githubRequest(config, `contents/${filePath}?ref=${config.branch}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${filePath} a échoué: ${res.status}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha as string };
}

export async function putFile(
  config: GithubConfig,
  filePath: string,
  contentBase64: string,
  message: string
) {
  const existing = await getFileContent(config, filePath);
  const res = await githubRequest(config, `contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: config.branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub PUT ${filePath} a échoué: ${res.status} ${body}`);
  }
  return res.json();
}

export async function deleteFile(config: GithubConfig, filePath: string, message: string) {
  const existing = await getFileContent(config, filePath);
  if (!existing) return; // déjà absent, rien à faire
  const res = await githubRequest(config, `contents/${filePath}`, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha: existing.sha,
      branch: config.branch,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub DELETE ${filePath} a échoué: ${res.status} ${body}`);
  }
}

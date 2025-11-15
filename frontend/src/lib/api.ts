const BASE = "http://localhost:5000/api";

export async function postJSON(path: string, body: any) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function postFile(path: string, file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(BASE + path, {
    method: "POST",
    body: form,
  });

  return res.json();
}

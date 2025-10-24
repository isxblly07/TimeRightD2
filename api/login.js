export default async function handler(req, res) {
  const response = await fetch('https://timeright.somee.com/somee-api.php?action=login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}

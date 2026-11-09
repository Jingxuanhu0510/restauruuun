export async function POST(request) {
  const body = await request.json();
  // TODO: Update the order's email address
  return Response.json({ ok: true, updated: body });
}

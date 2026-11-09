export async function POST(request) {
  const body = await request.json();

  // body will include：
  // { items: [...], total: 213, createdAt: "2025-12-06 22:30" }

  // Generate an order number (simple and random)
  const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();

  const order = {
    id: orderId,
    ...body,
  };

  // Temporary storage (for Dev environment, we will connect to the database later)
  global.latestOrder = order;

  return Response.json({ ok: true, order });
}

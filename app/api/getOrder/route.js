export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // The order is temporarily stored in the memory of the Node.js runtime
  if (global.latestOrder && global.latestOrder.id === id) {
    return Response.json({
      ok: true,
      order: global.latestOrder,
    });
  }

  return Response.json({
    ok: false,
    error: "Order not found",
  });
}

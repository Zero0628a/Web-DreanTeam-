export async function GET() {
  const data = { mensaje: 'Hola desde la API 🎉' };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

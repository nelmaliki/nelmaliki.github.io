import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  return NextResponse.json({ message: 'POST request received', data: await req.text() });
}


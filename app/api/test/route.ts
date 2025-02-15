import { NextResponse } from 'next/server';

export const TEST_ROUTE = "/api/test"
export async function POST(req: Request) {
  return NextResponse.json({ message: 'POST request received', data: await req.text()});
}


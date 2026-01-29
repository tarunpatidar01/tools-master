// app/api/tools/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { principal, rate, tenure } = await request.json()

  // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const r = rate / (12 * 100)
  const n = tenure * 12
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  return NextResponse.json({ emi: Math.round(emi) })
}

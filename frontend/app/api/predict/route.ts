import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    //const response = await axios.post('http://192.168.1.102:8000/predict/', body);
    const response = await axios.post('http://localhost:8000/predict/', body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("API Error Details:", {
      message: error.message,
      code: error.code,
      cause: error.cause,
    });
    return NextResponse.json({ error: 'Prediction failed', details: error.message }, { status: 500 });
  }
}

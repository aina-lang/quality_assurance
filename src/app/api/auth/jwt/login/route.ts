// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { Client, Subscription, JWTPayload } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    // Find the user
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM clients WHERE email = ?",
      [email]
    );
    const user = rows?.[0] as Client | undefined;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Generate JWT token with client role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: "client" } as JWTPayload,
      process.env.AUTH_SECRET as string,
      { expiresIn: "30m" }
    );

    const [rows1] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM subscriptions WHERE client_id = ?",
      [user.id]
    );
    const subscription = rows1?.[0] as Subscription | undefined;

    // Complete JSON response
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          subscription,
          token,
          user: { ...user, role: "client" as const },
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}


import { clsx, type ClassValue } from "clsx"
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge"
import { JWTPayload } from "@/app/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const verifyToken = (req: NextRequest): JWTPayload | null => {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET as string) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};
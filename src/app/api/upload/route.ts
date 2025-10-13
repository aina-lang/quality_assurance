// app/api/templates/upload/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { preview_image, name } = body;

        if (!preview_image || !name) throw new Error("Image ou nom manquant");

        const matches = preview_image.match(/^data:image\/png;base64,(.+)$/);
        if (!matches) throw new Error("Image invalide");

        const base64Data = matches[1];
        const buffer = Buffer.from(base64Data, "base64");

        const dir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const fileName = `${name.replace(/\s/g, "_")}_${Date.now()}.png`;
        const filePath = path.join(dir, fileName);

        fs.writeFileSync(filePath, buffer);

        const url = `/uploads/${fileName}`; // URL publique

        return NextResponse.json({ url }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}

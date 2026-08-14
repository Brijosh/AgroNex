import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const farms = await prisma.farm.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: farms });
  } catch (error) {
    console.error("Error fetching farms:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Ensure default demo user exists
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: "Demo Farmer", email: "farmer@cropwise.local" },
      });
    }

    const farm = await prisma.farm.create({
      data: {
        user: { connect: { id: user.id } },
        locationName: body.locationName || "Kochi, Kerala",
        latitude: parseFloat(body.latitude) || 9.9312,
        longitude: parseFloat(body.longitude) || 76.2673,
        area: parseFloat(body.area) || 2,
        areaUnit: body.areaUnit || "acres",
        soilType: body.soilType || "Loamy",
        waterAvailability: body.waterAvailability || "Moderate",
        irrigationType: body.irrigationType || "Drip",
        season: body.season || "Kharif",
      },
    });

    return NextResponse.json({ success: true, data: farm });
  } catch (error) {
    console.error("Error creating farm:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

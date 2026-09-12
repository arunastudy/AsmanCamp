import { NextResponse } from "next/server";
import { bot } from "@/lib/telegram/bot";

export async function GET() {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`;
    
    // Устанавливаем webhook
    await bot.api.setWebhook(webhookUrl);
    
    // Проверяем информацию о webhook
    const webhookInfo = await bot.api.getWebhookInfo();
    
    return NextResponse.json({
      success: true,
      message: "Webhook успешно установлен",
      webhookUrl,
      webhookInfo,
    });
  } catch (error) {
    console.error("Ошибка при установке webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

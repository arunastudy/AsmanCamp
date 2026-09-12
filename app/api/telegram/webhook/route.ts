import { webhookCallback } from "grammy";
import { bot } from "@/lib/telegram/bot";

// Обработчик для Telegram webhook
export const POST = webhookCallback(bot, "std/http");

// Отключаем кеширование для API роута
export const dynamic = "force-dynamic";

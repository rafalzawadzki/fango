"use client";

import { FangoForm } from "@/lib/fango/form";
import { fangoClient } from "@/lib/fango/client";

export default function SheetConfigForm() {
  return <FangoForm type="google-sheets" fangoClient={fangoClient} />;
}

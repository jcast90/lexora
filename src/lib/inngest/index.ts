import { Inngest } from "inngest";
import config from "@/lib/config";

const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const inngest = new Inngest({
  id: slug || "venture-os",
});

export function ventureEvent(eventName: string) {
  return `venture/${slug}/${eventName}`;
}

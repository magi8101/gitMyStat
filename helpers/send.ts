import { Options } from "@/types/AnimateOptions";
import { animate } from "./animate";


export default function Send(image: string, options?: Options) {
  return new Response(animate(image, options), {
    headers: {
      "cache-control": "public, max-age=0, s-maxage=43200, stale-if-error=3600, stale-while-revalidate=21600",
      "Content-Type": "image/svg+xml",
      Vary: "Accept-Encoding",
    },
  });
}

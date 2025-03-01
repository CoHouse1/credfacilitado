import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Hero(props: {
  title: string;
  primaryCtaText: string;
  primaryCtaLink: string;
}) {
  return (
    <section className="space-y-6 py-32 md:py-48 lg:py-52">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
     
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-7xl">
          {props.title}
        </h1>
        
        <div className="flex gap-2 flex-wrap justify-center">
          <Link
            href={props.primaryCtaLink}
            className={cn(buttonVariants({ size: "lg" })) + " text-green-100 dark:text-white"}
          >
            {props.primaryCtaText}
          </Link>

        </div>

      </div>
    </section>
  );
}

// Copied from the Video.js sandbox, apps/sandbox/app/components/ui/badge.tsx, with only the import paths changed.
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { badgeVariants } from "@preview/shell/components/ui/badge-variants";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge };

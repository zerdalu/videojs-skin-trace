// Copied from the Video.js sandbox, apps/sandbox/app/components/ui/button.tsx, with only the import paths changed.
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { buttonVariants } from "@preview/shell/components/ui/button-variants";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };

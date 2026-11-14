export const MENU_TRIGGER_CLASS =
  "group/menu-trigger-item relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-2.5 py-1.5 text-start text-sm font-semibold whitespace-nowrap text-(--media-popover-foreground,#38281A) hover:bg-(--media-accent,#F4E8D0) hover:text-(--media-accent-foreground,#38281A) media-highlighted:bg-(--media-accent,#F4E8D0) media-highlighted:text-(--media-accent-foreground,#38281A) focus-visible:outline-2 focus-visible:outline-media-ring focus-visible:outline-offset-1 transition-[background-color,color] duration-media-fast ease-in-out justify-between tabular-nums data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [[data-child-open]_&]:h-0 [[data-child-open]_&]:overflow-hidden [[data-child-open]_&]:py-0 [[data-child-open]_&]:opacity-0 [[data-child-open]_&]:pointer-events-none";

export const MENU_TRIGGER_ICON_CLASS =
  "size-5 shrink-0 text-(--media-muted-foreground,#5C4A36) group-media-highlighted/menu-trigger-item:text-inherit";

export const SUBMENU_CONTENT_CLASS =
  "flex w-full flex-col gap-0.5 rounded-xl bg-(--media-popover,#FFFDF8) p-0.5 text-(--media-popover-foreground,#38281A) outline-hidden max-h-[calc(min(var(--media-menu-available-height,16rem),16rem)-1rem)] overflow-y-auto overscroll-contain";

export const MENU_BACK_ITEM_CLASS =
  "group/menu-back-item relative mb-0.5 flex w-full cursor-pointer select-none items-center gap-1.5 rounded-xl px-2 py-1.5 text-start text-sm font-bold whitespace-nowrap text-(--media-primary,#78350F) hover:bg-(--media-accent,#F4E8D0) hover:text-(--media-accent-foreground,#38281A) media-highlighted:bg-(--media-accent,#F4E8D0) media-highlighted:text-(--media-accent-foreground,#38281A) focus-visible:outline-2 focus-visible:outline-media-ring focus-visible:outline-offset-1 transition-[background-color,color] duration-media-fast ease-in-out";

export const MENU_SEPARATOR_CLASS = "my-1 block border-b border-(--media-border,#BCA888)";

export const MENU_OPTIONS_CLASS = "flex flex-col gap-0.5";

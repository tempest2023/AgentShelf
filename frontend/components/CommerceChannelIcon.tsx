"use client";

export type CommerceChannelId = "shopify" | "tiktok" | "amazon" | "stripe";

interface CommerceChannelBrandStyle {
  accentClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  cardHoverClass: string;
  cardTextClass: string;
  iconWrapperClass: string;
  pillBorderClass: string;
}

export const commerceChannelBrandStyles: Record<
  CommerceChannelId,
  CommerceChannelBrandStyle
> = {
  shopify: {
    accentClass: "bg-emerald-500",
    cardBgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    cardBorderClass: "border-emerald-200 dark:border-emerald-800",
    cardHoverClass:
      "hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20",
    cardTextClass: "text-emerald-600 dark:text-emerald-400",
    iconWrapperClass:
      "bg-[#95BF47]/15 text-[#5F8F3F] dark:bg-[#95BF47]/20 dark:text-[#B7DA84]",
    pillBorderClass: "border-[#95BF47]/30 dark:border-[#95BF47]/25",
  },
  tiktok: {
    accentClass: "bg-pink-500",
    cardBgClass: "bg-pink-50 dark:bg-pink-950/30",
    cardBorderClass: "border-pink-200 dark:border-pink-800",
    cardHoverClass:
      "hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-pink-100 dark:hover:shadow-pink-900/20",
    cardTextClass: "text-pink-600 dark:text-pink-400",
    iconWrapperClass:
      "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950",
    pillBorderClass: "border-zinc-300 dark:border-zinc-700",
  },
  amazon: {
    accentClass: "bg-amber-500",
    cardBgClass: "bg-amber-50 dark:bg-amber-950/30",
    cardBorderClass: "border-amber-200 dark:border-amber-800",
    cardHoverClass:
      "hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-amber-100 dark:hover:shadow-amber-900/20",
    cardTextClass: "text-amber-600 dark:text-amber-400",
    iconWrapperClass:
      "bg-[#FF9900]/15 text-[#B96800] dark:bg-[#FF9900]/20 dark:text-[#FFC563]",
    pillBorderClass: "border-[#FF9900]/30 dark:border-[#FF9900]/25",
  },
  stripe: {
    accentClass: "bg-violet-500",
    cardBgClass: "bg-violet-50 dark:bg-violet-950/30",
    cardBorderClass: "border-violet-200 dark:border-violet-800",
    cardHoverClass:
      "hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-violet-100 dark:hover:shadow-violet-900/20",
    cardTextClass: "text-violet-600 dark:text-violet-400",
    iconWrapperClass:
      "bg-[#635BFF]/15 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-[#A39FFF]",
    pillBorderClass: "border-[#635BFF]/25 dark:border-[#635BFF]/20",
  },
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CommerceChannelBadge({
  channelId,
  className,
  iconClassName,
}: {
  channelId: CommerceChannelId;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={joinClasses(
        "flex items-center justify-center rounded-full",
        commerceChannelBrandStyles[channelId].iconWrapperClass,
        className
      )}
    >
      <CommerceChannelIcon channelId={channelId} className={iconClassName} />
    </div>
  );
}

export default function CommerceChannelIcon({
  channelId,
  className,
}: {
  channelId: CommerceChannelId;
  className?: string;
}) {
  switch (channelId) {
    case "shopify":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M7 8.25C7 7.56 7.56 7 8.25 7h7.5C16.44 7 17 7.56 17 8.25V9H7v-.75Z"
            fill="#8DBB46"
          />
          <path
            d="M6 9.25h12l1.05 9.04A1.5 1.5 0 0 1 17.56 20H6.44a1.5 1.5 0 0 1-1.49-1.71L6 9.25Z"
            fill="#95BF47"
          />
          <path
            d="M9 9V7a3 3 0 0 1 6 0v2"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="7.6"
            fontWeight="700"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            S
          </text>
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"
            fill="currentColor"
          />
        </svg>
      );
    case "amazon":
      return (
        <svg viewBox="0 0 448 512" className={className} fill="none">
          <path
            d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1Zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6Zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12Zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1Z"
            fill="currentColor"
          />
        </svg>
      );
    case "stripe":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="2.5" y="4" width="19" height="16" rx="5" fill="#635BFF" />
          <text
            x="12"
            y="15.2"
            textAnchor="middle"
            fontSize="8.4"
            fontWeight="700"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            S
          </text>
        </svg>
      );
  }
}

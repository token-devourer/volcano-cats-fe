"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  // Lava-gradient — the one primary, "do this" action.
  primary:
    "bg-lava-gradient text-cream shadow-card-normal hover:shadow-lava-glow " +
    "border border-transparent",
  // Gold — secondary / reward.
  secondary:
    "bg-gold-gradient text-ink font-semibold border border-transparent " +
    "hover:shadow-gold-glow",
  // Outline — quiet but present.
  outline:
    "bg-transparent text-ink border border-panel-line hover:border-lava " +
    "hover:text-lava",
  // Ghost — lowest emphasis, text-only until hovered. Light text for the
  // wood/dark surfaces it usually sits on (table, backdrops). On cream
  // panels use `outline` instead.
  ghost:
    "bg-transparent text-cream/85 border border-transparent " +
    "hover:bg-wood-deep/50 hover:text-cream",
  // Ember — destructive.
  danger:
    "bg-ember text-cream border border-transparent hover:bg-ember/90",
};

const SIZES: Record<ButtonSize, string> = {
  // sm has no 44px floor (used in dense toolbars); md/lg meet the touch target.
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "min-h-[44px] px-4 text-sm rounded-xl gap-2",
  lg: "min-h-[44px] px-6 py-3 text-base rounded-xl gap-2",
};

/**
 * The one button primitive. Forwards a ref + all native button props.
 * Visible lava focus ring, active press-down, clearly dimmed disabled state.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth = false, className, type = "button", disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(
        // Base
        "inline-flex items-center justify-center font-body font-medium select-none",
        "transition-[transform,box-shadow,background-color,border-color,color] duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-lava focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
        // Press feedback (no-ops under reduced motion via the global CSS rule)
        "active:scale-95",
        // Disabled — dimmed + desaturated, not just lower opacity
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-50 disabled:shadow-none disabled:active:scale-100",
        fullWidth && "w-full",
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

// ============================================================
// VOLCANO CATS — DESIGN-SYSTEM PRIMITIVES (barrel)
// ============================================================
// Pure presentational components. None of these read game state or the
// network — they take data via props. See DESIGN.md for the visual system.
// ============================================================

export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Modal } from "./Modal";
export type { DialogProps } from "./Modal";

export { Sheet, ResponsiveDialog } from "./Sheet";

export type { AccentToken } from "./useDialogA11y";

export { Avatar } from "./Avatar";
export type { AvatarProps, AvatarSize } from "./Avatar";

export { StatusBadge } from "./StatusBadge";
export type { StatusBadgeProps, StatusVariant } from "./StatusBadge";

export { Toast } from "./Toast";
export type { ToastProps, ToastData, ToastTone } from "./Toast";

export { ToastRegion } from "./ToastRegion";
export type { ToastRegionProps } from "./ToastRegion";

export { Spinner } from "./Spinner";
export type { SpinnerProps, SpinnerSize } from "./Spinner";

export { Card } from "./Card";
export type { CardProps, CardSize } from "./Card";

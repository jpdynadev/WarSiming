// netlify-identity-widget.d.ts
declare module "netlify-identity-widget" {
  /** Minimal shape of a typical Netlify Identity user. Add more fields as needed. */
  interface User {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      [key: string]: any;
    };
    // ... plus other fields you might need
  }

  /** Initialize Netlify Identity. */
  export function init(opts?: { container?: string; [key: string]: any }): void;

  /** Open the identity modal. Optionally open directly to a given tab. */
  export function open(tabName?: "login" | "signup" | "recover"): void;

  /** Close the identity modal. */
  export function close(): void;

  /**
   * Add an event listener. Example events:
   *  - init
   *  - login
   *  - logout
   *  - signup
   *  - error
   *  - open
   *  - close
   *
   * The callback may receive a User or an Error depending on event type.
   */
  export function on(
    event: "init" | "login" | "logout" | "signup" | "error" | "open" | "close",
    callback: (userOrErr?: User | Error) => void
  ): void;

  /** Remove an event listener. */
  export function off(
    event: "init" | "login" | "logout" | "signup" | "error" | "open" | "close",
    callback?: (userOrErr?: User | Error) => void
  ): void;

  /**
   * Logs out the current user and returns a Promise (even if you don't use it).
   */
  export function logout(): Promise<void>;

  /**
   * Returns the current user (if any), or null if not logged in.
   */
  export function currentUser(): User | null;

  /**
   * Manually refresh the user's JWT, returns a Promise resolving to the JWT string.
   */
  export function refresh(): Promise<string>;

  /**
   * Set language for the UI. e.g. netlifyIdentity.setLocale("en");
   */
  export function setLocale(locale: string): void;

  /** The underlying GoTrue client, if you need more low-level access. */
  export const gotrue: any;
}

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useTransition,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IosSpinner } from "@/components/ui/ios-spinner";

interface RouteLoadingContextType {
  isNavigating: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const RouteLoadingContext = createContext<RouteLoadingContextType>({
  isNavigating: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function useRouteLoading() {
  return useContext(RouteLoadingContext);
}

/**
 * Inner component to track pathname & searchParams changes within Suspense.
 */
function NavigationWatcher({
  onNavigationComplete,
}: {
  onNavigationComplete: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onNavigationComplete();
  }, [pathname, searchParams, onNavigationComplete]);

  return null;
}

export function RouteLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();

  const stopLoading = useCallback(() => {
    setIsNavigating(false);
  }, []);

  const startLoading = useCallback(() => {
    setIsNavigating(true);
  }, []);

  // Global click interceptor for instant navigation feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore modified clicks (Ctrl, Cmd, Shift, Alt) or non-left clicks
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore anchor jumps, protocols, downloads, target blanks
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Check if internal navigation
        if (targetUrl.origin !== currentUrl.origin) {
          return;
        }

        // If exact same path and query, ignore
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        // Immediate instant trigger without delay
        startTransition(() => {
          setIsNavigating(true);
        });
      } catch {
        // invalid URL format, ignore
      }
    };

    const handlePopState = () => {
      startTransition(() => {
        setIsNavigating(true);
      });
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Safety fallback timeout to prevent infinite stuck loader on cancelled requests
  useEffect(() => {
    if (!isNavigating) return;

    const timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [isNavigating]);

  return (
    <RouteLoadingContext.Provider
      value={{ isNavigating, startLoading, stopLoading }}
    >
      <Suspense fallback={null}>
        <NavigationWatcher onNavigationComplete={stopLoading} />
      </Suspense>

      {/* Screen Loading Overlay */}
      {isNavigating && (
        <div
          id="route-navigation-loading"
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-white"
          style={{ pointerEvents: "all" }}
          aria-live="assertive"
          aria-busy="true"
        >
          <IosSpinner size="lg" />
        </div>
      )}

      {children}
    </RouteLoadingContext.Provider>
  );
}

import * as Notifications from "expo-notifications";
import { router, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";

export function useNotificationObserver() {
  const rootNavigationState = useRootNavigationState();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // 1. Handle notification that opened the app (cold start)
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data?.url &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const url =
        lastNotificationResponse.notification.request.content.data.url;
      if (typeof url === "string") {
        setPendingUrl(url);
      }
    }
  }, [lastNotificationResponse]);

  // 2. Listen for incoming notifications while app is running
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;
        if (typeof url === "string") {
          setPendingUrl(url);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // 3. Navigate only when the navigation state is ready and we have a URL
  useEffect(() => {
    if (rootNavigationState?.key && pendingUrl) {
      router.push(pendingUrl as any);
      setPendingUrl(null); // Clear it so we don't navigate twice
    }
  }, [rootNavigationState, pendingUrl]);
}
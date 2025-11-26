import { useEffect, useRef, useState } from 'react';

interface UseWebSocketProps {
  url: string;
  onMessage?: (data: any) => void;
  enabled?: boolean;
}

export const useWebSocket = ({ url, onMessage, enabled = true }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      try {
        onMessage?.(event.data);
      } catch (error) {
        console.error('Error receiving message:', error);
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url, enabled, onMessage]);

  return { isConnected };
};
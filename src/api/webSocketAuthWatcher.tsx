import { useEffect } from 'react';
import { watchAuthToken } from './connectWebSocket';


export const WebSocketAuthWatcher = () => {
    useEffect(() => {
        // Setup token watcher and get cleanup function
        return watchAuthToken();
    }, []);
    return null;
};

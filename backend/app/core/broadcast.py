from broadcaster import Broadcast
from app.core.config import Settings
import asyncio
import threading

broadcast = Broadcast(Settings.REDIS_URL)
_loop = None
_loop_thread = None

def _start_event_loop():
    """Inicia un event loop dedicado en un hilo separado"""
    global _loop
    _loop = asyncio.new_event_loop()
    asyncio.set_event_loop(_loop)
    _loop.run_forever()

def _get_event_loop():
    """Obtiene o crea el event loop compartido"""
    global _loop, _loop_thread
    if _loop is None or _loop.is_closed():
        _loop_thread = threading.Thread(target=_start_event_loop, daemon=True)
        _loop_thread.start()
        # Esperar a que el loop esté listo
        while _loop is None:
            threading.Event().wait(0.01)
    return _loop

def send_message(channel: str, message: str):
    """Función helper para enviar mensajes desde contexto Celery"""
    try:
        loop = _get_event_loop()
        future = asyncio.run_coroutine_threadsafe(
            broadcast.publish(channel=channel, message=message), 
            loop
        )
        future.result(timeout=5)
    except Exception as e:
        print(f"Error enviando mensaje: {e}")
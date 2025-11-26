from celery import Celery
from app.core.config import Settings

celery = Celery(
    "worker",
    broker=Settings.REDIS_URL,
    backend=Settings.REDIS_URL
)

celery.conf.update(
    task_track_started=True
)

from app.tasks import analysis_tasks

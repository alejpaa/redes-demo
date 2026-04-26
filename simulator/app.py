import math
import os
import random
import threading
import time
from dataclasses import dataclass

from flask import Flask, jsonify, request, Response
from prometheus_client import CollectorRegistry, Gauge, generate_latest, CONTENT_TYPE_LATEST


@dataclass
class Profile:
    name: str
    cooling_ratio: float
    other_kw: float


PROFILES = {
    "good": Profile("good", cooling_ratio=0.35, other_kw=8.0),
    "normal": Profile("normal", cooling_ratio=0.60, other_kw=12.0),
    "bad": Profile("bad", cooling_ratio=0.95, other_kw=16.0),
}


registry = CollectorRegistry()
it_power = Gauge("pue_it_power_kw", "IT servers power in kW", registry=registry)
cooling_power = Gauge("pue_cooling_power_kw", "Cooling power in kW", registry=registry)
other_power = Gauge("pue_other_power_kw", "Auxiliary power in kW", registry=registry)
total_power = Gauge("pue_total_power_kw", "Total data center power in kW", registry=registry)
pue_value = Gauge("pue_value", "Power usage effectiveness", registry=registry)

app = Flask(__name__)
lock = threading.Lock()

step_seconds = float(os.getenv("STEP_SECONDS", "2"))
current_profile = PROFILES.get(os.getenv("START_PROFILE", "normal"), PROFILES["normal"])
phase = 0.0


def update_loop() -> None:
    global phase
    while True:
        with lock:
            phase += 0.15
            base_it = 55 + (8 * math.sin(phase)) + random.uniform(-2.2, 2.2)
            it_kw = max(35.0, base_it)

            cooling_kw = max(
                10.0,
                (it_kw * current_profile.cooling_ratio) + random.uniform(-1.6, 1.6),
            )
            other_kw = max(4.0, current_profile.other_kw + random.uniform(-1.0, 1.0))

            total_kw = it_kw + cooling_kw + other_kw
            pue = total_kw / it_kw

            it_power.set(round(it_kw, 3))
            cooling_power.set(round(cooling_kw, 3))
            other_power.set(round(other_kw, 3))
            total_power.set(round(total_kw, 3))
            pue_value.set(round(pue, 4))

        time.sleep(step_seconds)


@app.get("/")
def root() -> Response:
    with lock:
        return jsonify(
            {
                "status": "ok",
                "profile": current_profile.name,
                "available_profiles": list(PROFILES.keys()),
                "usage": "POST /profile/<good|normal|bad>",
            }
        )


@app.post("/profile/<name>")
def set_profile(name: str) -> Response:
    global current_profile
    profile = PROFILES.get(name)
    if profile is None:
        return jsonify({"error": f"invalid profile '{name}'"}), 400

    with lock:
        current_profile = profile
    return jsonify({"status": "ok", "profile": current_profile.name})


@app.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(registry), mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":
    thread = threading.Thread(target=update_loop, daemon=True)
    thread.start()
    app.run(host="0.0.0.0", port=8000)

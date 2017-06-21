import re
import asyncio
import subprocess
from sanic import Sanic
from sanic.response import json

app = Sanic()


async def _run(cmd, **kwargs):
    process = await asyncio.create_subprocess_shell(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        **kwargs)
    stdout, stderr = await process.communicate()
    return stdout.decode() if stdout else '', stderr.decode() if stderr else ''


async def ping(host):
    cmd = 'ping -W 5 -q -c 100 -i 0.01 {}'.format(host)
    res, _ = await _run(cmd)
    result = {}

    transmitted = re.findall('\d+ packets transmitted', res)
    if transmitted:
        result['transmitted'] = int(transmitted[0][:-20])

    received = re.findall('\d+ packets received', res)
    if received:
        result['received'] = int(received[0][:-17])
    else:
        received = re.findall('\d+ received', res)
        if received:
            result['received'] = int(received[0][:-9])

    loss = re.findall('[\d+\.]+% packet loss', res)
    if loss:
        result['loss'] = float(loss[0][:-13])

    round_trip = re.findall('round-trip min/avg/max/stddev = [\d\.]+/[\d\.]+/[\d\.]+/[\d\.]+ ms', res)
    if round_trip:
        round_trip = round_trip[0][32:-3]
        result['trip_min'], result['trip_avg'], result['trip_max'], result['trip_stddev'] = (float(x) for x in round_trip.split('/'))
    else:
        round_trip = re.findall('rtt min/avg/max/mdev = [\d\.]+/[\d\.]+/[\d\.]+/[\d\.]+ ms', res)
        if round_trip:
            round_trip = round_trip[0][23:-3]
            result['trip_min'], result['trip_avg'], result['trip_max'], result['trip_mdev'] = (float(x) for x in round_trip.split('/'))

    return result or res


@app.route("/ping/<host:[A-z0-9.]+>")
async def test(request, host):
    res = await ping(host)
    if isinstance(res, dict):
        return json(res)
    else:
        return json({'error': res})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

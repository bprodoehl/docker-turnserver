/**
 * Created by congchen on 5/31/17.
 */

var result = `PING google (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.048 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.054 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.072 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.084 ms

--- 127.0.0.1 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.048/0.065/0.084/0.014 ms`

function parsePingResult(output){
  let reg1 = /PING ([\w\.]+) \(([\d\.]+)\): [\d]+ data bytes/g;
  let reg2 = /(\d+) packets transmitted, (\d+) packets received, ([\d\.\%]+) packet loss/g;

  let r1 = reg1.exec(result);
  let r2 = reg2.exec(result)

  return {
    'host':r1[1],
    'ip':r1[2],
    'packets_transmitted': r2[1],
    'packets_received': r2[2],
    'packet_loss': r2[3],
    'output':output
  }
}


// parsePingResult(result);

console.log(parsePingResult(result))
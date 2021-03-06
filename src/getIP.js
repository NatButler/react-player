const getIP = () => {
	return new Promise( (resolve, reject) => {
		const RTCPeerConnection = window.RTCPeerConnection;

		if (RTCPeerConnection) ( () => {
			const rtc = new RTCPeerConnection({ iceServers:[] });
			rtc.createDataChannel('', { reliable: false });

			let addrs = {};
			addrs['0.0.0.0'] = false;

			const addAddr = newAddr => {
				if (newAddr in addrs) { return; }
				else { addrs[newAddr] = true; }
				let ip = Object.keys(addrs).filter(k => { return addrs[k]; });

				resolve( ip.join(' or perhaps ') || 'n/a' );
			}

			const grepSDP = sdp => {
				sdp.split('\r\n').forEach(line => {
					if ( ~line.indexOf('a=candidate') ) {
						let parts = line.split(' ');
						let addr = parts[4];
						let type = parts[7];
						if (type === 'host') { addAddr(addr); }
					} 
					else if ( ~line.indexOf('c=') ) {
						let parts = line.split(' ');
						let addr = parts[2];
						addAddr(addr);
					}
				});
			}

			rtc.onicecandidate = evt => {
				// Convert the candidate to SDP so we can run it through our general parser
				if (evt.candidate) { grepSDP('a='+evt.candidate.candidate); }
			}
			rtc.createOffer(offerDesc => {
				grepSDP(offerDesc.sdp);
				rtc.setLocalDescription(offerDesc);
			}, e => { reject('Offer failed:', e); });

		} )();
	});
}

export default getIP;
use std::{sync::Arc, time::Duration};

use futures_util::{SinkExt, StreamExt};

use tokio::{
    net::TcpListener,
    sync::{Mutex, broadcast},
    time::interval,
};

use tokio_tungstenite::{accept_async, tungstenite::Bytes};

use crate::lib::grass::Grass;

mod lib;

#[tokio::main]
async fn main() {
    // Bind TCP listener on port 8080
    let listener = TcpListener::bind("127.0.0.1:3012")
        .await
        .expect("Failed to bind");

    println!("WebSocket server listening");

    let (grass_tx, _) = broadcast::channel::<()>(32);

    let lawn: Arc<Mutex<Vec<Grass>>> = Arc::new(Mutex::new(Vec::<Grass>::new()));

    let gl_lawn = lawn.clone();

    let gl_broadcast_sender = grass_tx.clone();

    let grass_lifecycle = tokio::spawn(async move {
        let mut grass_interval = interval(Duration::from_secs(10));

        loop {
            grass_interval.tick().await;

            let mut lawn_h = gl_lawn.lock().await;

            for blade in lawn_h.iter_mut() {
                blade.tick();
            }

            println!("lawn_h: {:?}", lawn_h.len());

            if lawn_h.len() < 151 {
                let grass = Grass::new();
                lawn_h.push(grass);
            }

            if gl_broadcast_sender.receiver_count() > 0 {
                if let Err(e) = gl_broadcast_sender.send(()) {
                    eprintln!(
                        "Could not broadcast grass state after lifecycle tick : {}",
                        e,
                    );
                }
            }
        }
    });

    // For each outside connection
    while let Ok((tcp_stream, _)) = listener.accept().await {
        let ws_lawn = lawn.clone();

        let mut m_grass_rx = grass_tx.subscribe();
        let client_broadcast_sender = grass_tx.clone();

        tokio::spawn(async move {
            // Upgrade TCP connection to WebSocket
            let ws_stream = accept_async(tcp_stream).await.expect("Handshake failed");

            let (mut write, mut read) = ws_stream.split();
            // new scope to unlock the mutex in the end
            {
                let lawn_h = ws_lawn.lock().await;

                let wrapped = lawn_h.iter().flat_map(|l| l.wrap()).collect::<Vec<u8>>();

                let message = tokio_tungstenite::tungstenite::Message::Binary(wrapped.into());

                if let Err(e) = write.send(message).await {
                    eprintln!("Failed to send current state of field ! {}", e)
                }
            }

            loop {
                tokio::select! {
                    Some(msg) = read.next() => {

                        // For now, messages can only be deletion of grass blades, this will be refactored
                        let bytes: Bytes = msg.expect("Read error").into();

                        if bytes.len() <= 4 {
                            println!("Disconnected client.");
                            break;
                        }



                        if bytes[..5] != *lib::ws::HEADER.as_bytes() {
                            eprintln!("Invalid header received, ignoring message: {:?}", bytes)
                        }


                        let blade_id: u32 = u32::from_ne_bytes(bytes[5..9].try_into().unwrap());

                        println!("Deleting blade id: {}", blade_id);

                        let mut lawn_h = ws_lawn.lock().await;


                        lawn_h.retain(|b|{ b.id != blade_id });

                        if let Err(e) = client_broadcast_sender.send(()) {
                            println!("Faild to broadcast newly cut grass to clients: {}",e);
                        }

                    }
                    _ = m_grass_rx.recv() => {

                        let lawn_h = ws_lawn.lock().await;

                        let wrapped = lawn_h.iter().flat_map::<Vec<u8>, _>(|l| {l.wrap().into()}).collect();

                        let message = tokio_tungstenite::tungstenite::Message::Binary(wrapped);

                        if let Err(e) = write.send(message).await {
                            eprintln!("Failed to send current state of field ! {}", e)
                        }
                    }
                }
            }
        });
    }

    grass_lifecycle.await.expect("Grass lifecycle failed.");
}

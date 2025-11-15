module contract::bluga;

use std::string::String;
use sui::clock::{Clock, timestamp_ms};

public struct BlugaCertificate has key, store {
    id: UID,
    file_hash: String,
    filename: String,
    filetype: String,
    walrus_url: String,
    creator_address: address,
    created_at: u64, // ms
}

entry fun mint_certificate(
    file_hash: String,
    filename: String,
    filetype: String,
    walrus_url: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    let timestamp = timestamp_ms(clock);
    let certificate = BlugaCertificate {
        id: object::new(ctx),
        file_hash,
        filename,
        filetype,
        walrus_url,
        creator_address: sender,
        created_at: timestamp
    };
    transfer::transfer(certificate, sender);
}
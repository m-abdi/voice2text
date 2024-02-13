mod utils;
use std::io::Cursor;
use wav::{write, BitDepth, Header, WAV_FORMAT_IEEE_FLOAT};
use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

#[wasm_bindgen]
pub fn change_range(input: &[f32]) -> Vec<f32> {
    let mut output = Vec::with_capacity(input.len());
    for x in input {
        output.push(x * 32767.0)
    }
    output
}

#[wasm_bindgen]
pub fn microphone_to_wav(samples: &[f32], channels: u16, sample_rate: u32) -> Vec<u8> {
    let bits_per_sample: u16 = 32;
    let bytes_per_sample = bits_per_sample / 8;
    let bytes_per_second = bits_per_sample as u32 * channels as u32 * sample_rate;
    let header = Header {
        channel_count: channels,
        sampling_rate: sample_rate,
        bits_per_sample,
        bytes_per_sample,
        bytes_per_second,
        audio_format: WAV_FORMAT_IEEE_FLOAT, // IEEE float
    };
    let data = BitDepth::ThirtyTwoFloat(samples.to_owned());
    let mut writer = Cursor::new(Vec::new());
    write(header, &data, &mut writer).unwrap(); // write the data to the vector
    writer.into_inner()
}
